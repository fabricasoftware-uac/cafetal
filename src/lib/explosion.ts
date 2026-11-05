import { gsap } from './gsap'

/** Contorno del grano (el mismo dibujo de ui/Cafe → Grano), para partículas creadas a mano. */
const GRANO_SVG =
  '<svg viewBox="0 0 24 32" width="100%" height="100%"><ellipse cx="12" cy="16" rx="10.5" ry="14.5" fill="currentColor"/><path d="M12.6 2.4C8.4 8.6 15.8 13 12 18.6c-2.3 3.4-1.3 7.6.4 11" fill="none" stroke="rgb(0 0 0 / .45)" stroke-width="2.1" stroke-linecap="round"/></svg>'
const TONOS = ['#5a3b26', '#3a271b', '#6b4024', '#8a5a34', '#e1b75d']

interface Opciones {
  cantidad?: number
  /** Ángulo central en grados (-90 = hacia arriba). */
  hacia?: number
  abanico?: number
  fuerza?: number
  /** Imágenes de ingredientes (`/ingredientes/<nombre>.webp`) que se mezclan con los granos. */
  imagenes?: string[]
  onda?: boolean
}

/*
 * Explosión de café: granos, gotas y, si se pasan, ingredientes, que salen en abanico y caen con
 * gravedad (GSAP Physics2D). Los nodos se crean fuera de React y se animan con gsap directamente
 * (Gotchas → nodos creados fuera de React y contextSafe) y se retiran al terminar.
 */
export function explosion(x: number, y: number, { cantidad = 46, hacia = -90, abanico = 160, fuerza = 1, imagenes = [], onda = true }: Opciones = {}) {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const capa = document.createElement('div')
  capa.setAttribute('aria-hidden', 'true')
  capa.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:70;overflow:hidden'
  document.body.appendChild(capa)
  const tl = gsap.timeline({ onComplete: () => capa.remove() })
  for (let i = 0; i < cantidad; i++) {
    const n = document.createElement('span')
    const img = imagenes.length && i % 3 === 0 ? imagenes[i % imagenes.length] : null
    const esGrano = !img && i % 3 !== 2
    const tam = img ? gsap.utils.random(46, 84) : esGrano ? gsap.utils.random(16, 32) : gsap.utils.random(8, 18)
    n.style.cssText = `position:absolute;left:${x - tam / 2}px;top:${y - tam / 2}px;width:${tam}px;height:${esGrano ? tam * 1.33 : tam}px;color:${gsap.utils.random(TONOS)}`
    if (img) {
      n.style.background = `url(/ingredientes/${img}.webp) center/contain no-repeat`
    } else if (esGrano) n.innerHTML = GRANO_SVG
    else {
      n.style.borderRadius = '50% 50% 50% 0'
      n.style.background = i % 2 ? '#3a1f10' : '#6b4024'
    }
    capa.appendChild(n)
    const duracion = gsap.utils.random(1.1, 1.8)
    tl.to(
      n,
      {
        physics2D: { velocity: gsap.utils.random(420, 900) * fuerza, angle: hacia + gsap.utils.random(-abanico / 2, abanico / 2), gravity: 1500 },
        rotation: gsap.utils.random(-540, 540),
        duration: duracion,
        ease: 'none',
      },
      0,
    ).to(n, { opacity: 0, duration: 0.35, ease: 'power1.in' }, duracion - 0.35)
  }
  if (onda) {
    const o = document.createElement('span')
    o.style.cssText = `position:absolute;left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;border-radius:999px;border:2px solid #e1b75d`
    capa.appendChild(o)
    tl.fromTo(o, { scale: 0.2, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0)
  }
}
