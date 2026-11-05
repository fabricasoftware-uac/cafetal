// Genera los modelos 3D del sitio con Meshy (texto → 3D, previa + refinado con PBR) y los baja a public/3d/.
// Uso: node scripts/meshy.mjs [nombre...]   (sin nombres: todos los que falten)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { clave } from './entorno.mjs'

const API = 'https://api.meshy.ai/openapi/v2/text-to-3d'
const KEY = clave('MESHY_API_KEY')
const SALIDA = 'public/3d'

const MODELOS = {
  taza: 'elegant white porcelain coffee cup on a matching saucer, empty, smooth glossy ceramic, classic curved handle, minimal design, no logo, no text',
  grano: 'photorealistic macro of one roasted arabica coffee bean, oval, deep espresso brown, matte with a slight oily sheen, a single thin S-shaped crease line down the flat side, no inner color, no gold',
  mancuerna: 'single stylish hexagonal dumbbell, matte black with brushed brass handle, product render, clean',
  portatil: 'open slim laptop computer, aluminium silver, minimal modern design, screen dark, product render',
  mochila: 'vintage canvas hiking backpack, olive green with brown leather straps, product render',
  hamaca: 'woven colombian hammock hanging between two short wooden posts, colorful striped cotton, product render',
  sachet: 'square coffee sachet like a tea bag, white filter paper pouch with ground coffee inside, cotton string with a small black paper tag on top',
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms))

async function pedir(ruta, opciones = {}) {
  const r = await fetch(ruta, {
    ...opciones,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...opciones.headers },
  })
  const cuerpo = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${cuerpo.slice(0, 300)}`)
  return JSON.parse(cuerpo)
}

async function esperarTarea(id, etiqueta) {
  for (;;) {
    const t = await pedir(`${API}/${id}`)
    process.stdout.write(`\r${etiqueta}: ${t.status} ${t.progress ?? 0}%   `)
    if (t.status === 'SUCCEEDED') {
      process.stdout.write('\n')
      return t
    }
    if (t.status === 'FAILED' || t.status === 'CANCELED') throw new Error(`${etiqueta}: ${t.status} ${JSON.stringify(t.task_error ?? '')}`)
    await espera(8000)
  }
}

async function generar(nombre) {
  const destino = `${SALIDA}/${nombre}.glb`
  if (existsSync(destino)) return console.log(`${nombre}: ya existe, se omite`)
  const previa = await pedir(API, {
    method: 'POST',
    body: JSON.stringify({ mode: 'preview', prompt: MODELOS[nombre], art_style: 'realistic', should_remesh: true, target_polycount: 30000, topology: 'triangle' }),
  })
  await esperarTarea(previa.result, `${nombre} previa`)
  const refinado = await pedir(API, {
    method: 'POST',
    body: JSON.stringify({ mode: 'refine', preview_task_id: previa.result, enable_pbr: true }),
  })
  const listo = await esperarTarea(refinado.result, `${nombre} refinado`)
  const url = listo.model_urls?.glb
  if (!url) throw new Error(`${nombre}: sin GLB en la respuesta`)
  const glb = Buffer.from(await (await fetch(url)).arrayBuffer())
  writeFileSync(destino, glb)
  if (listo.thumbnail_url) writeFileSync(`${SALIDA}/${nombre}.png`, Buffer.from(await (await fetch(listo.thumbnail_url)).arrayBuffer()))
  console.log(`${nombre}: ${(glb.length / 1024 / 1024).toFixed(2)} MB → ${destino}`)
}

mkdirSync(SALIDA, { recursive: true })
const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(MODELOS)
// En paralelo: cada modelo tarda varios minutos en los servidores de Meshy
const resultados = await Promise.allSettled(pedidos.map(generar))
for (const [i, r] of resultados.entries()) if (r.status === 'rejected') console.error(`${pedidos[i]}: ERROR ${r.reason.message}`)
