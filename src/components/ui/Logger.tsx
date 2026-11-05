import type { ElementType, ReactNode } from 'react'

/*
 * LOGGER solo trae A–Z, Ó y poca puntuación: sin Á, É, Í, Ú, Ñ ni Ü.
 * Para no mezclar fuentes dentro de una palabra se dibuja la letra base de LOGGER y encima la
 * tilde (o la virgulilla). El resto del texto queda tal cual; solo la letra compuesta lleva su
 * versión accesible aparte, así el texto sigue siendo legible y visible para todos.
 */
const COMPUESTAS: Record<string, [string, string]> = {
  Á: ['A', '´'],
  É: ['E', '´'],
  Í: ['I', '´'],
  Ú: ['U', '´'],
  Ñ: ['N', '˜'],
  Ü: ['U', '¨'],
}

interface Props {
  children: string
  as?: ElementType
  className?: string
}

export function Logger({ children, as: Etiqueta = 'span', className }: Props) {
  const texto = children.toLocaleUpperCase('es')
  const piezas: ReactNode[] = []
  let tramo = ''
  let clave = 0
  for (const c of texto) {
    const compuesta = COMPUESTAS[c]
    if (!compuesta) {
      tramo += c
      continue
    }
    if (tramo) piezas.push(tramo)
    tramo = ''
    piezas.push(
      <span key={clave++} className="relative inline-block">
        <span aria-hidden="true">
          {compuesta[0]}
          <span className="absolute -top-[0.42em] left-1/2 -translate-x-1/2 font-display text-[0.9em] leading-none font-bold">
            {compuesta[1]}
          </span>
        </span>
        <span className="sr-only">{c}</span>
      </span>,
    )
  }
  if (tramo) piezas.push(tramo)
  return <Etiqueta className={`font-logger ${className ?? ''}`}>{piezas}</Etiqueta>
}
