'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { Pildora } from '@/components/ui/Pildora'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { prefiereMenosMovimiento } from '@/lib/movimiento'
import { enlaceWhatsApp } from '@/lib/sitio'

// Eslabones del ecosistema regenerativo (brochure 2026). `foto` opcional: fotos reales del cliente
const ESLABONES = [
  { titulo: 'AiCAFÉ', texto: 'Bioinsumos y fertilizantes limpios: el suelo se nutre sin químicos agresivos.' },
  { titulo: 'Suelos vivos', texto: 'Regeneramos la tierra y cuidamos el agua de las laderas de Pitalito.', foto: '/img/planta.webp' },
  { titulo: 'Trazabilidad', texto: 'Sabemos de qué mata viene cada grano, del cultivo a la taza.' },
  { titulo: 'Mujeres Sembrando Vida', texto: 'Nuestra fundación impulsa el liderazgo y el comercio justo con mujeres rurales.', foto: '/img/evento.webp' },
  { titulo: 'Empaque eficiente', texto: 'Sachets que reducen residuos y desperdicio de café.' },
  { titulo: 'Mirador del CaFETAL', texto: 'Agroturismo para conocer la finca y los saberes que se heredan.' },
] as const

/** Tallo y hojas en coordenadas 400 × 1600. Cada hoja corresponde a un eslabón. */
const TALLO = 'M200 1600C196 1420 214 1300 196 1160S180 900 204 760S214 520 196 380S194 160 200 40'
const HOJAS = ESLABONES.map((_, i) => ({ y: 1380 - i * 230, lado: i % 2 ? -1 : 1 }))

/*
 * Una mata de café que crece con el scroll: el tallo se descubre de abajo arriba, en cada nudo brota
 * una hoja y su eslabón entra desde ese lado; las cerezas pasan de verde a rojo al final.
 * Solo transform, opacity y clip-path, sin fijar la sección.
 */
