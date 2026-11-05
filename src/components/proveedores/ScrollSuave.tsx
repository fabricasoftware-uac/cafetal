'use client'

import Lenis from 'lenis'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { EVENTO_INTRO_FIN, prefiereMenosMovimiento } from '@/lib/movimiento'

interface Scroll {
  irA: (destino: string | number, opciones?: { inmediato?: boolean; alLlegar?: () => void }) => void
  detener: () => void
  reanudar: () => void
}

const ContextoScroll = createContext<Scroll | null>(null)

export function ScrollSuave({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefiereMenosMovimiento()) return
    const instancia = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 })
    lenis.current = instancia
    // Lenis y ScrollTrigger comparten reloj (ver Animación y Movimiento)
    instancia.on('scroll', ScrollTrigger.update)
    const tic = (t: number) => instancia.raf(t * 1000)
    gsap.ticker.add(tic)
    gsap.ticker.lagSmoothing(0)
    if (document.documentElement.dataset.intro === 'si') {
      instancia.stop()
      window.addEventListener(EVENTO_INTRO_FIN, () => instancia.start(), { once: true })
    }
    return () => {
      gsap.ticker.remove(tic)
      instancia.destroy()
      lenis.current = null
    }
  }, [])

  const irA = useCallback<Scroll['irA']>((destino, opciones) => {
    const objetivo = typeof destino === 'string' ? document.querySelector<HTMLElement>(destino) : destino
    if (objetivo === null) return
    if (lenis.current) {
      // Duración proporcional a la distancia y curva simétrica: arranca suave, viaja y aterriza suave.
      // (La curva por defecto de Lenis es exponencial: recorre casi todo en el primer instante.)
      const destinoY =
        typeof objetivo === 'number' ? objetivo : objetivo.getBoundingClientRect().top + window.scrollY
      const distancia = Math.abs(destinoY - window.scrollY)
      const duracion = Math.min(3.2, Math.max(1.1, 0.9 + distancia / 3500))
      lenis.current.scrollTo(objetivo, {
        offset: 0,
        immediate: opciones?.inmediato,
        duration: duracion,
        easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
        onComplete: opciones?.alLlegar,
      })
    } else if (typeof objetivo === 'number') {
      window.scrollTo({ top: objetivo })
      opciones?.alLlegar?.()
    } else {
      objetivo.scrollIntoView()
      opciones?.alLlegar?.()
    }
  }, [])

  const detener = useCallback(() => {
    lenis.current?.stop()
    document.documentElement.style.overflow = 'hidden'
  }, [])
  const reanudar = useCallback(() => {
    lenis.current?.start()
    document.documentElement.style.overflow = ''
  }, [])

  return <ContextoScroll.Provider value={{ irA, detener, reanudar }}>{children}</ContextoScroll.Provider>
}

export function useScroll(): Scroll {
  const ctx = useContext(ContextoScroll)
  if (!ctx) throw new Error('useScroll debe usarse dentro de <ScrollSuave>')
  return ctx
}
