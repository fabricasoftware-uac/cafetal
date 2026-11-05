'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Ancla } from '@/components/navegacion/Ancla'
import { BotonAgregar } from '@/components/carrito/PanelCarrito'
import { Taza3D } from '@/components/tres/Taza3D'
import { Logger } from '@/components/ui/Logger'
import { explosion } from '@/lib/explosion'
import { LIQUIDOS, type Liquido, reloj, SABORES_INFUSION, type SaborInfusion, segundosDe, useInfusion } from '@/lib/infusion'
import { PRODUCTOS } from '@/lib/productos'
import { useSonido } from '@/lib/sonido'

const COLOR_LIQUIDO: Record<Liquido, string> = {
  'agua caliente': '#2a1309',
  'leche caliente': '#8a5a34',
  'un licor': '#3a160b',
}
const SLUG: Record<SaborInfusion, string> = { Tradicional: 'tradicional', Anís: 'anis', Campesino: 'campesino', Cardamomo: 'cardamomo', Jengibre: 'jengibre' }

function centro(el: Element | null): [number, number] {
  const r = el?.getBoundingClientRect()
  return r ? [r.left + r.width / 2, r.top + r.height / 2] : [window.innerWidth / 2, window.innerHeight / 2]
}

/*
 * Arma tu taza: un juego. Elegir el sabor tiñe la sección con el color de su caja, hace caer su
 * nombre gigante, trae la caja al lado de la taza y lanza sus ingredientes por los aires.
 * Infusionar salpica; la taza lista llueve granos. La cuenta sigue aunque el visitante baje.
 */
