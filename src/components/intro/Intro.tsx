'use client'

import { useRef, useState } from 'react'
import { Logo } from '@/components/marca/Logo'
import { gsap, useGSAP } from '@/lib/gsap'
import { EVENTO_INTRO_FIN } from '@/lib/movimiento'
import { useSonido } from '@/lib/sonido'

const FRASES = ['Calentando el agua', 'Abriendo el sobre', 'Infusionando', '¡Tu taza está lista!']

/** Superficie del café: dos periodos de onda, se desplaza -50 % en bucle. */
const ONDA = 'M0 30C240 0 480 0 720 30S1200 60 1440 30S1920 0 2160 30S2640 60 2880 30V60H0Z'

/*
 * Intro (una vez por sesión): un sachet cuelga de su hilo y se balancea mientras el café sube con el
 * porcentaje. Al llegar a 100 se zambulle, salpica, el café inunda la pantalla con el logo y todo
 * sube para descubrir la página. Temporizador de seguridad: el overlay siempre se retira.
 */
export function Intro() {
  const raiz = useRef<HTMLDivElement>(null)
  const saltar = useRef<(() => void) | null>(null)
  const [frase, setFrase] = useState(FRASES[0])
  const { sonar } = useSonido()
  const sonarRef = useRef(sonar)
  sonarRef.current = sonar

  useGSAP(
    () => {
      const html = document.documentElement
      const nodo = raiz.current
      if (html.dataset.intro !== 'si' || !nodo) return
      nodo.dataset.activa = ''
      let terminado = false
      const terminar = () => {
        if (terminado) return
        terminado = true
        html.dataset.intro = 'no'
        window.dispatchEvent(new Event(EVENTO_INTRO_FIN))
      }
      const retirar = () => {
        delete nodo.dataset.activa
        nodo.style.display = 'none'
      }
      const seguridad = window.setTimeout(() => {
        terminar()
        retirar()
      }, 8000)

      const q = gsap.utils.selector(nodo)
      const contador = { v: 0 }
      const numero = q('[data-numero]')[0]
      gsap.set(q('[data-cafe]'), { yPercent: 88 })
      gsap.set(q('[data-gota]'), { opacity: 0 })

      // El sachet se mece mientras carga (independiente de la línea principal)
      const vaiven = gsap.fromTo(q('[data-pendulo]'), { rotation: -9 }, { rotation: 9, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          window.clearTimeout(seguridad)
          retirar()
        },
      })
      tl.to(q('[data-cargando]'), { opacity: 1, duration: 0.5, stagger: 0.08 }, 0)
        .fromTo(q('[data-sachet]'), { y: -420 }, { y: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)' }, 0)
        .to(
          contador,
          {
            v: 100,
            duration: 2.4,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (numero) numero.textContent = String(Math.round(contador.v))
              setFrase(FRASES[Math.min(FRASES.length - 1, Math.floor((contador.v / 100) * FRASES.length))])
            },
          },
          0.2,
        )
        // el café sube con el porcentaje
        .to(q('[data-cafe]'), { yPercent: 62, duration: 2.4, ease: 'power1.inOut' }, 0.2)
        .addLabel('salida', 2.75)
        // 1. se zambulle
        .call(() => vaiven.kill(), [], 'salida')
        .to(q('[data-pendulo]'), { rotation: 0, duration: 0.15, ease: 'power2.out' }, 'salida')
        .to(q('[data-sachet]'), { y: '34vh', duration: 0.38, ease: 'power3.in' }, 'salida+=0.1')
        // 2. salpica
        .fromTo(
          q('[data-gota]'),
          { opacity: 1, x: 0, y: 0, scale: 1 },
          {
            x: (i) => [-90, -40, 30, 85, -120, 120][i] ?? 0,
            y: (i) => [-140, -200, -190, -130, -60, -70][i] ?? -100,
            scale: 0.4,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out',
          },
          'salida+=0.46',
        )
        .call(() => sonarRef.current('gota'), [], 'salida+=0.4')
        .to(q('[data-cargando]'), { opacity: 0, duration: 0.25 }, 'salida+=0.3')
        // 3. el café inunda la pantalla y aparece la marca
        .to(q('[data-cafe]'), { yPercent: -6, duration: 0.75, ease: 'power3.inOut' }, 'salida+=0.55')
        .fromTo(q('[data-marca]'), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.8)' }, 'salida+=1.05')
        // 4. todo sube y descubre la página
        .call(() => sonarRef.current('bienvenida'), [], 'salida+=1.1')
        .call(terminar, [], 'salida+=1.6')
        .to(nodo, { yPercent: -105, duration: 0.95, ease: 'power3.inOut' }, 'salida+=1.55')

      saltar.current = () => tl.seek('salida+=1.5')
    },
    { scope: raiz },
  )

  return (
    <div ref={raiz} className="intro fixed inset-0 z-[100] overflow-hidden bg-espresso" role="status" aria-label="Cargando CaFETAL">
      {/* El sachet colgando de su hilo; gira desde el punto de arriba */}
      <div data-sachet className="absolute top-0 left-1/2 -translate-x-1/2">
        <div data-pendulo style={{ transformOrigin: '50% 0%' }}>
          <svg viewBox="0 0 160 520" className="h-[min(82svh,760px)] w-auto" aria-hidden="true">
            <path d="M80 0V300" stroke="#e9dcc3" strokeWidth="1.6" />
            <g transform="translate(80 300)">
              <rect x="-58" y="0" width="116" height="140" rx="6" fill="#f3ead9" />
              <rect x="-46" y="14" width="92" height="114" rx="4" fill="#d9c7a8" opacity=".6" />
              <path d="M-46 62q46-14 92 0v62a4 4 0 0 1-4 4h-84a4 4 0 0 1-4-4z" fill="#5a3620" />
              <path d="M-46 78q46-10 92 0" fill="none" stroke="#3d2414" strokeWidth="3" opacity=".5" />
              {/* pespunte del filtro */}
              <rect x="-52" y="6" width="104" height="128" rx="4" fill="none" stroke="#e2d4ba" strokeWidth="1.4" strokeDasharray="3 4" />
            </g>
            {/* etiqueta dorada con la casa, a media altura del hilo */}
            <g transform="translate(80 120) rotate(-6)">
              <rect x="-30" y="0" width="60" height="44" rx="5" fill="var(--color-dorado)" />
              <Logo variante="imagotipo" etiqueta={null} x={-22} y={6} width={44} height={32} className="text-tinta" />
            </g>
          </svg>
        </div>
      </div>

      {/* Salpicaduras */}
      <div className="absolute bottom-[38%] left-1/2" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} data-gota className="absolute block rounded-full bg-cafe" style={{ width: 8 + (i % 3) * 5, height: 8 + (i % 3) * 5 }} />
        ))}
      </div>

      {/* El café: sube con el porcentaje y al final inunda la pantalla */}
      <div data-cafe className="absolute inset-x-0 -top-[60px] bottom-0 text-cafe" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[60px] overflow-hidden">
          <svg viewBox="0 0 2880 60" preserveAspectRatio="none" className="absolute top-0 left-0 h-full w-[200%] animate-[ola_5s_linear_infinite] fill-current">
            <path d={ONDA} />
          </svg>
        </div>
        <div className="absolute inset-x-0 top-[59px] bottom-0 bg-cafe" />
        <div data-marca className="absolute inset-0 grid place-items-center opacity-0">
          <Logo variante="completo" etiqueta={null} className="w-[min(60vw,300px)] text-dorado" />
        </div>
      </div>

      <div className="marco absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div data-cargando>
          <p className="text-frase text-durazno">{frase}…</p>
          <button type="button" onClick={() => saltar.current?.()} className="mt-2 text-nota text-suave transition-colors hover:text-dorado">
            Saltar intro
          </button>
        </div>
        <p data-cargando className="titular text-mega leading-none tabular-nums" aria-live="polite">
          <span data-numero>0</span>
          <span className="menor">%</span>
        </p>
      </div>
    </div>
  )
}
