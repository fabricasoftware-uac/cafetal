'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Ancla } from '@/components/navegacion/Ancla'
import { Logger } from '@/components/ui/Logger'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { PRODUCTOS } from '@/lib/productos'

/*
 * Carrusel de sabores: tarjetas de color plano con la caja recortada. Al pasar el ratón la tarjeta
 * se levanta, la caja gira y aparece el nombre debajo; la cinta frena. Con el scroll acelera e inclina.
 */
export function CintaSabores() {
  const raiz = useRef<HTMLDivElement>(null)
  const pista = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const nodo = pista.current
    if (!nodo || prefiereMenosMovimiento()) return
    const tween = gsap.to(nodo, { xPercent: -50, duration: 52, ease: 'none', repeat: -1 })
    let frenada = false
    const inclinar = gsap.quickTo(nodo, 'skewX', { duration: 0.6, ease: 'power3.out' })
    const st = ScrollTrigger.create({
      trigger: raiz.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (s) => {
        const v = s.getVelocity()
        if (!frenada) gsap.to(tween, { timeScale: gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 500) * Math.sign(v || 1), duration: 0.3, overwrite: true, onComplete: () => !frenada && gsap.to(tween, { timeScale: 1, duration: 1.2 }) })
        inclinar(gsap.utils.clamp(-8, 8, -v / 300))
      },
      onToggle: (s) => (s.isActive ? tween.play() : tween.pause()),
    })
    const frenar = () => {
      frenada = true
      gsap.to(tween, { timeScale: 0.06, duration: 0.6, overwrite: true })
    }
    const seguir = () => {
      frenada = false
      gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true })
    }
    nodo.addEventListener('mouseenter', frenar)
    nodo.addEventListener('mouseleave', seguir)
    const enderezar = () => inclinar(0)
    ScrollTrigger.addEventListener('scrollEnd', enderezar)
    return () => {
      st.kill()
      ScrollTrigger.removeEventListener('scrollEnd', enderezar)
      nodo.removeEventListener('mouseenter', frenar)
      nodo.removeEventListener('mouseleave', seguir)
    }
  })

  return (
    <div ref={raiz} className="overflow-hidden bg-espresso pt-5 pb-24" aria-label="Sabores de CaFETAL">
      <div ref={pista} className="flex w-max gap-3">
        {[0, 1, 2, 3].map((copia) => (
          <div key={copia} className="flex gap-3" aria-hidden={copia > 0}>
            {PRODUCTOS.map((p, i) => (
              <Ancla
                key={p.slug}
                a={`/productos/${p.slug}`}
                className="group relative block h-[190px] w-[300px] shrink-0 rounded-[14px] transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-y-2.5 hover:-rotate-1"
              >
                <span className="absolute inset-0 overflow-hidden rounded-[14px]" style={{ background: p.tarjeta }}>
                  {p.recorte ? (
                    <Image
                      src={p.recorte}
                      alt=""
                      fill
                      sizes="300px"
                      className="animate-[flotar_5s_ease-in-out_infinite] object-contain p-4 drop-shadow-[0_16px_18px_rgb(0_0_0/.45)] transition-transform duration-700 [transition-timing-function:var(--ease-salto)] group-hover:scale-110 group-hover:rotate-3"
                      style={{ animationDelay: `${-i * 0.9}s` }}
                    />
                  ) : (
                    <Image src={p.foto} alt="" fill sizes="300px" className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-salto)] group-hover:scale-110" />
                  )}
                </span>
                {/* nombre que aparece al pasar el ratón */}
                <span className="pointer-events-none absolute inset-x-0 top-full mt-3 flex translate-y-2 flex-col items-center text-center opacity-0 transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-salto)] group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="font-display text-nota text-dorado italic">{p.linea === 'Línea Tradicional' ? 'Línea Tradicional' : 'By Gugo'}</span>
                  <Logger className="text-[1.5rem] leading-none text-durazno">{p.nombre}</Logger>
                  <span className="mt-1.5 grid size-7 place-items-center rounded-full bg-tostado text-durazno" aria-hidden="true">
                    →
                  </span>
                </span>
              </Ancla>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
