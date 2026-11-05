// Pasa los recortes de Manual-Marca/recortes/*.png (transparentes) a public/img/recortes/*.webp
// Si cambias un recorte, sube el número de versión del nombre (y en src/lib/productos.ts): la caché de imágenes de Next guarda la versión vieja aunque el archivo cambie.
// recortando el margen vacío. Uso: node scripts/recortes.mjs
import { readdirSync } from 'node:fs'
import sharp from 'sharp'
for (const f of readdirSync('Manual-Marca/recortes').filter((x) => x.endsWith('.png'))) {
  const nombre = f.replace('.png', '')
  const info = await sharp(`Manual-Marca/recortes/${f}`).trim({ threshold: 1 }).resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 95 }).toFile(`public/img/recortes/${nombre}-4.webp`)
  console.log(nombre, info.width, info.height, `${Math.round(info.size / 1024)} KB`)
}
