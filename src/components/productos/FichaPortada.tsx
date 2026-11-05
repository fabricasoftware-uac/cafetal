'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Grano } from '@/components/ui/Cafe'
import { Logger } from '@/components/ui/Logger'
import { BotonAgregar } from '@/components/carrito/PanelCarrito'
import { Pildora } from '@/components/ui/Pildora'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import type { Producto } from '@/lib/productos'
import { enlaceWhatsApp } from '@/lib/sitio'

// Granos que caen y luego flotan siguiendo al ratón: posición (en %), tamaño, giro y profundidad
const GRANOS = [
  { x: 33, y: 22, t: 34, g: -30, p: 40 },
  { x: 36, y: 34, t: 26, g: 50, p: 28 },
  { x: 64, y: 18, t: 30, g: 20, p: 52 },
  { x: 70, y: 14, t: 22, g: -60, p: 34 },
  { x: 60, y: 52, t: 28, g: 80, p: 46 },
  { x: 41, y: 58, t: 20, g: -10, p: 24 },
]

/*
 * Portada de la ficha: fondo partido en V con la ilustración del ingrediente a los dos lados.
 * Entrada: los paneles llegan desde los lados, el borde se dibuja, el nombre sube letra a letra,
 * el sello gira y los granos caen rebotando.
 */
