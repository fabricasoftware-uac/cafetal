'use client'

import { useSonido } from '@/lib/sonido'

/** Interruptor de sonido: tres hilos de vapor que se mueven cuando está encendido. */
export function BotonSonido() {
  const { activo, alternar } = useSonido()
  return (
    <button
      type="button"
      onClick={alternar}
      aria-pressed={activo}
      aria-label={activo ? 'Apagar el sonido' : 'Encender el sonido'}
      className="group grid size-12 place-items-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:-translate-y-0.5 active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="w-6 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {[7, 12, 17].map((x, i) => (
          <path
            key={x}
            d={`M${x} 20c-3-3 3-5 0-8s3-5 0-8`}
            className={activo ? 'animate-[vaporBoton_1.6s_ease-in-out_infinite]' : 'opacity-40'}
            style={{ animationDelay: `${i * 0.23}s`, transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
        ))}
        {activo ? null : <path d="M4 21 20 3" strokeWidth="2" />}
      </svg>
    </button>
  )
}
