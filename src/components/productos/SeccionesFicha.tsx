'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Ancla } from '@/components/navegacion/Ancla'
import { IconoSachet, IconoSobre, IconoTaza, IconoVertido } from '@/components/ui/Iconos'
import { Logger } from '@/components/ui/Logger'
import { BotonAgregar } from '@/components/carrito/PanelCarrito'
import { Pildora } from '@/components/ui/Pildora'
import { VideoFondo } from '@/components/ui/VideoFondo'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { PRODUCTOS, type Producto } from '@/lib/productos'
import { enlaceWhatsApp } from '@/lib/sitio'

/* ─── Intensidad: anillos concéntricos que se encienden según el valor de la pestaña ─── */
const ATRIBUTOS = [
  { clave: 'balance', nombre: 'Balance', texto: 'Qué tan bien conviven el dulzor, el amargor y la acidez en la taza.' },
  { clave: 'acidez', nombre: 'Acidez', texto: 'La viveza en boca: de suave y redonda a brillante y frutal.' },
  { clave: 'intensidad', nombre: 'Intensidad', texto: 'La fuerza del sabor: de delicado a marcado y profundo.' },
  { clave: 'cuerpo', nombre: 'Cuerpo', texto: 'La textura en boca: de ligera a densa y envolvente.' },
  { clave: 'aroma', nombre: 'Aroma', texto: 'Lo que se siente antes del primer sorbo, al abrir el sobre.' },
] as const

/*
 * Perfil de taza vivo: al entrar, los anillos se despliegan desde el centro con el scroll y luego
 * respiran en ola; la cifra cuenta hasta su valor, el indicador se desliza bajo la pestaña y al
 * cambiar de atributo los anillos ondulan. La caja y los ingredientes flotan con parallax.
 */
