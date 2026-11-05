// Genera los efectos de sonido del sitio con ElevenLabs (texto → efecto) y los baja a public/sonidos/.
// Uso: node scripts/sonidos.mjs [nombre...]   (sin nombres: todos los que falten)
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { clave } from './entorno.mjs'

const KEY = clave('ELEVENLABS_API_KEY')
const SALIDA = 'public/sonidos'

const SONIDOS = {
  granos: { texto: 'a small handful of roasted coffee beans dropping and bouncing on a wooden table, crisp, close up', segundos: 2 },
  vertido: { texto: 'hot coffee being poured slowly into a porcelain cup, close up, warm and gentle, no music', segundos: 3 },
  tintineo: { texto: 'a single soft clink of a porcelain coffee cup set down on its saucer', segundos: 1 },
  sobre: { texto: 'a paper sachet envelope being torn open quickly, short crisp paper rip', segundos: 1 },
  menu: { texto: 'soft liquid swoosh as a cup fills quickly, smooth and elegant, short', segundos: 1.5 },
  lista: { texto: 'a small warm bell ding, gentle and elegant, cafe counter bell, single hit', segundos: 1.2 },
  // Ronda 3b: sonidos con más gracia
  despegue: { texto: 'playful cartoon whoosh rocket launch upwards with bubbly coffee splash and a cheerful cork pop at the end', segundos: 1.8 },
  bienvenida: { texto: 'short joyful welcome jingle: a porcelain cup clink, a quick coffee pour and a happy marimba sparkle flourish, bright and fun', segundos: 2.6 },
  pop: { texto: 'single soft bubbly pop, cute and satisfying, like a coffee bubble bursting, very short', segundos: 0.5 },
  gota: { texto: 'one coffee drop plopping into a full cup, round liquid bloop, close and clean', segundos: 0.7 },
  subida: { texto: 'quick lively burst of roasted coffee beans rattling in a tin and scattering on a wooden table, ending with one bright porcelain cup clink, crisp and close', segundos: 1.6 },
  eleccion: { texto: 'a metal spoon scooping fresh ground coffee from a tin, followed by a quick handful of roasted coffee beans dropping into a grinder hopper, crisp close coffee shop foley', segundos: 1.2 },
  liquido: { texto: 'short splash of hot coffee poured into a ceramic mug, quick and clean', segundos: 0.9 },
  vitrina: { texto: 'smooth elegant airy whoosh, a soft swipe of air passing by left to right, clean and premium UI transition sound, no music', segundos: 0.8 },
  campana: { texto: 'bright cheerful service bell ding ding, clear and happy, two quick hits', segundos: 1.2 },
}

mkdirSync(SALIDA, { recursive: true })
const pedidos = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SONIDOS)
for (const nombre of pedidos) {
  const destino = `${SALIDA}/${nombre}.mp3`
  if (existsSync(destino)) {
    console.log(`${nombre}: ya existe, se omite`)
    continue
  }
  const s = SONIDOS[nombre]
  const r = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: s.texto, duration_seconds: s.segundos, prompt_influence: 0.55 }),
  })
  if (!r.ok) {
    console.error(`${nombre}: ERROR ${r.status} ${(await r.text()).slice(0, 300)}`)
    continue
  }
  const mp3 = Buffer.from(await r.arrayBuffer())
  writeFileSync(destino, mp3)
  console.log(`${nombre}: ${(mp3.length / 1024).toFixed(0)} KB → ${destino}`)
}
