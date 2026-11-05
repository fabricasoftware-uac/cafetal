'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSonido } from './sonido'

export const SABORES_INFUSION = ['Tradicional', 'Anís', 'Campesino', 'Cardamomo', 'Jengibre'] as const
export const LIQUIDOS = ['agua caliente', 'leche caliente', 'un licor'] as const
export type SaborInfusion = (typeof SABORES_INFUSION)[number]
export type Liquido = (typeof LIQUIDOS)[number]

/*
 * Tiempo de infusión según el brochure ("mueve el sachet de 2 a 3 minutos").
 * La leche pide el máximo; el licor, a temperatura ambiente, también.
 */
export function segundosDe(liquido: Liquido): number {
  return liquido === 'agua caliente' ? 150 : 180
}

interface Infusion {
  sabor: SaborInfusion
  liquido: Liquido
  elegir: (cambios: { sabor?: SaborInfusion; liquido?: Liquido }) => void
  /** Segundos que faltan; `null` si no hay ninguna en curso. 0 = lista. */
  restante: number | null
  iniciar: () => void
  terminarYa: () => void
  reiniciar: () => void
}

const Contexto = createContext<Infusion | null>(null)

/** La infusión que el visitante pone en marcha: la cuenta la lleva la etiqueta de la esquina. */
export function ProveedorInfusion({ children }: { children: ReactNode }) {
  const [sabor, setSabor] = useState<SaborInfusion>('Tradicional')
  const [liquido, setLiquido] = useState<Liquido>('agua caliente')
  const [fin, setFin] = useState<number | null>(null)
  const [ahora, setAhora] = useState(0)

  useEffect(() => {
    if (fin === null) return
    setAhora(Date.now())
    const id = window.setInterval(() => setAhora(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [fin])

  const restante = fin === null ? null : Math.max(0, Math.ceil((fin - ahora) / 1000))

  // Campanita al quedar lista (una vez por infusión)
  const { sonar } = useSonido()
  const avisada = useRef(false)
  useEffect(() => {
    if (restante === null) avisada.current = false
    else if (restante === 0 && !avisada.current) {
      avisada.current = true
      sonar('campana')
    }
  }, [restante, sonar])

  const elegir = useCallback<Infusion['elegir']>((c) => {
    if (c.sabor) setSabor(c.sabor)
    if (c.liquido) setLiquido(c.liquido)
  }, [])
  const iniciar = useCallback(() => setFin(Date.now() + segundosDe(liquido) * 1000), [liquido])
  const terminarYa = useCallback(() => setFin(Date.now()), [])
  const reiniciar = useCallback(() => setFin(null), [])

  const valor = useMemo(
    () => ({ sabor, liquido, elegir, restante, iniciar, terminarYa, reiniciar }),
    [sabor, liquido, elegir, restante, iniciar, terminarYa, reiniciar],
  )
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useInfusion(): Infusion {
  const c = useContext(Contexto)
  if (!c) throw new Error('useInfusion debe usarse dentro de <ProveedorInfusion>')
  return c
}

export function reloj(segundos: number): string {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
}
