'use client'

import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/marca/Logo'
import { useScroll } from '@/components/proveedores/ScrollSuave'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { SECCIONES } from '@/lib/sitio'
import { BotonMenu } from './BotonMenu'
import { BotonSonido } from './BotonSonido'
import { MenuCafe } from './MenuCafe'
import { LISTA_TEMAS, TEMAS, type TemaNav } from './temas'

/** Altura de la barra en px (también es la altura inicial del telón del pie). */
const ALTO = 76
/** Línea de lectura: la sección que la cruza decide el color de la barra. */
const LINEA = 40
const ENLACES = SECCIONES.filter((s) => s.id !== 'contacto' && s.id !== 'prepara')

export function Navbar() {
  const [tema, setTema] = useState<TemaNav>('oscuro')
  const [seccion, setSeccion] = useState('inicio')
  const [arriba, setArriba] = useState(true)
  const [telon, setTelon] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { irA } = useScroll()
  const capaTelon = useRef<HTMLDivElement>(null)

  // Lee la sección que hay bajo la barra, como mucho una vez por fotograma
  useEffect(() => {
    let pendiente = false
    const leer = () => {
      pendiente = false
      setArriba(window.scrollY < 24)
      let elegida: HTMLElement | null = null
      for (const s of document.querySelectorAll<HTMLElement>('[data-nav]')) {
        const r = s.getBoundingClientRect()
        if (r.top <= LINEA && r.bottom > LINEA) elegida = s
      }
      if (elegida) {
        setTema((elegida.dataset.nav as TemaNav) ?? 'oscuro')
        setSeccion(elegida.closest<HTMLElement>('[data-seccion]')?.id ?? 'inicio')
      }
    }
    const programar = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(leer)
    }
    leer()
    window.addEventListener('scroll', programar, { passive: true })
    window.addEventListener('resize', programar)
    return () => {
      window.removeEventListener('scroll', programar)
      window.removeEventListener('resize', programar)
    }
  }, [])

  // El telón: la barra crece hacia abajo hasta ser el pie a pantalla completa
  useGSAP(() => {
    const nodo = capaTelon.current
    if (!nodo || prefiereMenosMovimiento()) return
    gsap.set(nodo, { scaleY: 0 })
    const escalaY = gsap.quickSetter(nodo, 'scaleY')
    ScrollTrigger.create({
      trigger: '#pie',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (s) => {
        const alto = window.innerHeight
        escalaY((ALTO + s.progress * (alto - ALTO)) / alto)
        setTelon(s.progress > 0)
      },
      onLeaveBack: () => setTelon(false),
    })
  })

  const temaVisible: TemaNav = menuAbierto ? 'oscuro' : telon ? 'dorado' : tema
  const t = TEMAS[temaVisible]
  const sinFondo = (arriba && !telon) || menuAbierto || telon

  return (
    <>
      <div
        ref={capaTelon}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-svh origin-top bg-dorado"
        // Sin `transform` aquí: React lo reescribiría y le quitaría el control a GSAP (Gotchas)
        style={{ visibility: telon ? 'visible' : 'hidden' }}
      />

      <header className="fixed inset-x-0 top-0 z-[60] transition-[color] duration-500" style={{ color: t.tinta }}>
        {/* Fondos apilados: se cruzan por opacidad */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 transition-opacity duration-500" style={{ opacity: sinFondo ? 0 : 1 }}>
          {LISTA_TEMAS.map((k) => (
            <div
              key={k}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ background: TEMAS[k].fondo, opacity: k === tema ? 1 : 0 }}
            />
          ))}
        </div>

        <nav aria-label="Principal" className="marco flex items-center justify-between gap-6" style={{ height: ALTO }}>
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault()
              setMenuAbierto(false)
              irA(0)
            }}
            aria-label="CaFETAL, volver al inicio"
            className="group block shrink-0 transition-[color] duration-500"
            style={{ color: t.logo }}
          >
            <Logo
              variante="logo"
              etiqueta={null}
              className="h-[50px] w-auto transition-transform duration-500 [transition-timing-function:var(--ease-salto)] group-hover:-rotate-3"
            />
          </a>

          <ul className={`hidden items-center gap-8 transition-opacity duration-300 lg:flex ${menuAbierto ? 'pointer-events-none opacity-0' : ''}`}>
            {ENLACES.map((s) => {
              const activo = seccion === s.id
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      irA(`#${s.id}`)
                    }}
                    aria-current={activo ? 'true' : undefined}
                    className="relative block py-2 text-cuerpo"
                  >
                    {s.nombre}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-current transition-transform duration-500 [transition-timing-function:var(--ease-cafe)] ${
                        activo ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-1">
            <BotonSonido />
            <BotonMenu abierto={menuAbierto} alPulsar={() => setMenuAbierto((v) => !v)} claro={t.claro} />
          </div>
        </nav>
      </header>

      <MenuCafe abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} seccionActual={seccion} />
    </>
  )
}
