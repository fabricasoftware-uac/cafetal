import { gsap } from './gsap'

export const EVENTO_RUTA = 'cafetal:ruta-lista'
const ONDA = 'M0 30C240 0 480 0 720 30S1200 60 1440 30S1920 0 2160 30S2640 60 2880 30V60H0Z'

/*
 * Transición entre páginas: sube una ola de café con la casa al centro, se navega y, cuando la
 * nueva ruta está pintada (EVENTO_RUTA, lo emite <FinTransicion>), la ola sigue hacia arriba y descubre.
 * Seguro: si la ruta no avisa en 2,5 s, el telón se retira igual.
 */
export function transicionar(navegar: () => void) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    navegar()
    return
  }
  const capa = document.createElement('div')
  capa.setAttribute('aria-hidden', 'true')
  capa.style.cssText = 'position:fixed;inset:-60px 0 0 0;z-index:95;pointer-events:none;color:#5a3b26'
  capa.innerHTML = `<div style="position:absolute;inset:0 0 auto 0;height:60px;overflow:hidden"><svg viewBox="0 0 2880 60" preserveAspectRatio="none" style="position:absolute;top:0;left:0;height:100%;width:200%;fill:currentColor;animation:ola 2.6s linear infinite"><path d="${ONDA}"/></svg></div><div style="position:absolute;inset:59px 0 0 0;background:currentColor;display:grid;place-items:center"><span style="font-family:var(--font-titular);font-size:clamp(3rem,9vw,8rem);font-weight:750;letter-spacing:-.01em;color:#efd6bf;text-transform:uppercase">Sirviendo…</span></div>`
  document.body.appendChild(capa)
  let hecho = false
  const salir = () => {
    if (hecho) return
    hecho = true
    window.removeEventListener(EVENTO_RUTA, salir)
    gsap.to(capa, { yPercent: -110, duration: 0.8, ease: 'power3.inOut', delay: 0.1, onComplete: () => capa.remove() })
  }
  gsap.fromTo(
    capa,
    { yPercent: 105 },
    {
      yPercent: 0,
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        window.addEventListener(EVENTO_RUTA, salir)
        navegar()
        window.setTimeout(salir, 2500)
      },
    },
  )
}
