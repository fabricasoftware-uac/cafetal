'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Pildora } from '@/components/ui/Pildora'
import { VideoFondo } from '@/components/ui/VideoFondo'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

// Los momentos de consumo del brochure 2026, con video real (Pexels) y la caja que mejor les va
const MOMENTOS = [
  { nombre: 'Antes de entrenar', corto: 'Entrena', video: 'entrena', caja: '/img/recortes/jengibre-4.webp', sabor: 'Jengibre', texto: 'Energía natural de origen, sin cafetera: un sachet en la maleta del gimnasio.' },
  { nombre: 'En tu jornada', corto: 'Trabaja', video: 'trabaja', caja: '/img/recortes/tradicional-4.webp', sabor: 'Tradicional', texto: 'Entre reunión y reunión, tres minutos para una taza de verdad en el escritorio.' },
  { nombre: 'En tus aventuras', corto: 'Explora', video: 'explora', caja: '/img/recortes/cardamomo-4.webp', sabor: 'Cardamomo', texto: 'En la montaña, en el camping o en la carretera: solo hace falta agua caliente.' },
  { nombre: 'Para tu respiro', corto: 'Respira', video: 'respira', caja: '/img/recortes/campesino-4.webp', sabor: 'Campesino', texto: 'La hamaca, la tarde y un campesino con canela. El café también es una pausa.' },
] as const

/*
 * Momentos CaFETAL: cuatro videos reales que se cruzan con el scroll (sección fijada). La palabra
 * gigante del momento se recorta sobre el video, y la caja del sabor sugerido flota en primer plano
 * con parallax propio; al cambiar de momento, la caja anterior sale girando y entra la nueva.
 */
export function Ritual() {
  const raiz = useRef<HTMLElement>(null)
  const [m, setM] = useState(0)
  const actual = MOMENTOS[m] ?? MOMENTOS[0]

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: q('[data-escenario]')[0],
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 0.6,
            onUpdate: (s) => setM(Math.min(MOMENTOS.length - 1, Math.floor(s.progress * MOMENTOS.length))),
          },
        })
        // deriva lenta de toda la escena: el video se acerca y la caja sube
        .fromTo(q('[data-videos]'), { scale: 1.12 }, { scale: 1, ease: 'none' }, 0)
        .fromTo(q('[data-flota]'), { yPercent: 12 }, { yPercent: -12, ease: 'none' }, 0)
      const cx = gsap.quickTo(q('[data-flota]')[0] ?? {}, 'x', { duration: 1.2, ease: 'power3.out' })
      const cr = gsap.quickTo(q('[data-flota]')[0] ?? {}, 'rotation', { duration: 1.4, ease: 'power3.out' })
      const mover = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        cx(nx * 40)
        cr(nx * 6)
      }
      raiz.current?.addEventListener('pointermove', mover)
      return () => raiz.current?.removeEventListener('pointermove', mover)
    },
    { scope: raiz },
  )

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      gsap.fromTo(q('[data-palabra] > span'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
      gsap.fromTo(q('[data-caja]'), { y: 140, rotation: -14, opacity: 0, scale: 0.85 }, { y: 0, rotation: -4, opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.5)' })
      gsap.fromTo(q('[data-detalle]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay: 0.12 })
    },
    { scope: raiz, dependencies: [m] },
  )

  return (
    <section ref={raiz} id="ritual" data-nav="oscuro" className="relative bg-noche">
      <div data-escenario className="relative h-svh overflow-hidden">
        <div data-videos className="absolute inset-0">
          {MOMENTOS.map((x, i) => (
            <div key={x.video} className="absolute inset-0 transition-opacity duration-[900ms]" style={{ opacity: i === m ? 1 : 0 }}>
              <VideoFondo nombre={x.video} activo={i === m} filtro="brightness(.55) saturate(.95)" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgb(19_12_8/.85)_0%,rgb(19_12_8/.35)_45%,transparent_70%)]" />

        {/* palabra gigante del momento */}
        <p data-palabra key={actual.corto} aria-hidden="true" className="titular pointer-events-none absolute right-[clamp(1rem,2.2vw,2.25rem)] bottom-[4%] flex overflow-hidden text-[clamp(5rem,17vw,18rem)] leading-[0.82] text-durazno/90">
          {[...actual.corto].map((c, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: letras fijas
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </p>

        {/* la caja del sabor sugerido, flotando */}
        <div data-flota className="pointer-events-none absolute top-[18%] right-[12%] hidden w-[min(30vw,420px)] md:block">
          <div data-caja key={actual.caja} className="animate-[flotar_5s_ease-in-out_infinite]">
            <Image src={actual.caja} alt="" width={1100} height={931} sizes="420px" className="w-full drop-shadow-[0_40px_40px_rgb(0_0_0/.7)]" />
          </div>
        </div>

        <div className="marco relative flex h-full flex-col justify-center pt-[100px]">
          <h2 className="titular text-titulo">
            <span className="menor">Un</span> sachet,
            <br />
            <span className="menor">todos tus</span> momentos
          </h2>
          <div data-detalle key={actual.nombre} className="mt-8 max-w-[420px]">
            <p className="font-display text-frase text-dorado italic">{actual.nombre}</p>
            <p className="mt-3 text-cuerpo text-crema/90">{actual.texto}</p>
            <p className="mt-3 text-nota text-suave">
              Para este momento: <span className="text-durazno">{actual.sabor}</span>
            </p>
          </div>
          <ol className="mt-8 flex max-w-[420px] gap-2" aria-label="Momentos">
            {MOMENTOS.map((x, i) => (
              <li key={x.nombre} className="flex-1">
                <span className="block h-[3px] overflow-hidden rounded-full bg-crema/20">
                  <span className="block h-full origin-left bg-dorado transition-transform duration-500" style={{ transform: `scaleX(${i <= m ? 1 : 0})` }} />
                </span>
                <span className={`mt-2 block text-[0.8rem] transition-colors ${i === m ? 'text-durazno' : 'text-crema/50'}`}>{x.corto}</span>
              </li>
            ))}
          </ol>
          <div className="mt-9">
            <Pildora a="#taza">Arma tu taza</Pildora>
          </div>
        </div>
      </div>
    </section>
  )
}
