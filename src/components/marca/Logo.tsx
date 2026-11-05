import type { SVGProps } from 'react'
import { CAJAS, CASA, CASA_DETALLE, MARCA, SLOGAN, SUBSLOGAN } from './trazos'

type Variante = keyof typeof CAJAS

interface Props extends Omit<SVGProps<SVGSVGElement>, 'viewBox'> {
  variante?: Variante
  /** Texto accesible. `null` lo marca como decorativo. */
  etiqueta?: string | null
}

/*
 * Logo CaFETAL con los trazos originales del manual. Toma el color de `currentColor`.
 * Cada letra es un <path class="logo-letra"> con `--i`, para animarlas sin tocar la geometría:
 * cualquier animación debe terminar en este estado exacto (manual: no deformar, no mover elementos).
 * Sin ids internos: el logo aparece varias veces por página (ver Gotchas → IDs de SVG duplicados).
 */
export function Logo({ variante = 'completo', etiqueta = 'CaFETAL — Café Tostado y Molido', ...props }: Props) {
  const [x, y, w, h] = CAJAS[variante]
  const conMarca = variante !== 'imagotipo'
  const conSlogan = variante === 'completo'
  const decorativo = etiqueta === null
  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      fill="currentColor"
      role={decorativo ? undefined : 'img'}
      aria-hidden={decorativo ? true : undefined}
      aria-label={decorativo ? undefined : etiqueta}
      {...props}
    >
      <g className="logo-casa">
        <path className="logo-casa-trazo" d={CASA} pathLength={1} />
        {CASA_DETALLE.map((d) => (
          <path key={d.slice(0, 24)} className="logo-casa-detalle" d={d} />
        ))}
      </g>
      {conMarca ? <Letras grupo="marca" trazos={MARCA} /> : null}
      {conSlogan ? <Letras grupo="slogan" trazos={SLOGAN} /> : null}
      {conSlogan ? <Letras grupo="subslogan" trazos={SUBSLOGAN} /> : null}
    </svg>
  )
}

function Letras({ grupo, trazos }: { grupo: string; trazos: readonly string[] }) {
  return (
    <g className={`logo-${grupo}`}>
      {trazos.map((d, i) => (
        <path
          // biome-ignore lint/suspicious/noArrayIndexKey: lista fija generada, el orden es la identidad
          key={i}
          className="logo-letra"
          style={{ ['--i' as string]: i, transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          d={d}
        />
      ))}
    </g>
  )
}
