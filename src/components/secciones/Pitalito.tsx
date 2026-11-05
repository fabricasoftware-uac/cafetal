'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Pildora } from '@/components/ui/Pildora'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

// Fotos reales del cliente como polaroids: posición, giro y profundidad (cuánto siguen al ratón)
const FOTOS = [
  { src: '/img/secado.webp', alt: 'Café secándose al sol en el patio', clase: 'left-[2%] top-[38%] w-[17vw] min-w-[150px]', giro: -6, prof: 26 },
  { src: '/img/trilladora.webp', alt: 'Café recién trillado en manos', clase: 'right-[2%] top-[30%] w-[15vw] min-w-[140px]', giro: 4, prof: 34 },
  { src: '/img/embajadora-caja.webp', alt: 'Caja de CaFETAL Café Tostado y Molido', clase: 'left-[2%] bottom-[-7%] w-[10vw] min-w-[110px]', giro: 7, prof: 18 },
  { src: '/img/planta.webp', alt: 'Mata de café en las laderas de Pitalito', clase: 'right-[2%] bottom-[-9%] w-[10vw] min-w-[110px]', giro: -5, prof: 22 },
] as const

const VALORES = ['Sostenibilidad', 'Innovación', 'Equidad', 'Transparencia', 'Calidad', 'Regeneración', 'Propósito social']

export function Pitalito() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      // Los arcos se dibujan al entrar
      gsap.fromTo(
        q('[data-arco]'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.25, scrollTrigger: { trigger: raiz.current, start: 'top 70%' } },
      )
      // Las fotos llegan girando y luego siguen al ratón con profundidad distinta (quickTo: un tween por eje)
      const fotos = q('[data-foto]')
      gsap.fromTo(
        fotos,
        { opacity: 0, y: 80, rotation: (i) => (FOTOS[i]?.giro ?? 0) * 3 },
        {
          opacity: 1,
          y: 0,
          rotation: (i) => FOTOS[i]?.giro ?? 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: raiz.current, start: 'top 65%' },
        },
      )
      const movX = fotos.map((f) => gsap.quickTo(f, 'x', { duration: 1.1, ease: 'power3.out' }))
      const movY = fotos.map((f) => gsap.quickTo(f, 'yPercent', { duration: 1.1, ease: 'power3.out' }))
      const alMover = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        FOTOS.forEach((f, i) => {
          movX[i]?.(nx * f.prof * 2)
          movY[i]?.(ny * f.prof * 0.3)
        })
      }
      const nodo = raiz.current
      nodo?.addEventListener('pointermove', alMover)
      return () => nodo?.removeEventListener('pointermove', alMover)
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="nosotros" data-nav="oscuro" className="relative overflow-hidden bg-espresso pt-[clamp(7rem,12vw,11rem)] pb-[clamp(6rem,10vw,9rem)]">
      {/* Arcos de fondo */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <path data-arco d="M-80 980C220 560 520 520 720 520s500 40 800 460" fill="none" stroke="#efd6bf" strokeOpacity=".22" strokeWidth="1.2" pathLength={1} strokeDasharray="1" />
        <path data-arco d="M300 980C420 700 560 640 720 640s300 60 420 340" fill="none" stroke="#efd6bf" strokeOpacity=".16" strokeWidth="1.2" pathLength={1} strokeDasharray="1" />
      </svg>

      {FOTOS.map((f) => (
        <figure key={f.src} data-foto className={`absolute z-0 hidden bg-durazno p-2 pb-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/.9)] md:block ${f.clase}`} style={{ transform: `rotate(${f.giro}deg)` }}>
          <Image src={f.src} alt={f.alt} width={600} height={720} quality={75} sizes="18vw" className="aspect-[4/5] w-full object-cover grayscale-[.25] sepia-[.2]" />
        </figure>
      ))}

      <div id="pitalito" className="marco relative z-10 mx-auto max-w-[1100px] text-center">
        <h2 className="titular text-mega leading-[0.94]">
          Desde Pitalito,
          <br />
          café <span className="menor">que</span> despierta
          <br />
          historias
        </h2>
        <div className="mt-9">
          <Pildora a="#ciclo">Nuestra historia</Pildora>
        </div>
        <p className="mx-auto mt-10 max-w-[46ch] text-frase text-durazno/90">
          CaFETAL Group nació en las montañas de Pitalito, en el sur del Huila, el departamento que más café produce en Colombia. Hoy
          lleva su café de origen a la vida de todos los días, sin perder lo que lo hace nuestro.
        </p>
      </div>

      <div className="marco relative z-10 mx-auto mt-[clamp(5rem,9vw,8rem)] grid max-w-[980px] gap-10 text-center md:grid-cols-2">
        <div data-revelar>
          <h3 className="titular text-subtitulo">Misión</h3>
          <p className="mx-auto mt-4 max-w-[44ch]">
            Impulsar una nueva forma de consumir café premium mediante prácticas sostenibles, innovación responsable y compromiso
            social, generando bienestar real y valor consciente para el mundo.
          </p>
        </div>
        <div data-revelar>
          <h3 className="titular text-subtitulo">Visión</h3>
          <p className="mx-auto mt-4 max-w-[44ch]">
            Ser una empresa líder mundial reconocida por transformar la industria cafetera con modelos sostenibles y éticos, como
            símbolo global de responsabilidad y propósito.
          </p>
        </div>
        <ul data-revelar className="flex flex-wrap justify-center gap-2 md:col-span-2" aria-label="Valores">
          {VALORES.map((v) => (
            <li key={v} className="rounded-full bg-tostado px-4 py-2 text-nota text-durazno transition-colors duration-300 hover:bg-dorado hover:text-tinta">
              {v}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
