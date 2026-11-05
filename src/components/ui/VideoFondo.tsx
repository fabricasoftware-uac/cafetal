'use client'

import { useEffect, useRef } from 'react'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

/*
 * Video en bucle, mudo, con póster. No se descarga hasta acercarse (preload="none" + IntersectionObserver)
 * y se pausa fuera de pantalla (Gotchas → Rendimiento). Con movimiento reducido queda el póster.
 */
export function VideoFondo({
  nombre,
  className,
  activo = true,
  filtro = 'brightness(.62) saturate(.95)',
}: {
  nombre: string
  className?: string
  activo?: boolean
  filtro?: string
}) {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v || prefiereMenosMovimiento()) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && activo) {
          if (v.preload === 'none') {
            v.preload = 'auto'
            v.load()
          }
          v.play().catch(() => {})
        } else v.pause()
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [activo])

  return (
    <video
      ref={video}
      className={`h-full w-full object-cover ${className ?? ''}`}
      style={{ filter: filtro }}
      poster={`/video/${nombre}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src={`/video/${nombre}.mp4`} type="video/mp4" />
    </video>
  )
}
