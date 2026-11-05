// Baja un video de Pexels, lo comprime para web (H.264, sin audio, faststart) y guarda póster y crédito.
// Uso: node scripts/pexels-video.mjs <id> <nombre>
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { clave } from './entorno.mjs'
const [id, nombre] = process.argv.slice(2)
const v = await (await fetch(`https://api.pexels.com/videos/videos/${id}`, { headers: { Authorization: clave('PEXELS_API_KEY') } })).json()
const f = v.video_files.filter((x) => x.width <= 1920 && x.file_type === 'video/mp4').sort((a, b) => b.width - a.width)[0]
mkdirSync('public/video', { recursive: true })
const tmp = `brand/tmp-${nombre}.mp4`
writeFileSync(tmp, Buffer.from(await (await fetch(f.link)).arrayBuffer()))
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-an', '-vf', 'scale=1600:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `public/video/${nombre}.mp4`])
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '1', '-i', tmp, '-frames:v', '1', '-vf', 'scale=1600:-2', '-q:v', '4', `public/video/${nombre}.jpg`])
rmSync(tmp)
const creditos = existsSync('public/video/creditos.json') ? JSON.parse(readFileSync('public/video/creditos.json', 'utf8')) : {}
creditos[nombre] = { id: v.id, autor: v.user.name, url: v.url, licencia: 'Pexels License' }
writeFileSync('public/video/creditos.json', JSON.stringify(creditos, null, 2))
console.log(`${nombre}: ${f.width}x${f.height} de ${v.user.name}`)
