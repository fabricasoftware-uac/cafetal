'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

// Eslabones del ecosistema regenerativo y del impacto, tal como los nombra el brochure
const NOMBRES = ['AiCAFÉ', 'suelos vivos', 'el Mirador del CaFETAL', 'Mujeres Sembrando Vida', 'comercio justo']

export function Impacto() {
  const [lit, setLit] = useState(0)

  useEffect(() => {
    if (prefiereMenosMovimiento()) return
    const id = window.setInterval(() => setLit((n) => (n + 1) % NOMBRES.length), 2000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="impacto" data-nav="oscuro" data-seccion className="marco rejilla items-center gap-y-14 py-[clamp(5rem,8vw,7rem)]">
      <div className="col-span-12 lg:col-span-6">
      <h2 className="text-display">Impacto</h2>
      <p data-revelar className="mt-10 max-w-[40ch] text-frase">
        <span className="text-crema">Cada taza pasa por </span>
        {NOMBRES.map((n, k) => (
          <span key={n}>
            <span
              className="transition-colors duration-[400ms]"
              style={{ color: k === lit ? 'var(--color-dorado)' : 'rgb(233 231 227 / .5)' }}
            >
              {n}
            </span>
            <span style={{ color: 'rgb(233 231 227 / .5)' }}>
              {k === NOMBRES.length - 2 ? ' y ' : k === NOMBRES.length - 1 ? '.' : ', '}
            </span>
          </span>
        ))}
      </p>
      <p data-revelar className="mt-8 max-w-[44ch]">
        Fertilización sin químicos agresivos, regeneración de suelos y agua, comercio justo con mujeres rurales y
        preservación de los saberes del campo. Consumir CaFETAL es elegir un modelo que devuelve vida al territorio.
      </p>
      </div>
      <div data-revelar="imagen" className="col-span-12 overflow-hidden lg:col-span-5 lg:col-start-8">
        <Image
          src="/img/evento.webp"
          alt="Degustación de CaFETAL en una feria"
          width={1056}
          height={1280}
          quality={80}
          sizes="(min-width: 1024px) 40vw, 92vw"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
    </section>
  )
}
