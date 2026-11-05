// Lee .env.local sin dependencias. Solo para los scripts de generación de recursos (nunca en el cliente).
import { readFileSync } from 'node:fs'

export function clave(nombre) {
  const texto = readFileSync('.env.local', 'utf8')
  const linea = texto.split(/\r?\n/).find((l) => l.startsWith(`${nombre}=`))
  const valor = linea?.slice(nombre.length + 1).trim()
  if (!valor) throw new Error(`Falta ${nombre} en .env.local`)
  return valor
}
