'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { TemaNav } from '@/components/navegacion/temas'
import { Logger } from '@/components/ui/Logger'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { enlaceWhatsApp } from '@/lib/sitio'

const SABORES: { nombre: string; tema: TemaNav; color: string; texto: string; notas: string; src: string; alt: string }[] = [
  {
    nombre: 'Tradicional',
    tema: 'oscuro',
    color: 'var(--color-tostado)',
    texto: 'El café de origen de siempre: perfil clásico, cuerpo medio y notas limpias.',
    notas: 'Equilibrado · aromático · 100 % colombiano',
    src: '/img/caja-tradicional.webp',
    alt: 'Caja negra de CaFETAL Línea Tradicional con un sachet',
  },
  {
    nombre: 'Anís',
    tema: 'anis',
    color: 'var(--color-anis)',
    texto: 'La intensidad del café con el carácter dulce, herbal y algo licoroso del anís.',
    notas: 'Herbal · licoroso · para tomar despacio',
    src: '/img/sabor-anis.webp',
    alt: 'Caja roja de CaFETAL sabor anís con anís estrellado',
  },
  {
    nombre: 'Campesino',
    tema: 'campesino',
    color: 'var(--color-campesino)',
    texto: 'Clavos y canela, como el café que perfumaba la cocina de las abuelas junto al fogón.',
    notas: 'Clavo · canela · sabe a hogar',
    src: '/img/sabor-campesino.webp',
    alt: 'Caja café de CaFETAL sabor campesino con canela y clavos',
  },
  {
    nombre: 'Cardamomo',
    tema: 'cardamomo',
    color: 'var(--color-cardamomo)',
    texto: 'Notas cálidas y especiadas que despiertan los sentidos desde el primer sorbo.',
    notas: 'Especiado · fresco · elegante',
    src: '/img/sabor-cardamomo.webp',
    alt: 'Caja verde de CaFETAL sabor cardamomo con vainas',
  },
  {
    nombre: 'Jengibre',
    tema: 'jengibre',
    color: 'var(--color-jengibre)',
    texto: 'El toque picante y vigorizante del jengibre, de notas terrosas y algo cítricas.',
    notas: 'Picante suave · cítrico · vital',
    src: '/img/sabor-jengibre.webp',
    alt: 'Caja ocre de CaFETAL sabor jengibre con raíz de jengibre',
  },
]

export function Sabores() {
  const raiz = useRef<HTMLElement>(null)
  const [i, setI] = useState(0)
  const [fijo, setFijo] = useState(true)

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) {
        setFijo(false)
        return
      }
      ScrollTrigger.create({
        trigger: raiz.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (s) => setI(Math.min(SABORES.length - 1, Math.floor(s.progress * SABORES.length))),
      })
    },
    { scope: raiz },
  )

  const s = SABORES[i]

  // Sin movimiento: los cinco en lista, uno debajo del otro
  if (!fijo) {
    return (
      <section id="sabores" data-nav="oscuro" data-seccion className="marco py-[clamp(7rem,10vw,9rem)]">
        <h2 className="text-display">Cinco cafés, un mismo origen.</h2>
        <ul className="mt-16 grid gap-16">
          {SABORES.map((x) => (
            <li key={x.nombre} className="rejilla items-center gap-y-6">
              <div className="col-span-12 sm:col-span-6">
                <Image src={x.src} alt={x.alt} width={1440} height={1148} quality={80} sizes="(min-width: 640px) 50vw, 92vw" />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <h3 className="text-frase">
                  <Logger>{x.nombre}</Logger>
                </h3>
                <p className="mt-3">{x.texto}</p>
                <p className="mt-2 text-nota text-suave">{x.notas}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section ref={raiz} id="sabores" data-seccion className="relative h-[560svh]">
      <div data-nav={s.tema} className="sticky top-0 grid h-svh grid-rows-[1fr_auto_1fr] overflow-hidden px-[clamp(1rem,3.2vw,3rem)] pt-[76px]">
        <h2 className="contents">
          <span className="self-end pb-[0.42em] text-center text-display max-sm:text-[10vw]">Cinco cafés,</span>
          <span className="relative z-10 order-3 -mt-[0.32em] self-start text-center text-display max-sm:text-[10vw]">
            un mismo origen.
          </span>
        </h2>

        {/* Marco central: el campo de color de la caja detrás y las cinco fotos encima */}
        <div className="relative order-2 mx-auto w-[min(36vw,560px)] max-sm:w-[78vw]">
          {SABORES.map((x, k) => (
            <div
              key={x.nombre}
              aria-hidden="true"
              className="absolute -inset-[7%] transition-opacity duration-700"
              style={{ background: x.color, opacity: k === i ? 1 : 0 }}
            />
          ))}
          <div className="relative aspect-[5/4] overflow-hidden">
            {SABORES.map((x, k) => (
              <Image
                key={x.nombre}
                src={x.src}
                alt={k === i ? x.alt : ''}
                fill
                quality={85}
                sizes="(min-width: 640px) 36vw, 78vw"
                className="object-cover transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-suave)]"
                style={{ opacity: k === i ? 1 : 0, transform: k === i ? 'scale(1)' : 'scale(1.08)' }}
              />
            ))}
          </div>
        </div>

        {/* Lista de nombres a la izquierda: el actual en tinta plena */}
        <ol className="absolute top-1/2 left-[clamp(1rem,3.2vw,3rem)] hidden -translate-y-1/2 lg:block" aria-label="Sabores">
          {SABORES.map((x, k) => (
            <li
              key={x.nombre}
              className="text-frase leading-[1.25] transition-colors duration-500"
              style={{ color: k === i ? 'var(--color-crema)' : 'rgb(233 231 227 / .34)' }}
            >
              <Logger>{x.nombre}</Logger>
            </li>
          ))}
        </ol>

        {/* Leyenda a la derecha */}
        <div
          key={s.nombre}
          className="absolute top-1/2 right-[clamp(1rem,3.2vw,3rem)] hidden w-[min(28ch,22vw)] -translate-y-1/2 animate-[aparecer_.6s_ease_both] lg:block"
          aria-live="polite"
        >
          <h3 className="text-frase">
            <Logger>{s.nombre}</Logger>
          </h3>
          <p className="mt-4">{s.texto}</p>
          <p className="mt-3 text-nota text-suave">{s.notas}</p>
          <a
            href={enlaceWhatsApp(`Hola CaFETAL, quiero pedir el café ${s.nombre}.`)}
            target="_blank"
            rel="noreferrer"
            className="enlace mt-6 inline-block"
          >
            Pedir {s.nombre}
          </a>
        </div>

        {/* Teléfono: leyenda corta bajo la frase */}
        <p className="absolute inset-x-4 bottom-6 pr-24 text-left text-cuerpo lg:hidden" aria-live="polite">
          <Logger className="mr-2">{s.nombre}</Logger>
          {s.notas}
        </p>
      </div>
    </section>
  )
}
