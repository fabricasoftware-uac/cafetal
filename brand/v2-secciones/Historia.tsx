'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'

/*
 * Relato con los hechos del brochure y las fotos reales del cliente (WhatsApp, oct. 2026).
 * Faltan fechas y nombres: docs/04 - Pendientes → Historia.
 * La frase queda fija en la columna izquierda; las fotos pasan por la derecha, sin cruzarla.
 */
const ETAPAS = [
  { etapa: 'La mata', pie: 'Crece en las laderas de Pitalito, entre neblina y sol de montaña.', src: '/img/planta.webp', alt: 'Mata de café cargada de cerezas en una ladera', ancho: 993, alto: 1280 },
  { etapa: 'La cosecha', pie: 'Cerezas maduras, una a una, cuando están rojas.', src: '/img/cerezas.webp', alt: 'Racimo de cerezas de café rojas y verdes', ancho: 720, alto: 836 },
  { etapa: 'El secado', pie: 'Al sol, en patio, hasta que el grano está listo.', src: '/img/secado.webp', alt: 'Café extendido secándose al sol en un patio', ancho: 720, alto: 772 },
  { etapa: 'La trilla', pie: 'Se limpia el grano antes de tostarlo y molerlo.', src: '/img/trilladora.webp', alt: 'Café recién trillado en manos, junto a la trilladora', ancho: 720, alto: 960 },
  { etapa: 'La caja', pie: 'Veinte sachets de cinco gramos, en cinco sabores.', src: '/img/cajas-sabores.webp', alt: 'Las cinco cajas de CaFETAL: tradicional, anís, campesino, cardamomo y jengibre', ancho: 1024, alto: 1536 },
] as const

export function Historia() {
  const raiz = useRef<HTMLElement>(null)
  const [actual, setActual] = useState(0)

  useGSAP(
    () => {
      const fotos = raiz.current?.querySelectorAll<HTMLElement>('[data-etapa]') ?? []
      fotos.forEach((f, i) => {
        ScrollTrigger.create({
          trigger: f,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (s) => s.isActive && setActual(i),
        })
      })
    },
    { scope: raiz },
  )

  const e = ETAPAS[actual]

  return (
    <section ref={raiz} id="historia" data-nav="oscuro" data-seccion className="marco py-[clamp(7rem,10vw,9rem)]">
      <div className="rejilla">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(50svh-11rem)]">
            <h2 className="text-display">Nuestra historia</h2>
            <p className="mt-8 max-w-[22ch] text-frase">Del cafetal a tu taza, el grano nunca pierde su origen.</p>
            <p key={e.etapa} className="mt-10 hidden animate-[aparecer_.5s_ease_both] lg:block" aria-live="polite">
              <span className="block text-frase text-dorado">{e.etapa}</span>
              <span className="mt-2 block max-w-[34ch]">{e.pie}</span>
            </p>
          </div>
        </div>

        <ol className="col-span-12 mt-14 grid gap-[clamp(4rem,9vw,8rem)] lg:col-span-6 lg:col-start-7 lg:mt-0">
          {ETAPAS.map((x, i) => (
            <li key={x.src} data-etapa className={i % 2 ? 'lg:pl-[12%]' : 'lg:pr-[12%]'}>
              <div data-revelar="imagen" className="overflow-hidden">
                <Image
                  src={x.src}
                  alt={x.alt}
                  width={x.ancho}
                  height={x.alto}
                  quality={80}
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="w-full"
                />
              </div>
              <p className="mt-4 lg:hidden">
                <span className="block text-frase text-dorado">{x.etapa}</span>
                {x.pie}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
