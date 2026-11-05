'use client'

import { useEffect, useRef } from 'react'
import { explosion } from '@/lib/explosion'
import { gsap } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

/*
 * Cursor mascota: un grano dorado que persigue al puntero, gira hacia donde va y se estira con la
 * velocidad. Sobre enlaces y botones se convierte en una taza con vapor; al hacer clic suelta granitos.
 * Solo con ratón (pointer: fine) y sin movimiento reducido. El cursor del sistema se conserva.
 */
export function CursorGrano() {
  const nodo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = nodo.current
    if (!el || prefiereMenosMovimiento() || !window.matchMedia('(pointer: fine)').matches) return
    el.style.display = 'block'
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
    const rot = gsap.quickTo(el.querySelector('[data-grano]'), 'rotation', { duration: 0.5, ease: 'power3.out' })
    const est = gsap.quickTo(el.querySelector('[data-grano]'), 'scaleY', { duration: 0.35, ease: 'power3.out' })
    let px = 0
    let py = 0
    let t = performance.now()
    const mover = (e: PointerEvent) => {
      const ahora = performance.now()
      const dt = Math.max(16, ahora - t)
      const vx = (e.clientX - px) / dt
      const vy = (e.clientY - py) / dt
      const v = Math.hypot(vx, vy)
      if (v > 0.05) rot((Math.atan2(vy, vx) * 180) / Math.PI + 90)
      est(1 + Math.min(0.6, v * 0.35))
      px = e.clientX
      py = e.clientY
      t = ahora
      x(e.clientX + 14)
      y(e.clientY + 16)
      const sobre = (e.target as Element | null)?.closest('a, button, [role="tab"]')
      el.dataset.sobre = sobre ? 'si' : 'no'
    }
    const clic = (e: PointerEvent) => explosion(e.clientX, e.clientY, { cantidad: 7, fuerza: 0.35, abanico: 120, onda: false })
    window.addEventListener('pointermove', mover, { passive: true })
    window.addEventListener('pointerdown', clic, { passive: true })
    return () => {
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerdown', clic)
    }
  }, [])

  return (
    <div ref={nodo} data-sobre="no" aria-hidden="true" className="group/cursor pointer-events-none fixed top-0 left-0 z-[90] hidden" style={{ display: 'none' }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <svg data-grano viewBox="0 0 24 32" className="w-[16px] transition-[opacity,scale] duration-300 group-data-[sobre=si]/cursor:scale-0 group-data-[sobre=si]/cursor:opacity-0">
          <ellipse cx="12" cy="16" rx="10.5" ry="14.5" fill="var(--color-dorado)" />
          <path d="M12.6 2.4C8.4 8.6 15.8 13 12 18.6c-2.3 3.4-1.3 7.6.4 11" fill="none" stroke="rgb(0 0 0 / .45)" strokeWidth="2.1" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 32 32" className="absolute top-1/2 left-1/2 w-[30px] -translate-x-1/2 -translate-y-1/2 scale-0 text-dorado opacity-0 transition-[opacity,scale] duration-300 [transition-timing-function:var(--ease-salto)] group-data-[sobre=si]/cursor:scale-100 group-data-[sobre=si]/cursor:opacity-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 15h16v4a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7Z" fill="currentColor" fillOpacity=".25" />
          <path d="M23 16h1.5a3 3 0 0 1 0 6H23" />
          <path d="M12 4c-2 2 2 3 0 6M17 3c-2 2 2 4 0 7" className="animate-[vaporBoton_1.4s_ease-in-out_infinite]" />
        </svg>
      </div>
    </div>
  )
}
