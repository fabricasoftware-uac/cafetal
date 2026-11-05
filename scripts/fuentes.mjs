// Convierte LOGGER.TTF del manual a WOFF2 (sin Python; ver Gotchas Verificados → "WOFF2 sin Python")
import { readFile, writeFile } from 'node:fs/promises'
import subsetFont from 'subset-font'

const ttf = await readFile('Manual-Marca/fonts/LOGGER.TTF')
// LOGGER solo trae mayúsculas y puntuación básica
const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑÜ !&?,.-:;·'
const woff2 = await subsetFont(ttf, caracteres, { targetFormat: 'woff2' })
await writeFile('src/app/fuentes/logger.woff2', woff2)
console.log(`logger.woff2 ${(woff2.length / 1024).toFixed(1)} KB`)
