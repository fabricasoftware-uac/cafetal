import type { ReactNode } from 'react'
import { Ancla } from '@/components/navegacion/Ancla'

export function Flecha() {
  return (
    <svg viewBox="0 0 16 16" className="w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Tono = 'linea' | 'llena' | 'oscura'
const CLASE: Record<Tono, string> = { linea: 'pildora', llena: 'pildora pildora-llena', oscura: 'pildora pildora-oscura' }

/** Botón de la página (ver `.pildora` en globals.css). Interno (`a`), externo (`href`) o acción (`alPulsar`). */
export function Pildora({
  a,
  href,
  alPulsar,
  tono = 'linea',
  children,
  className,
  icono,
}: {
  a?: string
  href?: string
  alPulsar?: () => void
  tono?: Tono
  children: ReactNode
  className?: string
  icono?: ReactNode
}) {
  const clase = `${CLASE[tono]} ${className ?? ''}`
  const contenido = (
    <>
      <span>{children}</span>
      <span>{icono ?? <Flecha />}</span>
    </>
  )
  if (alPulsar)
    return (
      <button type="button" onClick={alPulsar} className={clase}>
        {contenido}
      </button>
    )
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={clase}>
        {contenido}
      </a>
    )
  return (
    <Ancla a={a ?? '/'} className={clase}>
      {contenido}
    </Ancla>
  )
}
