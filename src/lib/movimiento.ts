export function prefiereMenosMovimiento(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Evento que emite la intro al descubrir la página. */
export const EVENTO_INTRO_FIN = 'cafetal:intro-fin'

export function introTerminada(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.intro !== 'si'
}

/** Ejecuta `fn` cuando la página quede descubierta. Devuelve la función de limpieza. */
export function alTerminarIntro(fn: () => void): () => void {
  if (introTerminada()) {
    fn()
    return () => {}
  }
  const manejador = () => fn()
  window.addEventListener(EVENTO_INTRO_FIN, manejador, { once: true })
  return () => window.removeEventListener(EVENTO_INTRO_FIN, manejador)
}

/** Generador pseudoaleatorio con semilla: mismas formas en servidor y cliente. */
export function aleatorioConSemilla(semilla: number) {
  let s = semilla >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
