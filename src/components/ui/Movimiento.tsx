'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { alTerminarIntro, prefiereMenosMovimiento } from '@/lib/movimiento'

/*
 * Entrada por partes: cada `[data-revelar]` sube 24 px con opacidad al entrar en pantalla, una vez.
 * Los que entran en el mismo fotograma se escalonan 80 ms (título, luego texto, luego imagen).
 * Variante `imagen`: la imagen interior se asienta desde una escala mayor.
 * Con IntersectionObserver y no con ScrollTrigger.batch: el lote no llegó a dispararse en esta página.
 */
export function Revelados() {
  // En cada ruta hay elementos nuevos: sin esto, /productos se quedaba en blanco al navegar
  const ruta = usePathname()
  useEffect(() => {
    if (prefiereMenosMovimiento()) return
    let observador: IntersectionObserver | null = null
    const pendientes = new Set<HTMLElement>()
    /*
     * IntersectionObserver no avisa si un salto de scroll lleva un elemento de "debajo" a "encima"
     * sin cruzar la pantalla (para él nunca dejó de estar fuera). Lo que ya quedó atrás se muestra
     * sin animar: nada se queda oculto para siempre (anclas, saltos, capturas a página completa).
     */
    let pendienteRevision = false
    const revisar = () => {
      pendienteRevision = false
      for (const el of pendientes) {
        if (el.getBoundingClientRect().bottom < 0) {
          pendientes.delete(el)
          observador?.unobserve(el)
          gsap.set(el, { opacity: 1, y: 0 })
        }
      }
    }
    const alDesplazar = () => {
      if (pendienteRevision || pendientes.size === 0) return
      pendienteRevision = true
      requestAnimationFrame(revisar)
    }
    window.addEventListener('scroll', alDesplazar, { passive: true })
    const quitar = alTerminarIntro(() => {
      let cola: HTMLElement[] = []
      const vaciar = () => {
        cola.forEach((el, i) => {
          const retraso = i * 0.08
          gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, delay: retraso, ease: 'expo.out' })
          if (el.dataset.revelar === 'imagen' && el.firstElementChild) {
            gsap.fromTo(el.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 1.6, delay: retraso, ease: 'expo.out' })
          }
        })
        cola = []
      }
      observador = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas) {
            // Lo que ya quedó por encima (un salto de scroll lo pasó sin verlo) se muestra sin animar:
            // nada se queda oculto para siempre
            if (!e.isIntersecting && e.boundingClientRect.top < 0) {
              pendientes.delete(e.target as HTMLElement)
              observador?.unobserve(e.target)
              gsap.set(e.target, { opacity: 1, y: 0 })
              continue
            }
            if (!e.isIntersecting) continue
            pendientes.delete(e.target as HTMLElement)
            observador?.unobserve(e.target)
            if (cola.length === 0) requestAnimationFrame(vaciar)
            cola.push(e.target as HTMLElement)
          }
        },
        { rootMargin: '0px 0px -10% 0px' },
      )
      for (const el of document.querySelectorAll<HTMLElement>('[data-revelar]')) {
        pendientes.add(el)
        observador.observe(el)
      }
      revisar()
    })
    return () => {
      window.removeEventListener('scroll', alDesplazar)
      quitar()
      observador?.disconnect()
    }
  }, [ruta])
  return null
}

/** Deriva vertical lenta de su hijo mientras cruza la pantalla. */
export function Paralaje({ children, cantidad = 12, className }: { children: ReactNode; cantidad?: number; className?: string }) {
  const nodo = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (prefiereMenosMovimiento() || !nodo.current) return
      gsap.fromTo(
        nodo.current,
        { yPercent: -cantidad / 2 },
        {
          yPercent: cantidad / 2,
          ease: 'none',
          scrollTrigger: { trigger: nodo.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
    },
    { scope: nodo },
  )
  return (
    <div ref={nodo} className={className}>
      {children}
    </div>
  )
}
