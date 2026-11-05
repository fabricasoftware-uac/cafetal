'use client'

import { useState } from 'react'
import { Logo } from '@/components/marca/Logo'
import { Taza3D } from '@/components/tres/Taza3D'
import { LIQUIDOS, reloj, SABORES_INFUSION, segundosDe, useInfusion } from '@/lib/infusion'
import { useSonido } from '@/lib/sonido'

/** Color del empaque de cada sabor: anillo del plato. */
const COLOR_SABOR: Record<string, string> = {
  Tradicional: 'var(--color-tinta)',
  Anís: 'var(--color-anis)',
  Campesino: 'var(--color-campesino)',
  Cardamomo: 'var(--color-cardamomo)',
  Jengibre: 'var(--color-jengibre)',
}
/** Color de la taza terminada según lo que se vierte. */
const COLOR_LIQUIDO: Record<string, string> = {
  'agua caliente': '#1f0d05',
  'leche caliente': '#7a4c2a',
  'un licor': '#35130a',
}

/*
 * Lo que el visitante puede hacer: elegir sabor y líquido y poner a infusionar su taza.
 * La cuenta sigue en la etiqueta de la esquina mientras recorre la página.
 */
export function Prepara() {
  const inf = useInfusion()
  const { sonar } = useSonido()
  const [tres, setTres] = useState(false)
  const total = segundosDe(inf.liquido)
  const enCurso = inf.restante !== null && inf.restante > 0
  const lista = inf.restante === 0
  const avance = inf.restante === null ? 0 : 1 - inf.restante / total

  return (
    <section id="prepara" data-nav="oscuro" data-seccion className="marco pt-[clamp(6rem,9vw,8rem)] pb-[clamp(4rem,6vw,5rem)]">
      <div className="rejilla items-center gap-y-14">
        <div className="col-span-12 lg:col-span-6">
          <h2 className="text-display">
            Prepara tu taza
          </h2>
          <p data-revelar className="mt-8 max-w-[40ch] text-cuerpo">
            Elige el café y lo que vas a verter. Mientras se infusiona, sigue bajando: la etiqueta de la esquina te avisa
            cuando esté lista.
          </p>

          <fieldset data-revelar className="mt-12" disabled={enCurso}>
            <legend className="text-nota text-suave">El café</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {SABORES_INFUSION.map((s) => (
                <Opcion key={s} activa={inf.sabor === s} alElegir={() => { sonar('tintineo'); inf.elegir({ sabor: s }) }}>
                  {s}
                </Opcion>
              ))}
            </div>
          </fieldset>
          <fieldset data-revelar className="mt-8" disabled={enCurso}>
            <legend className="text-nota text-suave">Lo que viertes</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {LIQUIDOS.map((l) => (
                <Opcion key={l} activa={inf.liquido === l} alElegir={() => { sonar('tintineo'); inf.elegir({ liquido: l }) }}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </Opcion>
              ))}
            </div>
          </fieldset>

          <div data-revelar className="mt-12 flex flex-wrap items-center gap-6">
            {enCurso ? (
              <>
                <button type="button" onClick={inf.terminarYa} className="accion">
                  Ya está bien así
                </button>
                <button type="button" onClick={inf.reiniciar} className="enlace text-cuerpo">
                  Cancelar
                </button>
              </>
            ) : lista ? (
              <button type="button" onClick={inf.reiniciar} className="accion">
                Preparar otra
              </button>
            ) : (
              <button type="button" onClick={() => { sonar('vertido'); inf.iniciar() }} className="accion">
                Infusionar {reloj(total)} minutos
              </button>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div data-revelar className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div className={`absolute inset-0 transition-opacity duration-700 ${tres ? 'opacity-0' : ''}`}>
              <TazaDesdeArriba avance={avance} sabor={inf.sabor} liquido={inf.liquido} />
            </div>
            <Taza3D avance={avance} colorFinal={COLOR_LIQUIDO[inf.liquido]} dentro={inf.restante !== null} alListo={() => setTres(true)} />
          </div>
          <p className="mt-6 text-center text-frase" aria-live="polite">
            {enCurso
              ? `${reloj(inf.restante ?? 0)} · ${inf.sabor} con ${inf.liquido}`
              : lista
                ? `Tu ${inf.sabor.toLowerCase()} con ${inf.liquido} está lista.`
                : `${inf.sabor} con ${inf.liquido}`}
          </p>
        </div>
      </div>
    </section>
  )
}

function Opcion({ activa, alElegir, children }: { activa: boolean; alElegir: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={alElegir}
      className={`min-h-12 px-5 text-cuerpo transition-[background-color,color,transform] duration-300 [transition-timing-function:var(--ease-salto)] active:scale-95 disabled:opacity-50 ${
        activa ? 'bg-crema text-tinta' : 'bg-espresso text-crema hover:bg-tostado'
      }`}
    >
      {children}
    </button>
  )
}

/** Taza vista desde arriba: el líquido oscurece con el avance de la infusión. */
function TazaDesdeArriba({ avance, sabor, liquido }: { avance: number; sabor: string; liquido: string }) {
  const giro = avance * 26
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label={`Taza de ${sabor} con ${liquido}`}>
      <circle cx="200" cy="200" r="196" fill={COLOR_SABOR[sabor]} style={{ transition: 'fill .6s' }} />
      <circle cx="200" cy="200" r="170" fill="var(--color-papel)" />
      <circle cx="200" cy="200" r="150" fill="#e8dcc6" />
      <path d="M340 168q60 4 58 36t-58 30" fill="none" stroke="var(--color-papel)" strokeWidth="22" strokeLinecap="round" />
      <circle cx="200" cy="200" r="128" fill="#f3ead9" />
      <circle cx="200" cy="200" r="122" fill="#d6b07a" opacity={0.25 + avance * 0.35} />
      <circle cx="200" cy="200" r="122" fill={COLOR_LIQUIDO[liquido]} opacity={avance} style={{ transition: 'fill .6s' }} />
      <g style={{ transform: `rotate(${giro}deg)`, transformOrigin: '200px 200px', transition: 'transform .3s linear' }}>
        <rect x="160" y="150" width="80" height="96" rx="6" fill="#f1e8d6" opacity={0.92 - avance * 0.3} />
        <rect x="170" y="164" width="60" height="70" rx="4" fill="#5c361d" opacity={0.85 - avance * 0.25} />
        <path d="M200 150Q260 110 330 180" fill="none" stroke="#e9dcc3" strokeWidth="2" />
      </g>
      <g transform="translate(318 176) rotate(18)">
        <rect x="-26" y="-20" width="52" height="40" rx="3" fill="var(--color-tinta)" />
        <Logo variante="imagotipo" etiqueta={null} x={-20} y={-12} width={40} height={24} className="text-dorado" />
      </g>
    </svg>
  )
}