export function Impacto() {
  const raiz = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefiereMenosMovimiento()) return
      const q = gsap.utils.selector(raiz)
      const mata = q('[data-mata]')[0]
      // El tallo se dibuja (DrawSVG) de abajo arriba y una luciérnaga dorada lo recorre (MotionPath)
      const tramo = { trigger: mata, start: 'top 75%', end: 'bottom 60%', scrub: 0.6 }
      gsap.fromTo(q('[data-trazo]'), { drawSVG: '100% 100%' }, { drawSVG: '0% 100%', ease: 'none', scrollTrigger: tramo })
      gsap.fromTo(q('[data-ramas] path'), { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', stagger: 0.15, scrollTrigger: tramo })
      gsap.to(q('[data-luciernaga]'), {
        motionPath: { path: q('[data-trazo]')[0] as unknown as SVGPathElement, start: 1, end: 0 },
        ease: 'none',
        scrollTrigger: tramo,
      })
      // Título letra a letra
      const titulo = q('[data-titulo]')[0]
      let partes: SplitText | null = null
      if (titulo) {
        partes = SplitText.create(titulo, { type: 'words,chars' })
        gsap.fromTo(partes.chars, { yPercent: 60, rotation: 8, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.025, scrollTrigger: { trigger: titulo, start: 'top 80%' } })
      }
      // Parallax en tres capas
      for (const capa of q('[data-capa-parallax]')) {
        const v = Number(capa.getAttribute('data-capa-parallax'))
        gsap.fromTo(capa, { yPercent: -v }, { yPercent: v, ease: 'none', scrollTrigger: { trigger: raiz.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      for (const img of q('[data-foto-parallax]')) {
        gsap.fromTo(img, { yPercent: -10, scale: 1.2 }, { yPercent: 10, scale: 1.2, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } })
      }
      for (const h of q('[data-hoja]')) {
        gsap.fromTo(h, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: h, start: 'top 70%' } })
      }
      for (const e of q('[data-eslabon]')) {
        const lado = Number(e.getAttribute('data-lado'))
        gsap.fromTo(
          e,
          { opacity: 0, x: 90 * lado, rotationY: -35 * lado, transformPerspective: 900 },
          { opacity: 1, x: 0, rotationY: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: e, start: 'top 75%' } },
        )
      }
      gsap.fromTo(
        q('[data-cereza]'),
        { scale: 0 },
        { scale: 1, duration: 0.7, ease: 'back.out(2.4)', stagger: 0.06, scrollTrigger: { trigger: q('[data-copa]')[0], start: 'top 70%' } },
      )
      gsap.to(q('[data-madura]'), { opacity: 1, duration: 1.4, stagger: 0.08, scrollTrigger: { trigger: q('[data-copa]')[0], start: 'top 45%' } })
      // La mata se mece apenas, como con viento
      gsap.to(q('[data-viento]'), { rotation: 1.2, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 100%' })
      return () => partes?.revert()
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} id="impacto" data-nav="oscuro" className="relative overflow-hidden bg-musgo pt-[clamp(6rem,9vw,8rem)] pb-[clamp(5rem,8vw,7rem)]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_8%,rgb(225_183_93/.18),transparent_70%)]" />
      <div className="marco relative mx-auto max-w-[900px] text-center">
        <p className="text-nota tracking-[0.18em] text-dorado uppercase">Ecosistema regenerativo</p>
        <h2 data-titulo className="titular mt-4 text-titulo">
          Impacto positivo
          <br />
          <span className="menor">del</span> origen <span className="menor">a la</span> taza
        </h2>
        <p className="mx-auto mt-6 max-w-[46ch] text-frase text-crema/85">Cada taza hace crecer algo. Baja y mira cómo.</p>
      </div>

      <Hojas />
      <div data-mata className="relative mx-auto mt-14 max-w-[1200px] px-[clamp(1rem,2.2vw,2.25rem)]">
        <div data-viento className="pointer-events-none absolute inset-y-0 left-1/2 w-[min(46vw,400px)] -translate-x-1/2" aria-hidden="true">
          <svg viewBox="0 0 400 1600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path data-trazo d={TALLO} fill="none" stroke="#5c7a45" strokeWidth="10" strokeLinecap="round" />
            <g data-ramas>
              {HOJAS.map((h) => (
                <path
                  key={h.y}
                  d={`M200 ${h.y}q${60 * h.lado}-40 ${120 * h.lado}-20`}
                  fill="none"
                  stroke="#5c7a45"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              ))}
            </g>
            <g data-luciernaga>
              <circle r="26" fill="var(--color-dorado)" opacity=".18" />
              <circle r="9" fill="var(--color-dorado-claro)" />
            </g>
          </svg>
          {HOJAS.map((h) => (
            <span
              key={h.y}
              data-hoja
              className="absolute block w-[22%]"
              style={{ top: `${((h.y - 60) / 1600) * 100}%`, left: h.lado === 1 ? '76%' : '2%', transformOrigin: h.lado === 1 ? '0% 100%' : '100% 100%' }}
            >
              <svg viewBox="0 0 80 50" className="w-full" style={{ transform: h.lado === -1 ? 'scaleX(-1)' : undefined }}>
                <path d="M2 40C20 4 64 0 78 10C66 38 30 52 2 40Z" fill="#3f6b3a" />
                <path d="M4 39C30 28 52 18 74 12" fill="none" stroke="#9cc27a" strokeWidth="2" />
              </svg>
            </span>
          ))}
          {/* copa con cerezas que maduran */}
          <div data-copa className="absolute top-0 left-1/2 w-[70%] -translate-x-1/2">
            {[
              [42, 6],
              [56, 2],
              [50, 14],
              [36, 16],
              [62, 12],
              [46, 24],
            ].map(([x, y]) => (
              <span key={`${x}-${y}`} data-cereza className="absolute block size-[clamp(18px,2.2vw,26px)] rounded-full bg-[#7fa84f]" style={{ left: `${x}%`, top: `${y * 4}px` }}>
                <span data-madura className="absolute inset-0 rounded-full bg-[#c0262d] opacity-0" />
              </span>
            ))}
          </div>
        </div>

        <ol className="relative grid gap-[clamp(3rem,9vw,7rem)] pt-[8%] pb-[4%]">
          {ESLABONES.map((e, i) => {
            const lado = i % 2 ? -1 : 1
            return (
              <li key={e.titulo} className={`flex ${lado === 1 ? 'justify-end' : 'justify-start'}`}>
                <article data-eslabon data-lado={lado} className={`w-[min(100%,380px)] rounded-[22px] bg-crema/[0.06] p-6 ring-1 ring-brote/15 ${lado === 1 ? 'md:mr-[4%]' : 'md:ml-[4%]'}`}>
                  {'foto' in e && e.foto ? (
                    <div className="mb-4 overflow-hidden rounded-[14px]">
                      <Image data-foto-parallax src={e.foto} alt="" width={760} height={480} sizes="380px" className="aspect-[16/9] w-full object-cover" />
                    </div>
                  ) : null}
                  <h3 className="titular text-[clamp(1.8rem,2.6vw,2.4rem)] leading-none">{e.titulo}</h3>
                  <p className="mt-2 text-cuerpo text-crema/80">{e.texto}</p>
                </article>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="relative mt-10 text-center">
        <Pildora href={enlaceWhatsApp('Hola CaFETAL, quiero saber más de su impacto social.')} tono="llena">
          Súmate
        </Pildora>
      </div>
    </section>
  )
}

/** Capas de parallax: hojas grandes y difusas al fondo, hojas nítidas al frente y granos flotando. */
const HOJA = 'M2 40C20 4 64 0 78 10C66 38 30 52 2 40Z'
function Hojas() {
  const fondo = [
    { x: '4%', y: '18%', w: 220, g: -30 },
    { x: '82%', y: '34%', w: 260, g: 150 },
    { x: '10%', y: '62%', w: 200, g: 20 },
    { x: '78%', y: '78%', w: 240, g: 200 },
  ]
  const frente = [
    { x: '-3%', y: '40%', w: 150, g: 10 },
    { x: '90%', y: '56%', w: 170, g: 170 },
  ]
  const granos = [
    { x: '22%', y: '30%' },
    { x: '70%', y: '22%' },
    { x: '30%', y: '74%' },
    { x: '66%', y: '66%' },
    { x: '48%', y: '88%' },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div data-capa-parallax="8" className="absolute inset-0 opacity-30 blur-[3px]">
        {fondo.map((h) => (
          <svg key={h.x + h.y} viewBox="0 0 80 50" className="absolute" style={{ left: h.x, top: h.y, width: h.w, transform: `rotate(${h.g}deg)` }}>
            <path d={HOJA} fill="#2f5233" />
          </svg>
        ))}
      </div>
      <div data-capa-parallax="18" className="absolute inset-0">
        {granos.map((g) => (
          <svg key={g.x + g.y} viewBox="0 0 24 32" className="absolute w-4 opacity-60" style={{ left: g.x, top: g.y }}>
            <ellipse cx="12" cy="16" rx="10.5" ry="14.5" fill="#6b4024" />
            <path d="M12.6 2.4C8.4 8.6 15.8 13 12 18.6c-2.3 3.4-1.3 7.6.4 11" fill="none" stroke="rgb(0 0 0 / .45)" strokeWidth="2.1" />
          </svg>
        ))}
      </div>
      <div data-capa-parallax="34" className="absolute inset-0 hidden md:block">
        {frente.map((h) => (
          <svg key={h.x + h.y} viewBox="0 0 80 50" className="absolute" style={{ left: h.x, top: h.y, width: h.w, transform: `rotate(${h.g}deg)` }}>
            <path d={HOJA} fill="#3f6b3a" />
            <path d="M4 39C30 28 52 18 74 12" fill="none" stroke="#9cc27a" strokeWidth="2" />
          </svg>
        ))}
      </div>
    </div>
  )
}
