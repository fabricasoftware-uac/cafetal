'use client'

import { useEffect, useRef } from 'react'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

/*
 * Polvo dorado en el haz de luz (canvas 2D): las motas suben despacio, titilan y se apartan del
 * cursor. `chispa` cambia → una lluvia de chispas sale desde el centro del pedestal.
 * El bucle se detiene fuera de pantalla y con movimiento reducido no se monta.
 */
export function Polvo({ chispa, centro = [0.5, 0.62] }: { chispa: number; centro?: [number, number] }) {
  const lienzo = useRef<HTMLCanvasElement>(null)
  const disparar = useRef<(() => void) | null>(null)

  useEffect(() => {
    const c = lienzo.current
    if (!c || prefiereMenosMovimiento()) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio, 1.5)
    const medir = () => {
      const r = c.getBoundingClientRect()
      w = r.width
      h = r.height
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(c)

    interface Mota {
      x: number
      y: number
      vx: number
      vy: number
      r: number
      fase: number
      vida?: number
    }
    // Las motas nacen dentro del cono de luz (más estrecho arriba)
    const nueva = (): Mota => {
      const y = Math.random()
      const ancho = 0.08 + y * 0.22
      return { x: 0.5 + (Math.random() - 0.5) * ancho * 2, y, vx: 0, vy: -(0.004 + Math.random() * 0.01), r: 0.6 + Math.random() * 1.8, fase: Math.random() * 6 }
    }
    const motas: Mota[] = Array.from({ length: 140 }, nueva)
    const chispas: Mota[] = []
    let mx = -1
    let my = -1
    const mover = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      mx = (e.clientX - r.left) / r.width
      my = (e.clientY - r.top) / r.height
    }
    window.addEventListener('pointermove', mover, { passive: true })
    disparar.current = () => {
      for (let k = 0; k < 60; k++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1
        const v = 0.25 + Math.random() * 0.55
        chispas.push({ x: centro[0], y: centro[1], vx: Math.cos(a) * v * 0.6, vy: Math.sin(a) * v, r: 0.8 + Math.random() * 2, fase: 0, vida: 1 })
      }
    }

    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e?.isIntersecting ?? false
      if (visible) arrancar()
    })
    io.observe(c)
    let raf = 0
    let previo = performance.now()
    let t = 0
    const cuadro = (ahora: number) => {
      raf = 0
      if (!visible || document.hidden) return
      const dt = Math.min(0.05, (ahora - previo) / 1000)
      previo = ahora
      t += dt
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const m of motas) {
        // el cursor las aparta con suavidad
        const dx = m.x - mx
        const dy = (m.y - my) * (h / w)
        const d2 = dx * dx + dy * dy
        if (mx >= 0 && d2 < 0.012) {
          const f = (0.012 - d2) * 6
          m.vx += (dx / Math.sqrt(d2 + 1e-4)) * f * dt
        }
        m.vx *= 0.96
        m.x += (m.vx + Math.sin(t * 0.6 + m.fase) * 0.0025) * dt * 10
        m.y += m.vy * dt * 4
        if (m.y < -0.02 || m.x < 0.15 || m.x > 0.85) Object.assign(m, nueva(), { y: 1.02 })
        const brillo = 0.35 + Math.sin(t * 2 + m.fase) * 0.25
        ctx.fillStyle = `rgba(255, 214, 150, ${brillo})`
        ctx.beginPath()
        ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2)
        ctx.fill()
      }
      for (let k = chispas.length - 1; k >= 0; k--) {
        const s = chispas[k]
        if (!s) continue
        s.vy += 0.9 * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
        s.vida = (s.vida ?? 0) - dt * 0.8
        if ((s.vida ?? 0) <= 0) {
          chispas.splice(k, 1)
          continue
        }
        ctx.fillStyle = `rgba(255, 200, 110, ${s.vida})`
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
      arrancar()
    }
    function arrancar() {
      if (!raf) {
        previo = performance.now()
        raf = requestAnimationFrame(cuadro)
      }
    }
    arrancar()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', mover)
    }
  }, [centro])

  const primera = useRef(true)
  useEffect(() => {
    if (primera.current) {
      primera.current = false
      return
    }
    disparar.current?.()
  }, [chispa])

  return <canvas ref={lienzo} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
