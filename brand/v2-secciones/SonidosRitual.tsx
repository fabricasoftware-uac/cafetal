'use client'

import { ScrollTrigger, useGSAP } from '@/lib/gsap'
import { type Efecto, useSonido } from '@/lib/sonido'

// Cada verbo con su gesto: rasgar el sobre, dejarlo en la taza, verter, infusionar
const EFECTOS: Efecto[] = ['sobre', 'tintineo', 'vertido', 'menu']

/** Hace sonar el gesto de cada paso del ritual al entrar su panel (solo con el sonido encendido). */
export function SonidosRitual() {
  const { sonar, activo } = useSonido()
  useGSAP(
    () => {
      if (!activo) return
      const paneles = document.querySelectorAll<HTMLElement>('#ritual > [data-paso]')
      paneles.forEach((panel, i) => {
        ScrollTrigger.create({ trigger: panel, start: 'top 55%', onEnter: () => sonar(EFECTOS[i] ?? 'tintineo') })
      })
    },
    { dependencies: [activo, sonar] },
  )
  return null
}
