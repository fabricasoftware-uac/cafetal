'use client'

import { useRef } from 'react'
import { Vapor } from '@/components/ui/Cafe'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { Logo } from './Logo'

/*
 * El logo del pie, vivo: al entrar en pantalla la casa se dibuja con un trazo y se rellena, las letras
 * caen como granos y la chimenea echa humo. Las letras de CaFETAL se levantan cuando el cursor pasa
 * cerca. Todo termina en el logo exacto del manual (no se deforma ni se mueve en reposo).
 */
export function LogoVivo({ className }: { className?: string }) {
  const raiz = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      const casa = q('.logo-casa')
      const letras = q('.logo-marca .logo-letra')
      const resto = q('.logo-slogan .logo-letra, .logo-subslogan .logo-letra')
      // Descubrir con clip-path y subir letras: barato de componer (antes se trazaban 550 segmentos)
      gsap.set(casa, { clipPath: 'inset(100% 0 0 0)' })
      gsap.set([...letras, ...resto], { opacity: 0, yPercent: 60 })
      gsap.set(q('[data-humo]'), { opacity: 0 })
      gsap
        .timeline({ scrollTrigger: { trigger: raiz.current, start: 'top 85%', once: true } })
        .to(casa, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power3.inOut' })
        .to(letras, { opacity: 1, yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.8)
        .to(resto, { opacity: 1, yPercent: 0, duration: 0.6, ease: 'expo.out', stagger: 0.012 }, 1.2)
        .to(q('[data-humo]'), { opacity: 1, duration: 1 }, 1.3)

      // Las letras de la marca se levantan cerca del cursor
      const subir = letras.map((l) => gsap.quickTo(l, 'y', { duration: 0.5, ease: 'power3.out' }))
      const girar = letras.map((l) => gsap.quickTo(l, 'rotation', { duration: 0.6, ease: 'power3.out' }))
      const alMover = (e: PointerEvent) => {
        letras.forEach((l, i) => {
          const r = l.getBoundingClientRect()
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
          const f = Math.max(0, 1 - d / 160)
          subir[i]?.(-f * 28)
          girar[i]?.(f * (i % 2 ? 8 : -8))
        })
      }
      const soltar = () => {
        subir.forEach((s) => s(0))
        girar.forEach((g) => g(0))
      }
      const nodo = raiz.current
      nodo?.addEventListener('pointermove', alMover)
      nodo?.addEventListener('pointerleave', soltar)
      return () => {
        nodo?.removeEventListener('pointermove', alMover)
        nodo?.removeEventListener('pointerleave', soltar)
      }
    },
    { scope: raiz },
  )

  return (
    <div ref={raiz} className={`relative ${className ?? ''}`}>
      {/* humo de la chimenea (la chimenea está arriba, al 57 % del ancho) */}
      <div data-humo className="pointer-events-none absolute -top-[16%] left-[52%] w-[11%] text-durazno/50" aria-hidden="true">
        <Vapor />
      </div>
      <Logo variante="completo" className="w-full overflow-visible" />
    </div>
  )
}
