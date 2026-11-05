'use client'

import type { ReactNode } from 'react'
import { useScroll } from '@/components/proveedores/ScrollSuave'

/** Ancla a una sección con el desplazamiento suave de Lenis. */
export function EnlaceSeccion({ destino, children, className }: { destino: string; children: ReactNode; className?: string }) {
  const { irA } = useScroll()
  return (
    <a
      href={`#${destino}`}
      onClick={(e) => {
        e.preventDefault()
        irA(`#${destino}`)
      }}
      className={`group ${className ?? ''}`}
    >
      {children}
    </a>
  )
}
