import { aleatorioConSemilla } from '@/lib/movimiento'

/*
 * La sala del salón de la fama, vectorial (nítida a cualquier resolución). Mismas proporciones que
 * la foto de referencia: lienzo 1672 × 941, tapa del pedestal centrada al 66 % del alto y 38 % del
 * ancho. Fondo, haz de luz, pedestal de madera con veta y filo dorado, y brillo en el piso.
 */
const W = 1672
const H = 941
const CX = W / 2
const TOPE = 621 // centro de la tapa
const RX = 318
const RY = 36
const BASE = 846

// Veta de la madera: líneas onduladas deterministas (iguales en servidor y cliente)
const azar = aleatorioConSemilla(42)
const VETAS = Array.from({ length: 130 }, () => {
  const x = CX - RX + azar() * RX * 2
  const ondas = 2 + azar() * 3
  const amp = 0.8 + azar() * 2.6
  let d = `M${x.toFixed(1)} ${TOPE}`
  for (let y = TOPE; y <= BASE + 40; y += 12) d += `L${(x + Math.sin((y / 80) * ondas) * amp).toFixed(1)} ${y}`
  return { d, o: 0.025 + azar() * 0.07, w: 0.4 + azar() * 1.1 }
})
const ANILLOS = Array.from({ length: 9 }, (_, i) => ({ rx: RX * (0.15 + i * 0.1), ry: RY * (0.15 + i * 0.1), o: 0.05 + (i % 3) * 0.03 }))

export function SalaSVG({ tono }: { tono: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="sala-fondo" cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor="#3a2416" />
          <stop offset=".45" stopColor="#1f130c" />
          <stop offset="1" stopColor="#0c0705" />
        </radialGradient>
        <linearGradient id="sala-haz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity=".55" />
          <stop offset=".55" stopColor="#f2b56a" stopOpacity=".18" />
          <stop offset="1" stopColor="#e2a35a" stopOpacity="0" />
        </linearGradient>
        <filter id="sala-difuso" x="-30%" y="-10%" width="160%" height="130%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <linearGradient id="sala-cuerpo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#140b06" />
          <stop offset=".18" stopColor="#3a2112" />
          <stop offset=".42" stopColor="#6a3d22" />
          <stop offset=".55" stopColor="#5a321b" />
          <stop offset=".82" stopColor="#2a170c" />
          <stop offset="1" stopColor="#0f0804" />
        </linearGradient>
        <linearGradient id="sala-sombra-vertical" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset=".7" stopColor="#000" stopOpacity=".35" />
          <stop offset="1" stopColor="#000" stopOpacity=".6" />
        </linearGradient>
        <radialGradient id="sala-tapa" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#a8693d" />
          <stop offset=".55" stopColor="#6e4022" />
          <stop offset="1" stopColor="#3b2111" />
        </radialGradient>
        <radialGradient id="sala-piso" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#c98a4a" stopOpacity=".45" />
          <stop offset=".5" stopColor="#7a4a26" stopOpacity=".18" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sala-vineta" cx="50%" cy="50%" r="72%">
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".65" />
        </radialGradient>
        <clipPath id="sala-clip-cuerpo">
          <path d={`M${CX - RX} ${TOPE}V${BASE}A${RX} ${RY} 0 0 0 ${CX + RX} ${BASE}V${TOPE}Z`} />
        </clipPath>
        <filter id="sala-grano">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 .85  0 0 0 0 .7  0 0 0 .06 0" />
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#sala-fondo)" />
      {/* tono del sabor muy suave en el aire */}
      <rect width={W} height={H} fill={tono} opacity=".12" style={{ transition: 'fill .7s' }} />

      {/* haz de luz desde arriba */}
      <polygon points={`${CX - 70},0 ${CX + 70},0 ${CX + RX + 40},${TOPE} ${CX - RX - 40},${TOPE}`} fill="url(#sala-haz)" filter="url(#sala-difuso)" />
      <polygon points={`${CX - 26},0 ${CX + 26},0 ${CX + RX * 0.55},${TOPE} ${CX - RX * 0.55},${TOPE}`} fill="url(#sala-haz)" opacity=".7" filter="url(#sala-difuso)" />

      {/* brillo en el piso */}
      <ellipse cx={CX} cy={BASE + 18} rx={RX * 1.9} ry={RY * 3.4} fill="url(#sala-piso)" />
      <ellipse cx={CX} cy={BASE + 10} rx={RX * 1.05} ry={RY * 1.2} fill="#000" opacity=".55" filter="url(#sala-difuso)" />

      {/* cuerpo del pedestal con veta */}
      <g clipPath="url(#sala-clip-cuerpo)">
        <rect x={CX - RX} y={TOPE} width={RX * 2} height={BASE - TOPE + RY} fill="url(#sala-cuerpo)" />
        {VETAS.map((v) => (
          <path key={v.d} d={v.d} fill="none" stroke="#e7b98a" strokeOpacity={v.o} strokeWidth={v.w} />
        ))}
        <rect x={CX - RX} y={TOPE} width={RX * 2} height={BASE - TOPE + RY} fill="url(#sala-sombra-vertical)" />
      </g>
      {/* filo dorado inferior de la tapa */}
      <path d={`M${CX - RX} ${TOPE}A${RX} ${RY} 0 0 0 ${CX + RX} ${TOPE}`} fill="none" stroke="#e1b75d" strokeWidth="3" strokeOpacity=".85" />

      {/* tapa iluminada con anillos */}
      <ellipse cx={CX} cy={TOPE} rx={RX} ry={RY} fill="url(#sala-tapa)" />
      {ANILLOS.map((a) => (
        <ellipse key={a.rx} cx={CX} cy={TOPE} rx={a.rx} ry={a.ry} fill="none" stroke="#f1c897" strokeOpacity={a.o} strokeWidth="1.2" />
      ))}
      <ellipse cx={CX} cy={TOPE - 4} rx={RX * 0.55} ry={RY * 0.45} fill="#ffe3b8" opacity=".22" filter="url(#sala-difuso)" />
      <ellipse cx={CX} cy={TOPE} rx={RX} ry={RY} fill="none" stroke="#f0d79c" strokeWidth="2" strokeOpacity=".7" />

      <rect width={W} height={H} filter="url(#sala-grano)" />
      <rect width={W} height={H} fill="url(#sala-vineta)" />
    </svg>
  )
}
