'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Logo } from '@/components/marca/Logo'
import { useScroll } from '@/components/proveedores/ScrollSuave'
import { Logger } from '@/components/ui/Logger'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { reloj, useInfusion } from '@/lib/infusion'
import { useSonido } from '@/lib/sonido'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

/** Ancho de la etiqueta ya encogida, en px. */
const ETIQUETA = { escritorio: 168, telefono: 84, margen: 16 }

/*
 * La etiqueta dorada de la caja es la tarjeta del hero. Durante la primera pantalla de scroll se
 * encoge hasta la esquina inferior derecha (dentro del contenedor sticky de la foto, así el h1
 * sigue en el flujo del documento). Al terminar la releva <EtiquetaColgante>, fija e idéntica,
 * que cuelga de su hilo como la etiqueta del sachet y lleva la cuenta de la infusión.
 */
export function Portada() {
  const raiz = useRef<HTMLElement>(null)
  const tarjeta = useRef<HTMLDivElement>(null)
  const colgante = useRef<HTMLDivElement>(null)
  const [colgada, setColgada] = useState(false)
  const { irA } = useScroll()
  const { sonar } = useSonido()

  useGSAP(
    () => {
      const nodo = tarjeta.current
      const etiqueta = colgante.current
      if (!nodo || !etiqueta) return
      gsap.set(nodo, { xPercent: -50, yPercent: -50 })
      if (prefiereMenosMovimiento()) return
      const ancho = () => (window.innerWidth < 640 ? ETIQUETA.telefono : ETIQUETA.escritorio)
      const escala = () => ancho() / nodo.offsetWidth
      const medir = () => {
        etiqueta.style.width = `${ancho()}px`
        etiqueta.style.height = `${nodo.offsetHeight * escala()}px`
      }
      medir()
      ScrollTrigger.addEventListener('refreshInit', medir)

      const colgar = (si: boolean) => {
        gsap.set(nodo, { autoAlpha: si ? 0 : 1 })
        gsap.set(etiqueta, { autoAlpha: si ? 1 : 0 })
        setColgada(si)
      }
      gsap.set(etiqueta, { autoAlpha: 0 })

      const q = gsap.utils.selector(raiz)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: () => `+=${window.innerHeight}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onLeave: () => colgar(true),
            onEnterBack: () => colgar(false),
          },
        })
        .to(
          nodo,
          {
            x: () => window.innerWidth / 2 - ETIQUETA.margen - ancho() / 2,
            y: () => window.innerHeight / 2 - ETIQUETA.margen - (nodo.offsetHeight * escala()) / 2,
            scale: escala,
            ease: 'power1.inOut',
            duration: 1,
          },
          0,
        )
        .to(q('[data-capa="tarjeta"]'), { opacity: 0, duration: 0.3, ease: 'none' }, 0.25)
        .fromTo(q('[data-capa="etiqueta"]'), { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none' }, 0.55)

      // En "Prepara tu taza" la cuenta ya está a la vista: la etiqueta se aparta para no tapar nada.
      // Al final no hace falta retirarla: el telón del pie (z-45) la cubre.
      ScrollTrigger.create({
        trigger: '#prepara',
        start: 'top 85%',
        end: 'bottom 15%',
        onToggle: (s) => gsap.to(etiqueta.querySelector('[data-apartable]'), { autoAlpha: s.isActive ? 0 : 1, duration: 0.35 }),
      })
      return () => ScrollTrigger.removeEventListener('refreshInit', medir)
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="inicio" data-nav="oscuro" data-seccion className="relative h-svh [html.mov_&]:h-[200svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Image
          src="/img/taza-sachet.webp"
          alt="Sachet de CaFETAL goteando café dentro de una taza blanca"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-[38%_45%]"
          style={{ filter: 'brightness(.62) contrast(1.05)' }}
        />

        <div
          ref={tarjeta}
          className="absolute top-1/2 left-1/2 h-[min(70svh,560px)] w-[calc(100vw-2rem)] origin-center sm:h-[min(62svh,560px)] sm:w-[min(792px,62vw)]"
        >
          <div className="relative h-full overflow-hidden bg-dorado text-tinta">
            <div data-capa="tarjeta" className="flex h-full flex-col justify-between p-6 sm:p-8">
              <h1 className="grid gap-x-4 text-[9vw] leading-none sm:flex sm:justify-between sm:text-frase">
                <Logger>Café de</Logger>
                <Logger className="sm:hidden">Pitalito</Logger>
                <span className="hidden sm:contents">
                  <Logger>Pitalito</Logger>
                  <Logger>Huila</Logger>
                </span>
              </h1>

              <div className="grid grid-cols-[1fr_auto] items-end gap-6">
                <div className="grid gap-5">
                  <p className="text-[5.2vw] leading-[1.05] sm:text-frase">
                    Tostado y molido
                    <br />
                    20 sachets de 5 gramos
                    <br />
                    Listo en tres minutos
                  </p>
                  <p className="max-w-[30ch] text-cuerpo leading-snug">
                    Café de origen colombiano que se prepara como una infusión, sin cafetera.
                  </p>
                </div>
                <Logo variante="logo" etiqueta="CaFETAL" className="hidden w-[clamp(120px,14vw,200px)] sm:block" />
              </div>

              <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <p className="hidden text-nota sm:block">Línea Tradicional y Premium By Gugo</p>
                <button type="button" onClick={() => { sonar('sobre'); irA('#prepara') }} className="accion w-full bg-tinta text-crema hover:bg-espresso sm:w-auto">
                  Prepara tu taza
                </button>
                <button type="button" onClick={() => irA('#sabores')} className="enlace justify-self-center text-cuerpo sm:justify-self-end">
                  Ver los sabores
                </button>
              </div>
            </div>

            {/* Cara de etiqueta mientras se encoge: tipos grandes porque la escala los reduce */}
            <div data-capa="etiqueta" aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[4%] opacity-0">
              <Logo variante="imagotipo" etiqueta={null} className="w-[46%]" />
              <span className="text-[clamp(3.5rem,8vw,6rem)] leading-none">Tu taza</span>
            </div>
          </div>
        </div>
      </div>

      <EtiquetaColgante ref={colgante} activa={colgada} alPulsar={() => irA('#prepara')} />
    </section>
  )
}

/** La etiqueta que se queda colgando en la esquina y lleva la cuenta de la infusión. */
function EtiquetaColgante({
  ref,
  activa,
  alPulsar,
}: {
  ref: React.Ref<HTMLDivElement>
  activa: boolean
  alPulsar: () => void
}) {
  const inf = useInfusion()
  const enCurso = inf.restante !== null && inf.restante > 0
  const lista = inf.restante === 0
  return (
    <div ref={ref} className="pointer-events-none fixed right-4 bottom-4 z-40 hidden [html.mov_&]:block" style={{ visibility: 'hidden' }}>
      <div data-apartable className="relative h-full w-full">
        <span aria-hidden="true" className="absolute bottom-full left-1/2 h-[24svh] w-[2px] -translate-x-1/2 bg-dorado/70" />
        <button
          type="button"
          tabIndex={activa ? 0 : -1}
          onClick={alPulsar}
          className="pointer-events-auto flex h-full w-full flex-col items-center justify-center gap-[6%] bg-dorado text-tinta transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:-rotate-3"
          aria-label={enCurso ? `Infusión en curso, faltan ${reloj(inf.restante ?? 0)}` : lista ? 'Tu taza está lista' : 'Prepara tu taza'}
        >
          <Logo variante="imagotipo" etiqueta={null} className="w-[46%]" />
          <span className="text-[clamp(0.8rem,1.2vw,1.1rem)] leading-none tabular-nums">
            {enCurso ? reloj(inf.restante ?? 0) : lista ? '¡Lista!' : 'Tu taza'}
          </span>
          {enCurso ? <span className="text-[0.7rem] leading-none max-sm:hidden">{inf.sabor}</span> : null}
        </button>
      </div>
    </div>
  )
}