export function Intensidad({ p }: { p: Producto }) {
  const [activo, setActivo] = useState<(typeof ATRIBUTOS)[number]['clave']>('intensidad')
  const raiz = useRef<HTMLElement>(null)
  const numero = useRef<HTMLSpanElement>(null)
  const indicador = useRef<HTMLSpanElement>(null)
  const pestanas = useRef<(HTMLButtonElement | null)[]>([])
  const previo = useRef(0)
  const valor = p.perfil[activo]
  const a = ATRIBUTOS.find((x) => x.clave === activo) ?? ATRIBUTOS[2]

  // Entrada con el scroll y parallax de los objetos flotantes
  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      gsap.fromTo(
        q('[data-anillo]'),
        { scale: 0.2, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'power2.out', stagger: { each: 0.06, from: 'end' }, scrollTrigger: { trigger: raiz.current, start: 'top 85%', end: 'center 55%', scrub: 0.8 } },
      )
      for (const f of q('[data-flota]')) {
        const v = Number(f.getAttribute('data-flota'))
        gsap.fromTo(f, { y: v, rotation: -v / 8 }, { y: -v, rotation: v / 8, ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      gsap.fromTo(q('[data-pieza]'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: raiz.current, start: 'top 70%' } })
    },
    { scope: raiz },
  )

  // Cambio de atributo: la cifra cuenta, el indicador se desliza y los anillos ondulan
  useGSAP(
    () => {
      const btn = pestanas.current[ATRIBUTOS.findIndex((x) => x.clave === activo)]
      if (btn && indicador.current) gsap.to(indicador.current, { x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.6, ease: 'expo.out' })
      const cuenta = { v: previo.current }
      gsap.to(cuenta, {
        v: valor,
        duration: prefiereMenosMovimiento() ? 0 : 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (numero.current) numero.current.textContent = String(Math.round(cuenta.v))
        },
      })
      previo.current = valor
      if (prefiereMenosMovimiento()) return
      gsap.fromTo(raiz.current?.querySelectorAll('[data-onda]') ?? [], { scale: 0.92 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)', stagger: { each: 0.035, from: 'end' } })
    },
    { scope: raiz, dependencies: [activo, valor] },
  )

  return (
    <section ref={raiz} data-nav="claro" className="relative overflow-hidden bg-papel py-[clamp(5rem,8vw,7rem)] text-espresso">
      {/* objetos flotantes con parallax */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {p.sensorial.slice(0, 3).map((n, k) => (
          <div key={n.nombre} data-flota={[30, 45, 36][k]} className="absolute hidden xl:block" style={{ left: ['3%', '88%', '80%'][k], top: ['80%', '22%', '84%'][k] }}>
            <Image src={`/ingredientes/${n.img}.webp`} alt="" width={180} height={120} className="w-[clamp(70px,8vw,140px)] drop-shadow-[0_14px_14px_rgb(58_39_27/.25)]" />
          </div>
        ))}
      </div>

      <div className="marco relative grid items-center gap-10 lg:grid-cols-[1fr_1.6fr_1fr]">
        <div>
          <h2 data-pieza className="titular text-subtitulo text-espresso">
            {p.notas[0]} <span className="menor">y</span> {p.notas[1]}
          </h2>
          <p data-pieza className="mt-5 max-w-[40ch] text-cuerpo text-cafe">
            {p.texto}
          </p>
          <div data-flota="20" className="relative mt-8 hidden w-[min(100%,280px)] lg:block">
            <Image src={p.recorte ?? p.foto} alt={p.alt} width={1200} height={1050} sizes="300px" className="w-full drop-shadow-[0_26px_24px_rgb(58_39_27/.35)]" />
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[620px]">
          {Array.from({ length: 10 }, (_, i) => {
            const n = 10 - i
            const encendido = n <= valor
            return (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: anillos fijos
                key={i}
                data-anillo
                aria-hidden="true"
                className="absolute"
                style={{ inset: `${i * 5}%` }}
              >
                <span
                  data-onda
                  className="block h-full w-full animate-[respirar_4s_ease-in-out_infinite] rounded-full transition-[background-color] duration-700"
                  style={{
                    animationDelay: `${i * 0.18}s`,
                    background: encendido ? `color-mix(in srgb, ${p.tarjeta} ${10 + (10 - n) * 5}%, #efdcc8)` : 'color-mix(in srgb, #5a3b26 5%, #efdcc8)',
                  }}
                />
              </span>
            )
          })}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="titular text-[1.2rem] text-cafe">Perfil de taza</p>
            <div className="relative mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1" role="tablist" aria-label="Atributos">
              {ATRIBUTOS.map((x, k) => (
                <button
                  key={x.clave}
                  ref={(el) => {
                    pestanas.current[k] = el
                  }}
                  type="button"
                  role="tab"
                  aria-selected={x.clave === activo}
                  onClick={() => setActivo(x.clave)}
                  className={`relative pb-1 text-[clamp(1.1rem,1.7vw,1.6rem)] transition-colors ${x.clave === activo ? 'text-espresso' : 'text-cafe/45 hover:text-cafe'}`}
                >
                  {x.nombre}
                </button>
              ))}
              <span ref={indicador} aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] rounded-full bg-espresso" style={{ width: 0 }} />
            </div>
            <p key={a.clave} className="mt-3 max-w-[32ch] animate-[aparecer_.5s_ease_both] text-nota text-cafe">
              {a.texto}
            </p>
            <p className="titular mt-5 text-titulo text-espresso tabular-nums" aria-live="polite">
              <span ref={numero}>{valor}</span>
              <span className="menor text-cafe">/10</span>
            </p>
          </div>
        </div>

        <dl className="grid gap-4 text-cafe lg:text-right">
          {[
            ['Caja', '20 sachets'],
            ['Por sachet', '5 g · 100 ml'],
            ['Origen', 'Pitalito, Huila'],
          ].map(([t, d]) => (
            <div key={t} data-pieza>
              <dt className="text-nota">{t}</dt>
              <dd className="titular text-[2rem] text-espresso">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ─── Rueda sensorial: segmentos proporcionales y los ingredientes alrededor ─── */
function arco(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  // Redondeo a 2 decimales: Math.cos/sin pueden diferir en el último decimal entre servidor y
  // navegador y React lo marca como error de hidratación
  const redondo = (n: number) => Math.round(n * 100) / 100
  const p = (r: number, a: number) => `${redondo(cx + r * Math.cos(a))} ${redondo(cy + r * Math.sin(a))}`
  const largo = a1 - a0 > Math.PI ? 1 : 0
  return `M${p(r2, a0)}A${r2} ${r2} 0 ${largo} 1 ${p(r2, a1)}L${p(r1, a1)}A${r1} ${r1} 0 ${largo} 0 ${p(r1, a0)}Z`
}

/*
 * Rueda sensorial: los segmentos se abren girando, la rueda rota apenas con el scroll, el segmento
 * bajo el ratón sale hacia afuera y su ingrediente salta; el título entra letra a letra.
 */
export function RuedaSensorial({ p }: { p: Producto }) {
  const [sobre, setSobre] = useState<number | null>(null)
  const raiz = useRef<HTMLElement>(null)
  const huecos = 0.035
  let acumulado = -Math.PI / 2
  const segmentos = p.sensorial.map((n) => {
    const a0 = acumulado + huecos
    acumulado += (n.pct / 100) * Math.PI * 2
    const a1 = acumulado - huecos
    return { ...n, a0, a1, medio: (a0 + a1) / 2 }
  })

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      const entrada = { trigger: raiz.current, start: 'top 65%' }
      gsap.fromTo(q('[data-segmento]'), { scale: 0.5, rotation: -40, opacity: 0, transformOrigin: '500px 500px' }, { scale: 1, rotation: 0, opacity: 1, duration: 1.3, ease: 'expo.out', stagger: 0.12, scrollTrigger: entrada })
      gsap.fromTo(q('[data-ingrediente]'), { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 1, ease: 'back.out(2.2)', stagger: 0.12, delay: 0.35, scrollTrigger: entrada })
      const titulo = q('[data-titulo]')[0]
      if (titulo) {
        // Sin `mask`: recortaría las tildes (Ó, Á) con este interlineado tan ajustado
        const partes = SplitText.create(titulo, { type: 'words,chars' })
        gsap.fromTo(partes.chars, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.03, scrollTrigger: entrada })
        return () => partes.revert()
      }
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} data-nav="claro" className="relative overflow-hidden bg-papel pb-[clamp(5rem,8vw,7rem)] text-espresso">
      <div className="relative mx-auto aspect-square w-[min(94vw,960px)]">
        <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <g data-giro>
            <circle cx="500" cy="500" r="290" fill="none" stroke="#5a3b26" strokeOpacity=".25" />
            <circle cx="500" cy="500" r="486" fill="none" stroke="#5a3b26" strokeOpacity=".12" strokeDasharray="2 10" />
            {segmentos.map((s, i) => {
              const fuera = sobre === i ? 18 : 0
              return (
                <path
                  key={s.nombre}
                  data-segmento
                  d={arco(500, 500, 300, 470, s.a0, s.a1)}
                  fill={sobre === i ? `color-mix(in srgb, ${p.tarjeta} 28%, #fbf3ea)` : '#f6e9da'}
                  stroke="#5a3b26"
                  strokeOpacity=".28"
                  className="cursor-pointer transition-[fill,translate] duration-500 [transition-timing-function:var(--ease-salto)]"
                  style={{ translate: `${Math.round(Math.cos(s.medio) * fuera)}px ${Math.round(Math.sin(s.medio) * fuera)}px` }}
                  onMouseEnter={() => setSobre(i)}
                  onMouseLeave={() => setSobre(null)}
                />
              )
            })}
          </g>
        </svg>
        {segmentos.map((s, i) => {
          const x = Math.round((50 + 38.5 * Math.cos(s.medio)) * 100) / 100
          const y = Math.round((50 + 38.5 * Math.sin(s.medio)) * 100) / 100
          return (
            <div key={s.nombre} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <div data-ingrediente>
                <div className={`animate-[flotar_4.5s_ease-in-out_infinite] transition-transform duration-500 [transition-timing-function:var(--ease-salto)] ${sobre === i ? 'scale-[1.35] -translate-y-3 -rotate-6' : ''}`} style={{ animationDelay: `${-i * 1.1}s` }}>
                  <Image src={`/ingredientes/${s.img}.webp`} alt="" width={200} height={130} className="w-[min(17vw,170px)] drop-shadow-[0_14px_14px_rgb(58_39_27/.25)]" />
                </div>
              </div>
              <div
                className={`absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-[12px] bg-cafe px-4 py-2 text-center whitespace-nowrap text-crema transition-[opacity,transform] duration-300 ${sobre === i ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
              >
                <span className="block text-nota">{s.nombre}</span>
                <span className="titular block text-[1.8rem] leading-none text-crema">{s.pct} %</span>
              </div>
            </div>
          )
        })}
        <div className="absolute inset-[31%] flex flex-col items-center justify-center text-center">
          <p className="text-nota tracking-[0.16em] text-cafe uppercase">Perfil sensorial</p>
          <h2 data-titulo className="titular mt-2 text-[clamp(2rem,4.2vw,4rem)] leading-[0.92] text-espresso">
            <span className="menor">La</span> tostión
            <br />
            crea carácter
          </h2>
          <p className="mt-3 text-nota text-cafe">Pasa el ratón por cada nota</p>
        </div>
      </div>
    </section>
  )
}

/* ─── Preparación ─── */
const PASOS = [
  { titulo: 'Abre', texto: 'Rasga el sobre y saca el sachet', Icono: IconoSobre },
  { titulo: 'Coloca', texto: 'En la taza, la etiqueta por fuera', Icono: IconoSachet },
  { titulo: 'Vierte', texto: '100 ml de agua, leche o licor', Icono: IconoVertido },
  { titulo: 'Disfruta', texto: 'Muévelo de 2 a 3 minutos', Icono: IconoTaza },
]

export function Preparacion() {
  return (
    <section data-nav="claro" className="bg-papel pb-[clamp(5rem,8vw,7rem)] text-espresso">
      <h2 className="marco text-center font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-none font-[300] tracking-[-0.03em]">Preparación y consumo</h2>
      <div className="marco mx-auto mt-12 grid max-w-[1260px] items-stretch gap-0 lg:grid-cols-[1.6fr_1fr]">
        <div data-revelar="imagen" className="relative min-h-[420px] overflow-hidden rounded-[24px] lg:rounded-r-none">
          <Image src="/ingredientes/granos.webp" alt="" fill sizes="60vw" className="scale-[2.2] object-cover opacity-90" />
          <div className="absolute inset-[10%] overflow-hidden rounded-[18px] shadow-[0_30px_60px_-30px_rgb(0_0_0/.7)]">
            <VideoFondo nombre="vertido" filtro="brightness(.95)" />
          </div>
        </div>
        <ol className="grid content-center gap-4 rounded-[24px] bg-crema px-8 py-10 text-center lg:my-8 lg:rounded-l-none">
          {PASOS.map((s, i) => (
            <li key={s.titulo} data-revelar>
              <s.Icono className="mx-auto w-12 text-espresso" />
              <p className="titular mt-1 text-[1.5rem] text-espresso">{s.titulo}</p>
              <p className="text-nota text-cafe">{s.texto}</p>
              {i < PASOS.length - 1 ? (
                <p aria-hidden="true" className="mt-2 text-cafe">
                  ↓
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ─── También te puede gustar ─── */
export function TePuedeGustar({ p }: { p: Producto }) {
  const otros = PRODUCTOS.filter((x) => x.slug !== p.slug)
  return (
    <section data-nav="claro" className="bg-papel pb-[clamp(6rem,9vw,8rem)] text-espresso">
      <h2 className="marco text-center font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-none font-[300] tracking-[-0.03em]">También te puede gustar</h2>
      <ul className="marco mx-auto mt-14 grid max-w-[1260px] grid-cols-2 gap-8 md:grid-cols-4">
        {otros.map((o) => (
          <li key={o.slug} data-revelar>
            <Ancla a={`/productos/${o.slug}`} className="group block text-center">
              <span className="relative mx-auto block aspect-[4/3] w-full transition-transform duration-700 [transition-timing-function:var(--ease-salto)] group-hover:-translate-y-3 group-hover:-rotate-3">
                {o.recorte ? (
                  <Image src={o.recorte} alt={o.alt} fill sizes="25vw" className="object-contain drop-shadow-[0_22px_20px_rgb(58_39_27/.35)]" />
                ) : (
                  <Image src={o.foto} alt={o.alt} fill sizes="25vw" className="rounded-[16px] object-cover" />
                )}
              </span>
              <span className="mt-5 block font-display text-nota text-cafe italic">{o.linea === 'Línea Tradicional' ? 'Línea Tradicional' : 'By Gugo'}</span>
              <Logger className="block text-[1.7rem] leading-none">{o.nombre}</Logger>
            </Ancla>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ─── Banner de cierre con video ─── */
export function BannerVideo({ p }: { p: Producto }) {
  return (
    <section data-nav="oscuro" className="relative grid min-h-[90svh] place-items-center overflow-hidden bg-noche text-center">
      <div className="absolute inset-0">
        <VideoFondo nombre="tostion" filtro="brightness(.4) saturate(.95)" />
      </div>
      <div className="marco relative">
        <p data-revelar className="text-nota tracking-[0.18em] text-durazno uppercase">
          El ciclo del café
        </p>
        <h2 data-revelar className="titular mt-4 text-titulo">
          Notas <span className="menor">de</span> tradición,
          <br />
          origen <span className="menor">y</span> dedicación
        </h2>
        <div data-revelar className="mt-8 flex flex-wrap justify-center gap-3">
          <Pildora a="/#ciclo">Ver el ciclo del café</Pildora>
          <BotonAgregar slug={p.slug} />
        </div>
      </div>
    </section>
  )
}
