'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/marca/Logo'
import { Logger } from '@/components/ui/Logger'
import { PRODUCTOS } from '@/lib/productos'
import { enlaceWhatsApp } from '@/lib/sitio'
import { useSonido } from '@/lib/sonido'
import { useCarrito } from '@/lib/carrito'
import { Ancla } from './Ancla'
import { BotonSonido } from './BotonSonido'

interface Tarjeta {
  titulo: string
  a: string
  img: string
}
interface Panel {
  id: string
  nombre: string
  titulo: string
  tarjetas: Tarjeta[]
}

const PANELES: Panel[] = [
  {
    id: 'nosotros',
    nombre: 'Nosotros',
    titulo: 'CaFETAL Group',
    tarjetas: [
      { titulo: 'Quiénes somos', a: '#nosotros', img: '/img/embajadora-taza.webp' },
      { titulo: 'Desde Pitalito', a: '#pitalito', img: '/img/cafetal-pitalito.webp' },
      { titulo: 'Impacto', a: '#impacto', img: '/img/evento.webp' },
    ],
  },
  {
    id: 'cafe',
    nombre: 'El café',
    titulo: 'Cultura de café',
    tarjetas: [
      { titulo: 'El ciclo del café', a: '#ciclo', img: '/video/secado.jpg' },
      { titulo: 'Tu taza', a: '#taza', img: '/img/taza-sachet.webp' },
      { titulo: 'Momentos', a: '#ritual', img: '/img/embajadora-taza.webp' },
    ],
  },
  {
    id: 'productos',
    nombre: 'Productos',
    titulo: 'Cinco cafés',
    tarjetas: PRODUCTOS.map((p) => ({ titulo: p.nombre, a: `/productos/${p.slug}`, img: p.foto })),
  },
]
const DERECHA = [
  { nombre: 'Sabores', a: '/productos' },
  { nombre: 'Impacto', a: '#impacto' },
  { nombre: 'Contacto', a: '#contacto' },
]


