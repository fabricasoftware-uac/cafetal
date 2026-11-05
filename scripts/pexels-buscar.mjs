// Busca videos en Pexels y muestra candidatos (id, duración, autor, tamaños). Uso: node scripts/pexels-buscar.mjs "consulta"
import { clave } from './entorno.mjs'
const q = process.argv[2]
const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&orientation=landscape&per_page=12`, { headers: { Authorization: clave('PEXELS_API_KEY') } })
const d = await r.json()
for (const v of d.videos ?? []) {
  const hd = v.video_files.filter((f) => f.width >= 1280 && f.width <= 1920).sort((a, b) => a.width - b.width)[0]
  console.log(`${v.id} | ${v.duration}s | ${v.user.name} | ${hd?.width}x${hd?.height} | ${v.url}`)
}
