'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTOS } from './productos'
import { enlaceWhatsApp } from './sitio'

/** Línea del pedido: producto y cantidad de cajas. */
export interface Linea {
  slug: string
  cajas: number
}

interface Carrito {
  lineas: Linea[]
  total: number
  abierto: boolean
  /** Sube cada vez que se agrega algo: el botón de la barra rebota. */
  golpe: number
  agregar: (slug: string, cajas?: number) => void
  cambiar: (slug: string, cajas: number) => void
  vaciar: () => void
  abrir: () => void
  cerrar: () => void
  enlacePedido: () => string
}

const Contexto = createContext<Carrito | null>(null)
const CLAVE = 'cafetal:carrito'

/*
 * Carrito sin pasarela: el pedido se arma aquí y se envía por WhatsApp con el detalle.
 * Se recuerda en localStorage (comodidad; si falla, el carrito simplemente empieza vacío).
 */
export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const [lineas, setLineas] = useState<Linea[]>([])
  const [abierto, setAbierto] = useState(false)
  const [golpe, setGolpe] = useState(0)

  useEffect(() => {
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE) ?? '[]') as Linea[]
      if (Array.isArray(g)) setLineas(g.filter((l) => PRODUCTOS.some((p) => p.slug === l.slug) && l.cajas > 0))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas))
    } catch {}
  }, [lineas])

  const agregar = useCallback((slug: string, cajas = 1) => {
    setLineas((ls) => {
      const ya = ls.find((l) => l.slug === slug)
      return ya ? ls.map((l) => (l.slug === slug ? { ...l, cajas: l.cajas + cajas } : l)) : [...ls, { slug, cajas }]
    })
    setGolpe((g) => g + 1)
  }, [])
  const cambiar = useCallback((slug: string, cajas: number) => {
    setLineas((ls) => (cajas <= 0 ? ls.filter((l) => l.slug !== slug) : ls.map((l) => (l.slug === slug ? { ...l, cajas } : l))))
  }, [])
  const vaciar = useCallback(() => setLineas([]), [])

  const enlacePedido = useCallback(() => {
    const detalle = lineas
      .map((l) => {
        const p = PRODUCTOS.find((x) => x.slug === l.slug)
        return `• ${l.cajas} × ${p?.nombre ?? l.slug} (caja de 20 sachets)`
      })
      .join('\n')
    return enlaceWhatsApp(`¡Hola CaFETAL! Quiero hacer este pedido:\n${detalle}\n\n¿Me confirman precio y envío?`)
  }, [lineas])

  const total = lineas.reduce((n, l) => n + l.cajas, 0)
  const valor = useMemo(
    () => ({ lineas, total, abierto, golpe, agregar, cambiar, vaciar, abrir: () => setAbierto(true), cerrar: () => setAbierto(false), enlacePedido }),
    [lineas, total, abierto, golpe, agregar, cambiar, vaciar, enlacePedido],
  )
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useCarrito(): Carrito {
  const c = useContext(Contexto)
  if (!c) throw new Error('useCarrito debe usarse dentro de <ProveedorCarrito>')
  return c
}
