'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BotonAgregar } from '@/components/carrito/PanelCarrito'
import { Logger } from '@/components/ui/Logger'
import { Pildora } from '@/components/ui/Pildora'
import { Polvo } from '@/components/ui/Polvo'
import { SalaSVG } from '@/components/ui/SalaSVG'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { PRODUCTOS } from '@/lib/productos'
import { useSonido } from '@/lib/sonido'

const N = PRODUCTOS.length
const AUTO = 6000
const CENTRO: [number, number] = [0.5, 0.6]

/*
 * Salón de la fama: un carrusel de vitrina sobre una foto real de pedestal con foco (Magnific).
 * La caja activa cae sobre el pedestal, la luz parpadea y toma el tono del sabor; las vecinas
 * esperan en la penumbra. Flechas, arrastre, teclado y nombres; avanza solo si nadie lo toca.
 */
export function SalonFama({ titulo = true, principal = false }: { titulo?: boolean; principal?: boolean }) {
  const raiz = useRef<HTMLElement>(null)
  const [i, setI] = useState(0)
  const [quieto, setQuieto] = useState(false)
  const arrastre = useRef<number | null>(null)
  const { sonar } = useSonido()
  const p = PRODUCTOS[i] ?? PRODUCTOS[0]

  const ir = useCallback(
    (n: number) => {
      setI(((n % N) + N) % N)
      sonar('vitrina')
    },
    [sonar],
  )

  useEffect(() => {
    if (quieto || prefiereMenosMovimiento()) return
    const id = window.setTimeout(() => setI((n) => (n + 1) % N), AUTO)
    return () => window.clearTimeout(id)
  }, [i, quieto])

  // Al cambiar: la caja cae sobre el pedestal y la luz parpadea
  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      gsap.fromTo(q('[data-activa]'), { y: -220, rotation: -8, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: 'bounce.out' })
      gsap.fromTo(q('[data-foco]'), { opacity: 0.2 }, { keyframes: { opacity: [0.1, 0.55, 0.25, 0.55] }, duration: 0.5, ease: 'none' })
      gsap.fromTo(q('[data-nombre] > *'), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.15 })
    },
    { scope: raiz, dependencies: [i] },
  )

  const relativo = (k: number) => {
    let d = k - i
    if (d > N / 2) d -= N
    if (d < -N / 2) d += N
    return d
  }

  return (
    <section
      ref={raiz}
      id="productos"
      data-nav="oscuro"
      className="relative overflow-hidden bg-[#140d09]"
      onMouseEnter={() => setQuieto(true)}
      onMouseLeave={() => setQuieto(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') ir(i + 1)
        if (e.key === 'ArrowLeft') ir(i - 1)
      }}
      aria-roledescription="carrusel"
      aria-label="Salón de la fama de CaFETAL"
    >
      {/*
        La sala: la foto (1672 × 941) va en un escenario con su misma proporción que cubre la
        sección. Todo lo que se apoya en el pedestal se coloca en % de ese escenario: la tapa
        del pedestal está al 66 % del alto y ocupa el 38 % del ancho, en cualquier pantalla.
      */}
      <div
        className="absolute top-1/2 left-1/2 aspect-[1672/941] w-[max(100%,calc(max(100svh,760px)*1.777))] -translate-x-1/2 -translate-y-1/2 touch-pan-y select-none"
        onPointerDown={(e) => {
          arrastre.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (arrastre.current === null) return
          const dx = e.clientX - arrastre.current
          arrastre.current = null
          if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1))
        }}
      >
        <SalaSVG tono={p.tarjeta} />
        <div data-foco aria-hidden="true" className="absolute inset-0" />
        <Polvo chispa={i} centro={CENTRO} />

        {PRODUCTOS.map((x, k) => {
          const d = relativo(k)
          if (Math.abs(d) > 2) return null
          const activa = d === 0
          return (
            <button
              key={x.slug}
              type="button"
              tabIndex={activa ? -1 : 0}
              aria-label={activa ? undefined : `Ver ${x.nombre}`}
              aria-hidden={activa}
              onClick={() => !activa && ir(k)}
              className="absolute bottom-[32.5%] left-1/2 w-[21%] max-md:bottom-[40%] transition-[transform,filter] duration-700 [transition-timing-function:var(--ease-cafe)]"
              style={{
                transform: `translateX(calc(-50% + ${d * 150}%)) scale(${activa ? 1 : Math.abs(d) === 1 ? 0.62 : 0.42})`,
                transformOrigin: '50% 100%',
                filter: activa ? 'none' : `brightness(${Math.abs(d) === 1 ? 0.4 : 0.22})`,
                zIndex: 10 - Math.abs(d),
              }}
            >
              <span data-activa={activa ? '' : undefined} className="relative block aspect-[4/3]">
                <Image src={x.recorte ?? x.foto} alt={activa ? x.alt : ''} fill quality={85} sizes="420px" className="object-contain object-bottom drop-shadow-[0_24px_20px_rgb(0_0_0/.75)]" />
              </span>
            </button>
          )
        })}
        {/* ingredientes que giran alrededor de la caja activa */}
        <span key={p.slug} aria-hidden="true" className="pointer-events-none absolute top-[52%] left-1/2 z-20 size-0">
          {p.particulas.map((img, k) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: lista fija
              key={k}
              className="absolute top-0 left-0 animate-[aparecer_.8s_ease_both]"
              style={{ animationDelay: `${0.6 + k * 0.15}s` }}
            >
              <span className="block" style={{ animation: `orbita ${9 + k * 2}s linear infinite`, animationDelay: `${-k * 3}s` }}>
                <Image src={`/ingredientes/${img}.webp`} alt="" width={110} height={70} className="w-[clamp(54px,5vw,86px)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_10px_rgb(0_0_0/.6)]" />
              </span>
            </span>
          ))}
        </span>
      </div>

      <div className="pointer-events-none relative h-svh min-h-[760px] pt-[clamp(7rem,10vw,9rem)] pb-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
        {titulo ? (
          <div className="marco relative z-10 text-center">
            <p className="text-nota tracking-[0.22em] text-dorado uppercase">Cinco cafés · una vitrina</p>
            {principal ? (
              <h1 className="titular mt-4 text-titulo leading-[0.95]">
                <span className="menor">El</span> salón <span className="menor">de la</span> fama
              </h1>
            ) : (
              <h2 className="titular mt-4 text-titulo leading-[0.95]">
                <span className="menor">El</span> salón <span className="menor">de la</span> fama
              </h2>
            )}
            {principal ? <p className="mx-auto mt-3 max-w-[52ch] text-cuerpo text-crema/80 max-md:hidden">Una línea tradicional y cuatro sabores premium By Gugo. Veinte sachets de cinco gramos en cada caja.</p> : null}
          </div>
        ) : null}

        {/* Ficha de la vitrina */}
        <div className="marco absolute inset-x-0 bottom-10 z-20 grid items-end gap-6 max-md:bottom-6 max-md:gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div data-nombre key={p.slug} className="overflow-hidden text-center md:col-start-2">
            <p className="font-display text-nota text-dorado italic">{p.linea}</p>
            <h3 className="mt-1 text-[clamp(2.4rem,5vw,4.6rem)] leading-none text-crema">
              <Logger>{p.nombre}</Logger>
            </h3>
            <p className="mt-2 text-cuerpo text-crema/80">{p.corto}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <BotonAgregar slug={p.slug} />
              <Pildora a={`/productos/${p.slug}`}>Ver ficha</Pildora>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 md:col-start-3 md:row-start-1 md:justify-end">
            <button type="button" onClick={() => ir(i - 1)} aria-label="Sabor anterior" className="grid size-14 place-items-center rounded-full bg-noche/70 text-durazno ring-1 ring-durazno/30 transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-x-1 hover:bg-dorado hover:text-tinta">
              ←
            </button>
            <span className="titular w-[3.2ch] text-center text-[1.6rem] tabular-nums">
              {i + 1}
              <span className="menor">/{N}</span>
            </span>
            <button type="button" onClick={() => ir(i + 1)} aria-label="Sabor siguiente" className="grid size-14 place-items-center rounded-full bg-noche/70 text-durazno ring-1 ring-durazno/30 transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:translate-x-1 hover:bg-dorado hover:text-tinta">
              →
            </button>
          </div>

          <ul className="hidden gap-4 md:col-start-1 md:row-start-1 md:flex" aria-label="Sabores">
            {PRODUCTOS.map((x, k) => (
              <li key={x.slug}>
                <button type="button" onClick={() => ir(k)} aria-current={k === i ? 'true' : undefined} className={`group text-left transition-colors ${k === i ? 'text-dorado' : 'text-crema/50 hover:text-crema'}`}>
                  <span className="block h-[2px] w-12 overflow-hidden bg-crema/20">
                    <span
                      key={k === i ? `on-${i}-${quieto}` : 'off'}
                      className="block h-full origin-left bg-dorado"
                      style={k === i ? (quieto ? { transform: 'scaleX(1)' } : { animation: `llenar ${AUTO / 1000}s linear both` }) : { transform: 'scaleX(0)' }}
                    />
                  </span>
                  <Logger className="mt-2 block text-[0.95rem]">{x.nombre}</Logger>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
