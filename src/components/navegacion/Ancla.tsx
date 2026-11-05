'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'
import { useScroll } from '@/components/proveedores/ScrollSuave'
import { EVENTO_RUTA, transicionar } from '@/lib/transicion'

/**
 * Enlace a una sección del inicio (`#id`) o a otra ruta. En el inicio, las anclas viajan con Lenis;
 * entre rutas, la ola de café de `transicionar` tapa el cambio de página.
 */
export function Ancla({
  a,
  children,
  className,
  alIr,
}: {
  a: string
  children: ReactNode
  className?: string
  alIr?: () => void
}) {
  const ruta = usePathname()
  const router = useRouter()
  const { irA } = useScroll()
  const esAncla = a.startsWith('#')
  const href = esAncla && ruta !== '/' ? `/${a}` : a
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        alIr?.()
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        if (esAncla && ruta === '/') {
          e.preventDefault()
          irA(a)
          return
        }
        const destino = href.split('#')[0] || '/'
        if (destino !== ruta) {
          e.preventDefault()
          transicionar(() => router.push(href))
        }
      }}
    >
      {children}
    </Link>
  )
}

/** Avisa a la transición de que la ruta nueva ya está pintada. Va una vez en el layout. */
export function FinTransicion() {
  const ruta = usePathname()
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event(EVENTO_RUTA)))
    return () => cancelAnimationFrame(id)
  }, [ruta])
  return null
}