export function TuTaza() {
  const inf = useInfusion()
  const { sonar } = useSonido()
  const caja = useRef<HTMLDivElement>(null)
  const taza = useRef<HTMLDivElement>(null)
  const p = PRODUCTOS.find((x) => x.slug === SLUG[inf.sabor]) ?? PRODUCTOS[0]
  const total = segundosDe(inf.liquido)
  const enCurso = inf.restante !== null && inf.restante > 0
  const lista = inf.restante === 0
  const avance = inf.restante === null ? 1 : 1 - inf.restante / total
  const [, setVuelta] = useState(0)

  const elegirSabor = (s: SaborInfusion) => {
    if (s === inf.sabor) return
    sonar('eleccion')
    inf.elegir({ sabor: s })
    setVuelta((v) => v + 1)
    const prod = PRODUCTOS.find((x) => x.slug === SLUG[s])
    // Deja que la caja nueva se pinte y explota desde ella
    requestAnimationFrame(() => {
      const [x, y] = centro(caja.current)
      explosion(x, y, { cantidad: 30, imagenes: prod?.particulas ?? [], fuerza: 0.85, abanico: 200 })
    })
  }

  // La taza lista: lluvia de granos desde arriba
  const avisada = useRef(false)
  useEffect(() => {
    if (lista && !avisada.current) {
      avisada.current = true
      const [x] = centro(taza.current)
      explosion(x, 90, { cantidad: 40, hacia: 90, abanico: 120, fuerza: 0.6, imagenes: p.particulas, onda: false })
    }
    if (!lista) avisada.current = false
  }, [lista, p.particulas])

  return (
    <section
      id="taza"
      data-nav="oscuro"
      className="relative overflow-hidden py-[clamp(6rem,9vw,8rem)] transition-[background-color] duration-700"
      style={{ backgroundColor: `color-mix(in srgb, ${p.tarjeta} 42%, #130c08)` }}
    >
      <span id="prepara" className="absolute top-0" aria-hidden="true" />

      {/* Nombre gigante del sabor: cae letra a letra al cambiar */}
      <p key={p.slug} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[clamp(4rem,7vw,6rem)] flex justify-center text-[clamp(5rem,20vw,21rem)] leading-[0.8] text-white/[0.07] select-none">
        {[...p.nombre.toLocaleUpperCase('es')].map((c, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: letras en orden fijo
          <span key={i} className="inline-block animate-[caer_.9s_var(--ease-salto)_both]" style={{ animationDelay: `${i * 45}ms` }}>
            <Logger>{c}</Logger>
          </span>
        ))}
      </p>

      <div className="marco relative grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,1.25fr)_1fr]">
        {/* 1 · El café */}
        <div className="order-2 lg:order-1">
          <h2 className="titular text-subtitulo">
            Arma <span className="menor">tu</span> taza
          </h2>
          <p className="mt-6 text-nota text-durazno/80">1 · Elige tu café</p>
          <ul className="mt-3 grid gap-2">
            {SABORES_INFUSION.map((s) => {
              const prod = PRODUCTOS.find((x) => x.slug === SLUG[s])
              const activo = inf.sabor === s
              return (
                <li key={s}>
                  <button
                    type="button"
                    disabled={enCurso}
                    aria-pressed={activo}
                    onClick={() => elegirSabor(s)}
                    className={`group flex w-full items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 text-left transition-[background-color,transform] duration-500 [transition-timing-function:var(--ease-salto)] hover:translate-x-1.5 disabled:opacity-50 ${
                      activo ? 'bg-durazno text-espresso' : 'bg-noche/50 text-crema hover:bg-noche/80'
                    }`}
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20" style={{ background: prod?.tarjeta }}>
                      <Image src={prod?.recorte ?? prod?.foto ?? ''} alt="" fill sizes="44px" className={prod?.recorte ? 'scale-125 object-contain' : 'object-cover'} />
                    </span>
                    <span className="min-w-0">
                      <Logger className="block text-[1.15rem] leading-none">{s}</Logger>
                      <span className={`block truncate text-[0.8rem] ${activo ? 'text-espresso/70' : 'text-crema/55'}`}>{prod?.corto}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="mt-7 text-nota text-durazno/80">2 · ¿Qué le viertes?</p>
          <div className="mt-3 flex gap-3">
            {LIQUIDOS.map((l) => {
              const activo = inf.liquido === l
              return (
                <button
                  key={l}
                  type="button"
                  disabled={enCurso}
                  aria-pressed={activo}
                  aria-label={l}
                  onClick={() => {
                    sonar('liquido')
                    inf.elegir({ liquido: l })
                  }}
                  className={`group grid size-[78px] place-items-center rounded-full transition-[background-color,transform] duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-y-1 hover:rotate-6 active:scale-90 disabled:opacity-50 ${
                    activo ? 'bg-durazno text-espresso' : 'bg-noche/50 text-crema hover:bg-noche/80'
                  }`}
                >
                  <IconoLiquido liquido={l} />
                  <span className="-mt-2 text-[0.7rem] capitalize">{l.replace(' caliente', '').replace('un ', '')}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* La taza */}
        <div ref={taza} className="relative order-1 mx-auto aspect-square w-full max-w-[680px] lg:order-2">
          <Taza3D avance={avance} colorFinal={COLOR_LIQUIDO[inf.liquido]} dentro={inf.restante !== null} />
        </div>

        {/* 3 · La caja y la cuenta */}
        <div className="order-3 text-center lg:text-right">
          <div ref={caja} key={p.slug} className="relative mx-auto aspect-[4/3] w-[min(100%,340px)] animate-[llegar_.9s_var(--ease-salto)_both] lg:mr-0">
            {p.recorte ? (
              <Image src={p.recorte} alt={p.alt} fill sizes="340px" className="object-contain drop-shadow-[0_24px_24px_rgb(0_0_0/.5)]" />
            ) : (
              <Image src={p.foto} alt={p.alt} fill sizes="340px" className="rounded-[18px] object-cover" />
            )}
          </div>
          <Ancla a={`/productos/${p.slug}`} className="group mt-4 inline-flex items-center gap-2">
            <Logger className="text-[1.6rem] leading-none text-durazno">{p.nombre}</Logger>
            <span className="text-durazno transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Ancla>
          <div className="mt-3 flex justify-center lg:justify-end">
            <BotonAgregar slug={p.slug} tono="linea" />
          </div>
          <p className="titular mt-6 text-titulo tabular-nums" aria-live="polite">
            {enCurso ? reloj(inf.restante ?? 0) : lista ? '¡Lista!' : reloj(total)}
          </p>
          <p className="mt-2 text-cuerpo text-crema/80">
            {enCurso ? `${inf.sabor} con ${inf.liquido}` : lista ? `Tu ${inf.sabor.toLowerCase()} está servido.` : '3 · Ponla a infusionar'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
            {enCurso ? (
              <>
                <button type="button" onClick={inf.reiniciar} className="enlace text-cuerpo">
                  Cancelar
                </button>
                <button type="button" onClick={inf.terminarYa} className="pildora">
                  <span>Ya está bien así</span>
                  <span aria-hidden="true">→</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sonar('vertido')
                  if (lista) inf.reiniciar()
                  inf.iniciar()
                  const [x, y] = centro(taza.current)
                  explosion(x, y - 60, { cantidad: 26, fuerza: 0.7, abanico: 120 })
                }}
                className="pildora"
              >
                <span>{lista ? 'Preparar otra' : 'Prepárala'}</span>
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function IconoLiquido({ liquido }: { liquido: Liquido }) {
  const base = { viewBox: '0 0 32 32', className: 'w-7', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  if (liquido === 'agua caliente')
    return (
      <svg {...base}>
        <path d="M16 4c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15Z" />
        <path d="M12 20a4 4 0 0 0 4 4" />
      </svg>
    )
  if (liquido === 'leche caliente')
    return (
      <svg {...base}>
        <path d="M11 4h10l-1 5 3 4v14a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V13l3-4Z" />
        <path d="M9 17c3-2 5 2 7 0s5-2 7 0" />
      </svg>
    )
  return (
    <svg {...base}>
      <path d="M9 4h14c0 7-3 11-7 11S9 11 9 4Z" />
      <path d="M16 15v11M11 28h10" />
    </svg>
  )
}
