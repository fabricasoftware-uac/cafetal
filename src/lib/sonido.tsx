'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/** Efectos generados con ElevenLabs (scripts/sonidos.mjs), normalizados a -20 LUFS. */
export type Efecto = 'granos' | 'vertido' | 'tintineo' | 'sobre' | 'despegue' | 'subida' | 'bienvenida' | 'pop' | 'gota' | 'campana' | 'eleccion' | 'liquido' | 'vitrina'
const VOLUMEN: Record<Efecto, number> = { granos: 0.7, vertido: 0.8, tintineo: 0.55, sobre: 0.6, despegue: 0.8, subida: 0.8, bienvenida: 0.85, pop: 0.6, gota: 0.75, campana: 0.85, eleccion: 0.8, liquido: 0.75, vitrina: 0.7 }
const CLAVE = 'cafetal:sonido'

interface Sonido {
  activo: boolean
  alternar: () => void
  sonar: (efecto: Efecto) => void
}

const Contexto = createContext<Sonido | null>(null)

/*
 * Sonido apagado por defecto: el navegador no deja reproducir sin un gesto y una web que suena
 * sola molesta. La elección del visitante se recuerda (localStorage, solo comodidad).
 * Los audios se cargan la primera vez que se encienden, no antes.
 */
export function ProveedorSonido({ children }: { children: ReactNode }) {
  const [activo, setActivo] = useState(false)
  const audios = useRef<Partial<Record<Efecto, HTMLAudioElement>>>({})

  useEffect(() => {
    try {
      if (localStorage.getItem(CLAVE) === '1') setActivo(true)
    } catch {}
  }, [])

  const sonar = useCallback(
    (efecto: Efecto) => {
      if (!activo || typeof window === 'undefined') return
      let a = audios.current[efecto]
      if (!a) {
        a = new Audio(`/sonidos/${efecto}.mp3`)
        a.preload = 'auto'
        a.volume = VOLUMEN[efecto]
        audios.current[efecto] = a
      }
      a.currentTime = 0
      // Si el navegador aún no tiene un gesto del usuario, la promesa se rechaza: se ignora
      a.play().catch(() => {})
    },
    [activo],
  )

  const alternar = useCallback(() => {
    setActivo((v) => {
      const nuevo = !v
      try {
        localStorage.setItem(CLAVE, nuevo ? '1' : '0')
      } catch {}
      return nuevo
    })
  }, [])

  // Al encenderlo, la bienvenida confirma que hay sonido
  const primera = useRef(true)
  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }
    if (activo) sonar('bienvenida')
  }, [activo, sonar])

  const valor = useMemo(() => ({ activo, alternar, sonar }), [activo, alternar, sonar])
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useSonido(): Sonido {
  const c = useContext(Contexto)
  if (!c) throw new Error('useSonido debe usarse dentro de <ProveedorSonido>')
  return c
}