export function Barra() {
  const [abierto, setAbierto] = useState<string | null>(null)
  const [hoja, setHoja] = useState(false)
  const [claro, setClaro] = useState(false)
  const cierre = useRef<number | null>(null)
  const ruta = usePathname()
  const { sonar } = useSonido()
  const carrito = useCarrito()

  const abrir = useCallback((id: string) => {
    if (cierre.current) window.clearTimeout(cierre.current)
    setAbierto(id)
  }, [])
  const cerrarLuego = useCallback(() => {
    if (cierre.current) window.clearTimeout(cierre.current)
    cierre.current = window.setTimeout(() => setAbierto(null), 160)
  }, [])
  const cerrar = useCallback(() => {
    setAbierto(null)
    setHoja(false)
  }, [])

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [cerrar])
  useEffect(() => cerrar(), [ruta, cerrar])

  // Las secciones claras (`data-nav="claro"`) vuelven translúcidas las píldoras
  useEffect(() => {
    let pendiente = false
    const leer = () => {
      pendiente = false
      let es = false
      for (const s of document.querySelectorAll<HTMLElement>('[data-nav]')) {
        const r = s.getBoundingClientRect()
        if (r.top <= 44 && r.bottom > 44) es = s.dataset.nav === 'claro'
      }
      setClaro(es)
    }
    const programar = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(leer)
    }
    leer()
    window.addEventListener('scroll', programar, { passive: true })
    return () => window.removeEventListener('scroll', programar)
  }, [ruta])

  const panel = PANELES.find((p) => p.id === abierto)
  const pildora = `flex h-[60px] items-center gap-1 rounded-full px-2.5 transition-colors duration-500 ${claro ? 'bg-cafe/55 text-crema' : 'bg-noche/85 text-durazno'}`

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60]" onMouseLeave={cerrarLuego}>
        <div className="marco flex items-start justify-between pt-4">
          <div className={`grid size-[60px] place-items-center rounded-full ${claro ? 'bg-cafe/55 text-crema' : 'bg-noche/85 text-durazno'}`}>
            <BotonSonido />
          </div>

          <nav aria-label="Principal" className="relative flex items-start">
            <ul className={`${pildora} hidden lg:flex`}>
              {PANELES.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-expanded={abierto === p.id}
                    aria-controls="panel-barra"
                    onMouseEnter={() => abrir(p.id)}
                    onFocus={() => abrir(p.id)}
                    onClick={() => (abierto === p.id ? setAbierto(null) : abrir(p.id))}
                    className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 font-titular text-[1.18rem] font-semibold tracking-[0.05em] uppercase transition-colors ${
                      abierto === p.id ? 'bg-crema/10' : 'hover:bg-crema/5'
                    }`}
                  >
                    {p.nombre}
                    <svg viewBox="0 0 10 6" className={`w-2.5 transition-transform duration-300 ${abierto === p.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {/* La etiqueta colgante: la casa sobre dorado. En teléfono abre la hoja con los paneles */}
            <div className="relative z-10 -mt-4 px-3">
              <Ancla
                a={ruta === '/' ? '#inicio' : '/'}
                className="group hidden h-[104px] w-[92px] flex-col items-center justify-end rounded-b-[22px] bg-dorado pb-3 text-tinta shadow-[0_18px_40px_-18px_rgb(0_0_0/.8)] transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:translate-y-1 lg:flex"
                alIr={cerrar}
              >
                <span className="sr-only">CaFETAL, inicio</span>
                <Logo variante="imagotipo" etiqueta={null} className="w-[66px] transition-transform duration-500 group-hover:-rotate-6" />
              </Ancla>
              <button
                type="button"
                onClick={() => {
                  setHoja((v) => !v)
                  sonar('pop')
                }}
                aria-expanded={hoja}
                aria-controls="panel-barra"
                aria-label={hoja ? 'Cerrar el menú' : 'Abrir el menú'}
                className="flex h-[78px] w-[70px] flex-col items-center justify-end rounded-b-[16px] bg-dorado pb-2.5 text-tinta lg:hidden"
              >
                <Logo variante="imagotipo" etiqueta={null} className="w-[48px]" />
                <span className="mt-0.5 text-[0.62rem] font-semibold tracking-[0.12em] uppercase">{hoja ? 'Cerrar' : 'Menú'}</span>
              </button>
            </div>

            <ul className={`${pildora} hidden lg:flex`}>
              {DERECHA.map((d) => (
                <li key={d.nombre}>
                  <Ancla
                    a={d.a}
                    alIr={cerrar}
                    className="block rounded-full px-5 py-2.5 font-titular text-[1.18rem] font-semibold tracking-[0.05em] uppercase transition-colors hover:bg-crema/5"
                  >
                    {d.nombre}
                  </Ancla>
                </li>
              ))}
            </ul>

            {/* Panel desplegable con tarjetas de foto */}
            <div
              id="panel-barra"
              onMouseEnter={() => abierto && abrir(abierto)}
              className={`absolute top-[72px] left-1/2 w-[min(980px,calc(100vw-2rem))] -translate-x-1/2 transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-suave)] max-lg:top-[86px] ${
                panel || hoja ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
              }`}
            >
              <div className="max-h-[calc(100svh-110px)] overflow-y-auto rounded-[22px] bg-noche/95 p-5 text-durazno shadow-[0_30px_80px_-30px_rgb(0_0_0/.9)] sm:p-6">
                {(hoja ? PANELES : panel ? [panel] : []).map((p) => (
                  <div key={p.id} className="grid gap-5 not-first:mt-8 lg:grid-cols-[0.75fr_2fr]">
                    <p className="titular text-subtitulo">{p.titulo}</p>
                    <ul className={`grid gap-3 ${p.tarjetas.length > 3 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-3'}`}>
                      {p.tarjetas.map((t, i) => (
                        <li
                          key={t.titulo}
                          className="transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-suave)]"
                          style={{
                            transitionDelay: `${panel || hoja ? 60 + i * 55 : 0}ms`,
                            opacity: panel || hoja ? 1 : 0,
                            transform: panel || hoja ? 'none' : 'translateY(10px)',
                          }}
                        >
                          <Ancla a={t.a} alIr={cerrar} className="group block">
                            <span className="relative block aspect-[4/3] overflow-hidden rounded-[14px] bg-tostado">
                              <Image
                                src={t.img}
                                alt=""
                                fill
                                quality={75}
                                sizes="220px"
                                className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-suave)] group-hover:scale-110"
                              />
                            </span>
                            <span className="mt-2 block text-center text-[0.95rem]">
                              {p.id === 'productos' ? <Logger>{t.titulo}</Logger> : t.titulo}
                            </span>
                          </Ancla>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-6 flex items-center justify-between gap-4 text-nota text-suave">
                  <span>Café 100 % colombiano · Pitalito, Huila</span>
                  <a href={enlaceWhatsApp('Hola CaFETAL.')} target="_blank" rel="noreferrer" className="enlace">
                    Escríbenos
                  </a>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-start gap-2">
          <button
            type="button"
            data-carrito
            onClick={carrito.abrir}
            aria-label={`Abrir el pedido, ${carrito.total} cajas`}
            className={`relative grid size-[60px] place-items-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-y-0.5 ${claro ? 'bg-cafe/55 text-crema' : 'bg-noche/85 text-durazno'}`}
          >
            <svg key={carrito.golpe} viewBox="0 0 24 24" className={`w-6 ${carrito.golpe ? 'animate-[rebote_.6s_var(--ease-salto)]' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 9h14l-1.4 10.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8Z" />
              <path d="M9 9V7a3 3 0 0 1 6 0v2" />
            </svg>
            {carrito.total ? (
              <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-dorado font-titular text-[0.85rem] font-bold text-tinta">{carrito.total}</span>
            ) : null}
          </button>
          <a
            href={enlaceWhatsApp('Hola CaFETAL, quiero conocer sus cafés.')}
            target="_blank"
            rel="noreferrer"
            aria-label="Escribir a CaFETAL por WhatsApp"
            className={`grid size-[60px] place-items-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-y-0.5 ${claro ? 'bg-cafe/55 text-crema' : 'bg-noche/85 text-durazno'}`}
          >
            <svg viewBox="0 0 24 24" className="w-5" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
            </svg>
          </a>
          </div>
        </div>
      </header>
    </>
  )
}
