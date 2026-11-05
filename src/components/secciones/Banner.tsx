'use client'

import { useEffect, useRef, useState } from 'react'
import { Pildora } from '@/components/ui/Pildora'
import { VideoFondo } from '@/components/ui/VideoFondo'
import { gsap, useGSAP } from '@/lib/gsap'
import { alTerminarIntro, prefiereMenosMovimiento } from '@/lib/movimiento'

const CAPITULOS = [
  { video: 'tostion', titulo: 'Tostado en Pitalito' },
  { video: 'cosecha', titulo: 'Del cafetal a tu taza' },
  { video: 'vertido', titulo: 'Sin cafetera, en tres minutos' },
] as const
const DURACION = 8

/*
 * Portada: el video llena la pantalla, algo oscurecido, y las letras de "CAFÉ DE ORIGEN" son una
 * ventana al mismo video a plena luz (capa gris con letras blancas en mix-blend-mode: multiply:
 * fuera de las letras el video queda al ~45 %, dentro al 100 %). Al bajar, "CAFÉ DE" sube y se
 * desvanece y la cámara entra por la O de ORIGEN mientras el video se acerca.
 */
export function Portada() {
  const raiz = useRef<HTMLElement>(null)
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (prefiereMenosMovimiento()) return
    const id = window.setTimeout(() => setActual((n) => (n + 1) % CAPITULOS.length), DURACION * 1000)
    return () => window.clearTimeout(id)
  }, [actual])

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      // Si la página carga ya desplazada (un ancla, volver atrás) no hay entrada: todo en su sitio
      const arriba = window.scrollY < 10
      if (arriba) {
        gsap.set(q('[data-entra]'), { opacity: 0, y: 30 })
        gsap.set(q('[data-linea]'), { yPercent: 110 })
      }
      const quitar = alTerminarIntro(() => {
        if (!arriba) return
        gsap.to(q('[data-linea]'), { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.14 })
        gsap.to(q('[data-entra]'), { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.5 })
      })
      const o = q('[data-o]')[0]
      const letras = q('[data-letras]')[0]
      // Centro de la O dentro de las letras con offsetLeft/offsetTop: ignoran las transformaciones,
      // así el punto del zoom es correcto aunque la página cargue a mitad del zoom o de la entrada
      const origen = () => {
        if (!o || !letras) return '50% 50%'
        let x = o.offsetWidth / 2
        let y = o.offsetHeight * 0.52
        let n: HTMLElement | null = o as HTMLElement
        while (n && n !== letras) {
          x += n.offsetLeft
          y += n.offsetTop
          n = n.offsetParent as HTMLElement | null
        }
        if (n !== letras) {
          // offsetParent saltó por encima de `letras`: se descuenta su propia posición
          x -= (letras as HTMLElement).offsetLeft
          y -= (letras as HTMLElement).offsetTop
        }
        return `${x}px ${y}px`
      }
      gsap
        .timeline({ scrollTrigger: { trigger: raiz.current, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true } })
        .to(q('[data-entra]'), { opacity: 0, y: -30, duration: 0.12, ease: 'none' }, 0)
        .to(q('[data-arriba]'), { yPercent: -160, opacity: 0, ease: 'power1.in', duration: 0.45 }, 0)
        .fromTo(letras, { scale: 1, transformOrigin: origen }, { scale: 38, ease: 'power3.in', duration: 1, transformOrigin: origen }, 0.05)
        .fromTo(q('[data-video]'), { scale: 1.12 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .to(q('[data-capa]'), { opacity: 0, duration: 0.12, ease: 'none' }, 0.88)
      const lx = gsap.quickTo(q('[data-deriva]')[0] ?? {}, 'x', { duration: 1.2, ease: 'power3.out' })
      const ly = gsap.quickTo(q('[data-deriva]')[0] ?? {}, 'y', { duration: 1.2, ease: 'power3.out' })
      const vx = gsap.quickTo(q('[data-video]')[0] ?? {}, 'x', { duration: 1.4, ease: 'power3.out' })
      const alMover = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        lx(nx * 18)
        ly(ny * 12)
        vx(-nx * 30)
      }
      const nodo = raiz.current
      nodo?.addEventListener('pointermove', alMover)
      return () => {
        quitar()
        nodo?.removeEventListener('pointermove', alMover)
      }
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="inicio" data-nav="oscuro" className="relative h-svh bg-noche [html.mov_&]:h-[230svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div data-video className="absolute -inset-[4%]">
          {CAPITULOS.map((c, i) => (
            <div key={c.video} className="absolute inset-0 transition-opacity duration-[1200ms]" style={{ opacity: i === actual ? 1 : 0 }}>
              <VideoFondo nombre={c.video} activo={i === actual} filtro="saturate(1.05) contrast(1.04)" />
            </div>
          ))}
        </div>

        {/* Gris en multiply: oscurece el video fuera de las letras; las letras blancas lo dejan a plena luz */}
        <div data-capa className="absolute inset-0 grid place-items-center bg-[#6f6259] mix-blend-multiply">
          <div data-letras className="relative will-change-transform">
            <h1 data-deriva className="titular text-center text-[clamp(5rem,19vw,22rem)] leading-[0.8] text-white">
              <span data-arriba className="block overflow-hidden pb-[0.04em]">
                <span data-linea className="block">
                  Café <span className="menor text-white">de</span>
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-linea className="block">
                  <span data-o className="inline-block">
                    O
                  </span>
                  rigen
                </span>
              </span>
            </h1>
          </div>
        </div>
        {/* Viñeta sutil para que los textos pequeños se lean sobre el video */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(19_12_8/.55),transparent_22%,transparent_72%,rgb(19_12_8/.7))]" />

        <div className="marco absolute inset-x-0 top-[clamp(150px,19vh,190px)] z-10 flex justify-center">
          <p data-entra className="font-display text-frase text-durazno italic">
            CaFETAL · Pitalito, Huila
          </p>
        </div>

        <div className="marco absolute inset-x-0 bottom-0 z-10 grid items-end gap-6 pb-6 md:grid-cols-[1fr_auto_1fr]">
          <ol data-entra className="hidden gap-4 md:flex">
            {CAPITULOS.map((c, i) => (
              <li key={c.video} className="w-[150px]">
                <button type="button" onClick={() => setActual(i)} className="group w-full text-left" aria-current={i === actual ? 'true' : undefined}>
                  <span className="block h-[2px] overflow-hidden bg-crema/20">
                    <span
                      key={i === actual ? `on-${actual}` : 'off'}
                      className="block h-full origin-left bg-durazno"
                      style={i === actual ? { animation: `llenar ${DURACION}s linear both` } : { transform: 'scaleX(0)' }}
                    />
                  </span>
                  <span className={`mt-2 block text-nota leading-snug transition-colors ${i === actual ? 'text-durazno' : 'text-crema/55 group-hover:text-crema'}`}>{c.titulo}</span>
                </button>
              </li>
            ))}
          </ol>
          <div data-entra className="text-center">
            <p className="mx-auto mb-4 max-w-[40ch] text-cuerpo text-crema/90">Café 100 % colombiano, tostado y molido, que se prepara como una infusión.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Pildora a="#taza" tono="llena">
                Arma tu taza
              </Pildora>
              <Pildora a="/productos">Ver los sabores</Pildora>
            </div>
          </div>
          <p data-entra className="hidden text-right text-nota text-crema/70 md:block">
            Baja y entra al café ↓
          </p>
        </div>
      </div>
    </section>
  )
}
