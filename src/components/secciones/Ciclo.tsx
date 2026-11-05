'use client'

import { type ComponentType, type SVGProps, useRef, useState } from 'react'
import { IconoCerezas, IconoSecado, IconoTaza, IconoTostion } from '@/components/ui/Iconos'
import { Pildora } from '@/components/ui/Pildora'
import { VideoFondo } from '@/components/ui/VideoFondo'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

interface Capitulo {
  numero: string
  titulo: string
  video: string
  texto: string
  Icono: ComponentType<SVGProps<SVGSVGElement>>
  accion: { texto: string; a: string }
}

const CAPITULOS: Capitulo[] = [
  {
    numero: 'Capítulo I',
    titulo: 'Origen',
    video: 'cosecha',
    texto: 'Nace en las laderas de Pitalito, en suelos nutridos con los bioinsumos limpios de AiCAFÉ. Cada cereza se recoge madura, a mano.',
    Icono: IconoCerezas,
    accion: { texto: 'Impacto', a: '#impacto' },
  },
  {
    numero: 'Capítulo II',
    titulo: 'Secado',
    video: 'secado',
    texto: 'Al sol y en patio, como se ha hecho siempre en el Huila: el grano descansa y se voltea hasta quedar listo para la trilla.',
    Icono: IconoSecado,
    accion: { texto: 'Desde Pitalito', a: '#nosotros' },
  },
  {
    numero: 'Capítulo III',
    titulo: 'Tostión',
    video: 'tostion',
    texto: 'Tostamos y molemos en origen para un perfil clásico y equilibrado: cuerpo medio, notas limpias y mucho aroma.',
    Icono: IconoTostion,
    accion: { texto: 'Ver productos', a: '/productos' },
  },
  {
    numero: 'Capítulo IV',
    titulo: 'La taza',
    video: 'vertido',
    texto: 'Cinco gramos en un sachet. Agua caliente, leche o un licor, de dos a tres minutos, y el café de origen está servido.',
    Icono: IconoTaza,
    accion: { texto: 'Prepara la tuya', a: '#taza' },
  },
]

const ONDA = 'M0 30C240 0 480 0 720 30S1200 60 1440 30S1920 0 2160 30S2640 60 2880 30V60H0Z'
const TAZA = 'M14 30h62v38a31 31 0 0 1-31 31 31 31 0 0 1-31-31Z'

/*
 * Las cuatro tarjetas de video se apilan con el scroll (sticky): cada una tapa a la anterior, que se
 * encoge y oscurece. A un lado, una taza fija se va llenando de café con ola mientras se avanza.
 */
