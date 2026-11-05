import type { SVGProps } from 'react'

/* Iconos de línea del mundo del café, todos en una misma rejilla de 64 y trazo de 1.6 */
const base = (props: SVGProps<SVGSVGElement>) => ({
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
})

export const IconoCerezas = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="30" cy="16" r="7" />
    <circle cx="22" cy="28" r="7" />
    <circle cx="36" cy="29" r="7" />
    <path d="M44 6 18 48" />
    <path d="M18 48c-2-10 6-18 16-16 2 10-6 18-16 16Z" />
    <path d="M20 46 32 34" />
  </svg>
)
export const IconoSecado = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="32" cy="16" r="7" />
    <path d="M32 3v3M32 26v3M19 16h3M42 16h3M23 7l2 2M39 23l2 2M41 7l-2 2M23 25l2-2" />
    <path d="M6 44h52M10 50h44" />
    {[14, 22, 30, 38, 46].map((x) => (
      <ellipse key={x} cx={x} cy={40} rx="2.6" ry="1.8" />
    ))}
  </svg>
)
export const IconoTostion = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M24 6c-3 3 3 5 0 8M32 4c-3 3 3 6 0 10M40 6c-3 3 3 5 0 8" />
    <ellipse cx="32" cy="40" rx="12" ry="17" transform="rotate(28 32 40)" />
    <path d="M40 26c-10 4-6 14-16 28" />
  </svg>
)
export const IconoTaza = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M14 22h32v14a14 14 0 0 1-14 14h-4a14 14 0 0 1-14-14Z" />
    <path d="M46 26h3a6 6 0 0 1 0 12h-4" />
    <path d="M8 56h44" />
    <path d="M24 8c-3 3 3 5 0 8M32 6c-3 3 3 6 0 10M40 8c-3 3 3 5 0 8" />
  </svg>
)
export const IconoSobre = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="12" y="20" width="40" height="32" rx="3" />
    <path d="M12 22 32 36l20-14" />
    <path d="M40 8 46 20M24 8l-6 12" strokeDasharray="2 3" />
  </svg>
)
export const IconoSachet = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M32 4v16" />
    <rect x="26" y="4" width="12" height="8" rx="1.5" />
    <rect x="20" y="20" width="24" height="26" rx="2" strokeDasharray="2 2.5" />
    <path d="M20 34q12-4 24 0" />
    <path d="M10 46h44l-4 10H14Z" />
  </svg>
)
export const IconoVertido = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10 10h20l-4 8H14Z" />
    <path d="M26 18q6 6 6 18" />
    <path d="M18 36h28v8a10 10 0 0 1-10 10h-8a10 10 0 0 1-10-10Z" />
    <path d="M46 40h3a4 4 0 0 1 0 8h-3" />
  </svg>
)
