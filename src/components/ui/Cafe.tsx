import type { CSSProperties, SVGProps } from 'react'

/** Grano de café: cuerpo ovalado y surco en S. El surco usa `--surco` (por defecto, negro translúcido). */
export function Grano(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 32" aria-hidden="true" {...props}>
      <ellipse cx="12" cy="16" rx="10.5" ry="14.5" fill="currentColor" />
      <path
        d="M12.6 2.4C8.4 8.6 15.8 13 12 18.6c-2.3 3.4-1.3 7.6.4 11"
        fill="none"
        stroke="var(--surco, rgb(0 0 0 / .42))"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Tres hilos de vapor que suben en bucle (CSS, se detienen con movimiento reducido). */
export function Vapor({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={`vapor ${className ?? ''}`}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M38 156c-14-22 18-36 4-60s16-38 6-70" />
      <path d="M62 156c-12-24 20-34 6-60s14-40 4-74" />
      <path d="M86 156c-14-20 16-36 4-58s14-38 4-66" />
    </svg>
  )
}