export function Ciclo() {
  const raiz = useRef<HTMLElement>(null)
  const [actual, setActual] = useState(0)

  useGSAP(
    () => {
      const q = gsap.utils.selector(raiz)
      const pila = q('[data-pila]')[0]
      const tarjetas = q('[data-capitulo]')
      ScrollTrigger.create({
        trigger: pila,
        start: 'top 55%',
        end: 'bottom bottom',
        onUpdate: (s) => setActual(Math.min(CAPITULOS.length - 1, Math.floor(s.progress * CAPITULOS.length))),
      })
      if (prefiereMenosMovimiento()) return
      // El café sube en la taza con el recorrido de la pila
      gsap.fromTo(q('[data-nivel]'), { yPercent: 100 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: pila, start: 'top 55%', end: 'bottom bottom', scrub: 0.6 } })
      tarjetas.forEach((t, i) => {
        const siguiente = tarjetas[i + 1]
        const interior = t.querySelector('[data-interior]')
        if (siguiente && interior)
          gsap.fromTo(
            interior,
            { scale: 1, opacity: 1 },
            { scale: 0.9, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: siguiente, start: 'top bottom', end: 'top 20%', scrub: true } },
          )
        gsap.fromTo(t.querySelectorAll('[data-pieza]'), { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: t, start: 'top 65%' } })
        const icono = t.querySelector('[data-icono]')
        if (icono)
          gsap.fromTo(icono, { scale: 0.5, rotation: -25, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.8)', scrollTrigger: { trigger: t, start: 'top 55%' } })
      })
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="ciclo" data-nav="oscuro" className="relative bg-noche py-[clamp(7rem,11vw,10rem)]">
      <div className="marco mx-auto max-w-[900px] text-center">
        <h2 className="titular text-mega">
          <span className="menor">El</span>
          <br />
          ciclo <span className="menor">del</span> café
        </h2>
        <p className="mx-auto mt-6 max-w-[48ch] text-frase text-durazno/85">
          El carácter del café viene de su origen; el alma, de la tostión; y la taza guarda su expresión completa. Este es el
          nuestro, de la ladera al sachet.
        </p>
      </div>

      <div data-pila className="relative mt-[clamp(4rem,7vw,6rem)]">
        {/* La taza que se llena, fija a un lado mientras pasan los capítulos */}
        <div className="pointer-events-none absolute inset-y-0 left-[clamp(1rem,2.2vw,2.25rem)] z-30 hidden w-[110px] xl:block" aria-hidden="true">
          <div className="sticky top-[calc(50svh-80px)] text-center">
            <div className="relative mx-auto h-[120px] w-[100px]">
              <svg viewBox="0 0 100 120" className="absolute inset-0 h-full w-full overflow-visible">
                <defs>
                  <clipPath id="ciclo-taza">
                    <path d={TAZA} />
                  </clipPath>
                </defs>
                <path d={TAZA} fill="#2a1d14" />
                <g clipPath="url(#ciclo-taza)">
                  <g data-nivel style={{ transform: 'translateY(100%)' }}>
                    <svg x="-40" y="22" width="200" height="12" viewBox="0 0 2880 60" preserveAspectRatio="none" className="overflow-visible">
                      <path d={ONDA} fill="var(--color-cafe)" className="animate-[ola_2.4s_linear_infinite]" />
                    </svg>
                    <rect x="-10" y="33" width="120" height="120" fill="var(--color-cafe)" />
                  </g>
                </g>
                <path d="M76 40h6a10 10 0 0 1 0 20h-6" fill="none" stroke="var(--color-durazno)" strokeWidth="3" />
                <path d={TAZA} fill="none" stroke="var(--color-durazno)" strokeWidth="3" />
                <path d="M6 108h84" stroke="var(--color-durazno)" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 120 160" className="vapor absolute -top-[50px] left-[22%] w-[48%] text-durazno/60" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                <path d="M38 156c-14-22 18-36 4-60s16-38 6-70" />
                <path d="M62 156c-12-24 20-34 6-60s14-40 4-74" />
                <path d="M86 156c-14-20 16-36 4-58s14-38 4-66" />
              </svg>
            </div>
            <p className="titular mt-3 text-[1.5rem] leading-none">{CAPITULOS[actual]?.titulo}</p>
            <p className="mt-1 text-nota text-suave tabular-nums">
              {actual + 1} de {CAPITULOS.length}
            </p>
          </div>
        </div>

        {CAPITULOS.map((c, i) => (
          <article
            key={c.titulo}
            data-capitulo
            className="sticky mx-auto mb-[14svh] h-[min(76svh,720px)] w-[min(1440px,calc(100vw-2*clamp(1rem,7vw,10rem)))] last:mb-0"
            style={{ top: `calc(120px + ${i * 24}px)` }}
          >
            <div data-interior className="relative h-full origin-top overflow-hidden rounded-[28px] bg-tostado shadow-[0_-30px_60px_-30px_rgb(0_0_0/.85)]">
              <div className="absolute inset-0">
                <VideoFondo nombre={c.video} filtro="brightness(.5) saturate(.9)" />
              </div>
              <div className="relative grid h-full grid-rows-[auto_1fr_auto] p-[clamp(1.25rem,4vw,4rem)]">
                <p data-pieza className="text-center text-nota tracking-[0.18em] text-durazno/80 uppercase">
                  {c.numero}
                </p>
                <div className={`grid items-center gap-8 md:grid-cols-[1.1fr_auto_1fr] ${i % 2 ? 'md:[direction:rtl]' : ''}`}>
                  <h3 data-pieza className="titular text-titulo [direction:ltr]">
                    {c.titulo}
                  </h3>
                  <c.Icono data-icono className="mx-auto hidden w-[clamp(5rem,8vw,7.5rem)] text-crema md:block" />
                  <p data-pieza className="max-w-[36ch] text-frase text-crema/90 [direction:ltr]">
                    {c.texto}
                  </p>
                </div>
                <div data-pieza className="text-center">
                  <Pildora a={c.accion.a}>{c.accion.texto}</Pildora>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