export function FichaPortada({ p }: { p: Producto }) {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(q('[data-panel="izq"]'), { xPercent: -100 }, { xPercent: 0, duration: 1.3 }, 0)
        .fromTo(q('[data-panel="der"]'), { xPercent: 100 }, { xPercent: 0, duration: 1.3 }, 0)
        .fromTo(q('[data-borde]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.3)
        .fromTo(q('[data-letra]'), { yPercent: 110, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 1, stagger: 0.045 }, 0.45)
        .fromTo(q('[data-sube]'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.75)
        .fromTo(q('[data-sello]'), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1.3, ease: 'back.out(1.6)', stagger: 0.15 }, 0.7)
        .fromTo(q('[data-grano]'), { y: () => -window.innerHeight * 0.7, opacity: 1 }, { y: 0, duration: 1.1, ease: 'bounce.out', stagger: 0.07 }, 0.6)

      // Los granos y los sellos derivan con el ratón
      const granos = q('[data-grano-mov]')
      const mx = granos.map((n) => gsap.quickTo(n, 'x', { duration: 1, ease: 'power3.out' }))
      const my = granos.map((n) => gsap.quickTo(n, 'y', { duration: 1, ease: 'power3.out' }))
      const alMover = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        GRANOS.forEach((g, i) => {
          mx[i]?.(nx * g.p)
          my[i]?.(ny * g.p)
        })
      }
      window.addEventListener('pointermove', alMover)
      // Las ilustraciones se abren un poco al bajar
      gsap.to(q('[data-ilustracion]'), { scale: 1.12, ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top top', end: 'bottom top', scrub: true } })
      return () => window.removeEventListener('pointermove', alMover)
    },
    { scope: raiz },
  )

  const recorte = { izq: 'polygon(0 0, 30% 0, 100% 100%, 0 100%)', der: 'polygon(70% 0, 100% 0, 100% 100%, 0 100%)' }

  return (
    <section ref={raiz} data-nav="oscuro" className="relative h-svh min-h-[680px] overflow-hidden bg-noche">
      {(['izq', 'der'] as const).map((lado) => (
        <div
          key={lado}
          data-panel={lado}
          className={`absolute inset-y-0 w-1/2 overflow-hidden ${lado === 'izq' ? 'left-0' : 'right-0'}`}
          style={{ clipPath: recorte[lado], background: p.color }}
        >
          <div data-ilustracion className="absolute inset-0">
            <Image
              src={`/ilustraciones/${p.slug}.webp`}
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
              style={{ transform: lado === 'der' ? 'scaleX(-1)' : undefined, objectPosition: lado === 'izq' ? '30% 50%' : '30% 40%' }}
            />
          </div>
        </div>
      ))}
      {/* Bordes de la V, en el color de acento del sabor */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <path data-borde d="M15 0L50 100L85 0" fill="none" stroke={p.acento} strokeWidth="5" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" />
      </svg>

      {GRANOS.map((g, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: lista fija
          key={i}
          data-grano-mov
          className="pointer-events-none absolute"
          style={{ left: `${g.x}%`, top: `${g.y}%`, width: g.t }}
          aria-hidden="true"
        >
          <span data-grano className="block" style={{ transform: `rotate(${g.g}deg)` }}>
            <Grano className="w-full text-cafe drop-shadow-[0_8px_10px_rgb(0_0_0/.6)]" style={{ ['--surco' as string]: 'rgb(0 0 0 / .45)' }} />
          </span>
        </span>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[760px] flex-col items-center justify-center px-6 pt-16 text-center">
        <p data-sube className="titular text-[1.6rem]">
          {p.linea}
        </p>
        <h1 className="mt-3 overflow-hidden pb-[0.08em] text-[clamp(3.6rem,10vw,9rem)] leading-[0.95] text-crema">
          <span className="sr-only">{p.nombre}</span>
          <span aria-hidden="true" className="inline-flex">
            {[...p.nombre.toLocaleUpperCase('es')].map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: letras en orden fijo
              <span key={i} data-letra className="inline-block">
                <Logger>{c}</Logger>
              </span>
            ))}
          </span>
        </h1>
        <span data-sube className="mt-4 block h-[2px] w-[min(300px,60vw)] bg-crema/60" />
        <p data-sube className="mt-5 font-display text-frase italic">
          Café tostado y molido · {p.corto.toLowerCase()}
        </p>
        <div data-sube className="mt-7">
          <div className="flex flex-wrap justify-center gap-3">
            <BotonAgregar slug={p.slug} />
            <Pildora href={enlaceWhatsApp(`Hola CaFETAL, quiero pedir el café ${p.nombre}.`)}>Preguntar</Pildora>
          </div>
        </div>
        <dl data-sube className="mt-7 grid grid-cols-[auto_auto] gap-x-8 gap-y-1 text-left text-nota">
          <dt className="text-suave">Caja</dt>
          <dd>20 sachets</dd>
          <dt className="text-suave">Por sachet</dt>
          <dd>5 g · 100 ml</dd>
          <dt className="text-suave">Origen</dt>
          <dd>Pitalito, Huila</dd>
        </dl>
      </div>

      {/* Sellos giratorios */}
      <Sello className="right-[16%] top-[20%] size-[118px] bg-transparent text-crema ring-0" texto={p.linea === 'Línea Tradicional' ? 'LINEA TRADICIONAL · CAFETAL · ' : 'PREMIUM SABORES · BY GUGO · '} centro={p.linea === 'Línea Tradicional' ? '100%' : '20'} />
      <Sello className="left-[19%] top-[48%] size-[132px] text-tinta" fondo={p.acento} texto="CAFE DE COLOMBIA · PITALITO · HUILA · " centro="" casa />
    </section>
  )
}

function Sello({ className, texto, centro, fondo, casa }: { className: string; texto: string; centro: string; fondo?: string; casa?: boolean }) {
  const id = `sello-${texto.length}-${centro}`
  return (
    <div data-sello className={`absolute z-10 hidden rounded-full lg:block ${className}`} style={{ background: fondo }} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[girar_24s_linear_infinite]">
        <defs>
          <path id={id} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" />
        </defs>
        <text className="fill-current font-logger text-[9px] tracking-[0.16em]">
          <textPath href={`#${id}`} textLength="236">
            {texto}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {casa ? (
          <svg viewBox="0 0 64 64" className="w-[42%] fill-none stroke-current" strokeWidth="2" aria-hidden="true">
            <path d="M8 40c10-2 22-16 26-30 6 14 14 24 22 28M16 38v14h32V40M26 52V42h10v10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="titular text-[2.6rem] leading-none text-inherit">{centro}</span>
        )}
      </div>
    </div>
  )
}
