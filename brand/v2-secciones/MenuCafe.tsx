'use client'

import { useEffect, useRef } from 'react'
import { Logo } from '@/components/marca/Logo'
import { useScroll } from '@/components/proveedores/ScrollSuave'
import { Vapor } from '@/components/ui/Cafe'
import { gsap, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { CONTACTO, enlaceWhatsApp, SECCIONES } from '@/lib/sitio'
import { useSonido } from '@/lib/sonido'

interface Props {
  abierto: boolean
  alCerrar: () => void
  seccionActual: string
}

/** Superficie de líquido con onda en el borde superior. La onda mide 2 periodos y se desplaza -50 % en bucle. */
const ONDA = 'M0 30C240 0 480 0 720 30S1200 60 1440 30S1920 0 2160 30S2640 60 2880 30V60H0Z'

/*
 * Menú a pantalla completa: la taza se llena. Primero sube la crema (dorada) y detrás el espresso,
 * cada uno con su onda en movimiento; luego los enlaces emergen del líquido. Al cerrar, se vacía.
 */
export function MenuCafe({ abierto, alCerrar, seccionActual }: Props) {
  const raiz = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const { irA, detener, reanudar } = useScroll()
  const destino = useRef<string | null>(null)
  const { sonar } = useSonido()

  useGSAP(
    () => {
      const nodo = raiz.current
      if (!nodo) return
      const q = gsap.utils.selector(nodo)
      tl.current = gsap
        .timeline({
          paused: true,
          defaults: { ease: 'power3.inOut' },
          onStart: () => {
            nodo.style.display = 'block'
          },
          onReverseComplete: () => {
            nodo.style.display = 'none'
            if (destino.current) {
              irA(destino.current)
              destino.current = null
            }
          },
        })
        .fromTo(q('[data-capa="crema"]'), { yPercent: 102 }, { yPercent: 0, duration: 0.8 }, 0)
        .fromTo(q('[data-capa="espresso"]'), { yPercent: 104 }, { yPercent: 0, duration: 0.85 }, 0.1)
        .fromTo(
          q('[data-enlace]'),
          { yPercent: 115, rotation: 4 },
          { yPercent: 0, rotation: 0, duration: 0.8, ease: 'power4.out', stagger: 0.055 },
          0.5,
        )
        .fromTo(
          q('[data-aparte]'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
          0.65,
        )
        .fromTo(q('[data-taza]'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.6)' }, 0.6)
        // el sachet se hunde y sube suave, como cuando se infusiona
        .fromTo(q('[data-sachet]'), { y: -70 }, { y: 0, duration: 1, ease: 'elastic.out(1, 0.6)' }, 0.85)
    },
    { scope: raiz },
  )

  useEffect(() => {
    const linea = tl.current
    if (!linea) return
    const nodo = raiz.current
    if (abierto) {
      detener()
      sonar('menu')
      if (prefiereMenosMovimiento()) linea.progress(1)
      else linea.timeScale(1).play()
      // El foco entra al menú con el primer enlace
      window.setTimeout(() => nodo?.querySelector<HTMLAnchorElement>('[data-foco]')?.focus(), 350)
      const alTeclear = (e: KeyboardEvent) => {
        if (e.key === 'Escape') alCerrar()
      }
      window.addEventListener('keydown', alTeclear)
      return () => window.removeEventListener('keydown', alTeclear)
    }
    if (linea.progress() > 0) {
      reanudar()
      if (prefiereMenosMovimiento()) {
        linea.progress(0)
        if (nodo) nodo.style.display = 'none'
        if (destino.current) {
          irA(destino.current)
          destino.current = null
        }
      } else linea.timeScale(1.7).reverse()
    }
  }, [abierto, alCerrar, detener, reanudar, irA, sonar])

  const ir = (id: string) => {
    destino.current = `#${id}`
    alCerrar()
  }

  return (
    <div
      ref={raiz}
      id="menu-cafe"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      inert={!abierto}
      className="fixed inset-0 z-[55] overflow-hidden"
      style={{ display: 'none' }}
    >
      {/* Líquido */}
      <Capa nombre="crema" color="#c08a4a" desfase="-0.6s" />
      <Capa nombre="espresso" color="var(--color-espresso)" desfase="-2.2s" />


      <div className="contenedor relative grid h-full grid-rows-[1fr_auto] pt-[96px] pb-[max(1.4rem,env(safe-area-inset-bottom))] text-crema lg:grid-cols-[1.35fr_1fr] lg:grid-rows-1 lg:gap-12">
        <nav aria-label="Secciones" className="flex flex-col justify-center overflow-y-auto">
          <ol className="flex flex-col">
            {SECCIONES.map((s, i) => {
              const actual = seccionActual === s.id
              return (
                <li key={s.id} className="overflow-hidden py-[0.12em]">
                  <a
                    href={`#${s.id}`}
                    data-enlace
                    data-foco={i === 0 ? '' : undefined}
                    aria-current={actual ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      ir(s.id)
                    }}
                    className="group flex items-baseline gap-4 sm:gap-6"
                  >
                    <span className="relative text-[clamp(2.4rem,5.4vw,5.2rem)] leading-[1.04] whitespace-nowrap transition-[color,transform] duration-500 [transition-timing-function:var(--ease-salto)] group-hover:translate-x-3 group-hover:text-dorado">
                      <span className={actual ? 'text-dorado' : ''}>{s.nombre}</span>
                    </span>
                    <span className="hidden text-nota text-suave transition-colors group-hover:text-crema md:inline">
                      {s.nota}
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>

        <aside className="flex flex-col justify-end gap-8 lg:justify-center">
          <div data-taza className="relative mx-auto hidden w-[min(100%,300px)] lg:block">
            <TazaConSachet />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div data-aparte>
              <p className="mb-1 text-nota text-suave">Escríbenos</p>
              <a
                href={enlaceWhatsApp('Hola CaFETAL, quiero conocer sus cafés.')}
                target="_blank"
                rel="noreferrer"
                className="enlace text-cuerpo"
              >
                WhatsApp {CONTACTO.telefonoVisible}
              </a>
            </div>
            <div data-aparte>
              <p className="mb-1 text-nota text-suave">Origen</p>
              <p className="text-cuerpo">{CONTACTO.ciudad}</p>
            </div>
          </div>
          <p data-aparte className="hidden text-frase text-suave sm:block">
            De la tradición a la innovación.
          </p>
        </aside>
      </div>
    </div>
  )
}

function Capa({ nombre, color, desfase }: { nombre: string; color: string; desfase: string }) {
  return (
    <div data-capa={nombre} className="absolute inset-x-0 -top-[60px] bottom-0" style={{ color }}>
      <div className="absolute inset-x-0 top-0 h-[60px] overflow-hidden">
        <svg
          viewBox="0 0 2880 60"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-[200%] fill-current motion-safe:animate-[ola_7s_linear_infinite]"
          style={{ animationDelay: desfase }}
        >
          <path d={ONDA} />
        </svg>
      </div>
      <div className="absolute inset-x-0 top-[59px] bottom-0 bg-current" />
    </div>
  )
}

/** Taza vista de lado con el sachet colgando de su hilo y la etiqueta con la casa. */
function TazaConSachet() {
  return (
    <div className="relative aspect-[4/4.2]">
      <Vapor className="absolute top-[2%] left-[30%] w-[34%] text-crema/40" />
      <svg viewBox="0 0 300 315" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g data-sachet>
          <path d="M150 0V150" stroke="#e9dcc3" strokeWidth="1.4" />
          <rect x="112" y="118" width="76" height="90" rx="5" fill="#e9dcc3" />
          <rect x="120" y="126" width="60" height="74" rx="3" fill="#6b4024" />
          <path d="M120 170q30-10 60 0v30h-60z" fill="#3a2418" />
        </g>
        <path d="M60 165h180l-14 102q-4 30-34 30H108q-30 0-34-30z" fill="var(--color-tinta)" />
        <ellipse cx="150" cy="165" rx="90" ry="15" fill="#2a1a10" />
        <ellipse cx="150" cy="167" rx="80" ry="10" fill="#4a2c18" />
        <path d="M240 190q46 4 34 42t-56 34" fill="none" stroke="var(--color-tinta)" strokeWidth="14" />
        <ellipse cx="150" cy="303" rx="120" ry="12" fill="var(--color-tinta)" opacity=".7" />
        <path d="M222 168l14 4" stroke="#e9dcc3" strokeWidth="1.4" />
      </svg>
      <div className="absolute top-[63%] left-1/2 w-[26%] -translate-x-1/2 text-dorado">
        <Logo variante="imagotipo" etiqueta={null} className="w-full" />
      </div>
      {/* etiqueta del sachet colgando por fuera */}
      <div className="absolute top-[52%] left-[78%] grid w-[13%] place-items-center rounded-[3px] bg-tinta p-[3px] text-dorado">
        <Logo variante="imagotipo" etiqueta={null} className="w-full" />
      </div>
    </div>
  )
}
