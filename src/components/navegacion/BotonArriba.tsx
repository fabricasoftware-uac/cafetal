'use client'

import { useEffect, useRef, useState } from 'react'
import { useScroll } from '@/components/proveedores/ScrollSuave'
import { explosion } from '@/lib/explosion'
import { gsap } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { useSonido } from '@/lib/sonido'

/** Botón de volver arriba: taza con flecha de vapor y anillo de progreso. Al pulsarlo, explota en café. */
export function BotonArriba() {
  const [visible, setVisible] = useState(false)
  const boton = useRef<HTMLButtonElement>(null)
  const anillo = useRef<SVGCircleElement>(null)
  const { irA } = useScroll()
  const { sonar } = useSonido()

  useEffect(() => {
    let pendiente = false
    const leer = () => {
      pendiente = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      setVisible(window.scrollY > window.innerHeight * 0.9)
      anillo.current?.style.setProperty('stroke-dashoffset', String(1 - Math.min(1, window.scrollY / Math.max(1, max))))
    }
    const programar = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(leer)
    }
    leer()
    window.addEventListener('scroll', programar, { passive: true })
    return () => window.removeEventListener('scroll', programar)
  }, [])

  const subir = () => {
    const b = boton.current
    if (!b || prefiereMenosMovimiento()) {
      irA(0)
      return
    }
    const r = b.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    sonar('subida')
    explosion(cx, cy)
    // El botón despega hacia arriba y vuelve a su sitio ya oculto
    gsap.timeline()
      .to(b, { scaleX: 1.15, scaleY: 0.85, duration: 0.12, ease: 'power2.in' })
      .to(b, { y: -window.innerHeight, scaleX: 0.9, scaleY: 1.15, duration: 0.75, ease: 'power3.in' })
      .set(b, { y: 0, scaleX: 1, scaleY: 1 })
    irA(0, {
      alLlegar: () => {
        // Al llegar arriba, una segunda salpicadura cae desde la barra
        explosion(window.innerWidth / 2, 70, { cantidad: 30, hacia: 90, abanico: 150, fuerza: 0.7 })
        sonar('tintineo')
      },
    })
  }

  return (
    <button
      ref={boton}
      type="button"
      onClick={subir}
      aria-label="Volver arriba"
      className={`group fixed right-[clamp(1rem,2.2vw,2.25rem)] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[58] grid size-[60px] place-items-center rounded-full bg-dorado text-tinta shadow-[0_18px_40px_-16px_rgb(0_0_0/.85)] transition-[opacity,translate,scale] duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-y-1 active:scale-95 ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      {/* anillo de progreso del recorrido */}
      <svg viewBox="0 0 60 60" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="30" cy="30" r="27.5" fill="none" stroke="rgb(1 1 1 / .18)" strokeWidth="2.5" />
        <circle ref={anillo} cx="30" cy="30" r="27.5" fill="none" stroke="var(--color-tinta)" strokeWidth="2.5" pathLength={1} strokeDasharray="1" strokeDashoffset="1" strokeLinecap="round" />
      </svg>
      {/* taza con la flecha de vapor */}
      <svg viewBox="0 0 32 32" className="relative w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 15V3M11 8l5-5 5 5" className="transition-transform duration-500 [transition-timing-function:var(--ease-salto)] group-hover:-translate-y-1" />
        <path d="M7 19h18v3a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6Z" />
        <path d="M25 20h1.5a2.5 2.5 0 0 1 0 5H25" />
      </svg>
    </button>
  )
}
