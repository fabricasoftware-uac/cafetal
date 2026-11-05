'use client'

interface Props {
  abierto: boolean
  alPulsar: () => void
  /** Fondo claro debajo: el botón se invierte para no perder contraste. */
  claro: boolean
}

/*
 * Hamburguesa "de cuchara": tres líneas de distinto largo que, al pasar el ratón, se mueven como
 * al revolver una taza y sueltan vapor. Abierto, las líneas de los extremos forman la X.
 */
export function BotonMenu({ abierto, alPulsar, claro }: Props) {
  const linea = 'absolute left-1/2 h-[2px] rounded-full bg-current transition-transform duration-500'
  return (
    <button
      type="button"
      onClick={alPulsar}
      aria-expanded={abierto}
      aria-controls="menu-cafe"
      aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
      className={`group relative flex h-12 items-center gap-3 rounded-full pr-1.5 pl-4 transition-colors duration-500 ${
        abierto ? 'bg-dorado text-tinta' : claro ? 'bg-tinta text-crema' : 'bg-crema text-tinta'
      }`}
    >
      {/* Las dos palabras en la misma celda: el ancho es el de la más larga y "Cerrar" no se corta */}
      <span className="hidden overflow-hidden text-nota sm:grid" aria-hidden="true">
        <span
          className={`[grid-area:1/1] transition-transform duration-500 [transition-timing-function:var(--ease-cafe)] ${abierto ? '-translate-y-full' : ''}`}
        >
          Menú
        </span>
        <span
          className={`[grid-area:1/1] transition-transform duration-500 [transition-timing-function:var(--ease-cafe)] ${abierto ? '' : 'translate-y-full'}`}
        >
          Cerrar
        </span>
      </span>

      <span className="relative block size-9" aria-hidden="true">
        {/* vapor que sale al pasar el ratón */}
        <svg
          viewBox="0 0 24 14"
          className={`absolute -top-3 left-1/2 w-5 -translate-x-1/2 fill-none stroke-current transition-[opacity,transform] duration-500 ${
            abierto ? 'opacity-0' : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-70'
          }`}
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M7 13c-3-3 3-5 0-9" />
          <path d="M12 13c-3-3 3-6 0-11" />
          <path d="M17 13c-3-3 3-5 0-9" />
        </svg>
        <span
          className={`${linea} top-[11px] w-[18px] -translate-x-1/2 [transition-timing-function:var(--ease-salto)] ${
            abierto ? 'translate-y-[6px] rotate-45' : 'group-hover:-translate-x-[3px]'
          }`}
        />
        <span
          className={`${linea} top-[17px] w-[12px] -translate-x-[2px] [transition-timing-function:var(--ease-salto)] ${
            abierto ? 'scale-x-0' : 'group-hover:-translate-x-[9px]'
          }`}
        />
        <span
          className={`${linea} top-[23px] w-[18px] -translate-x-1/2 [transition-timing-function:var(--ease-salto)] ${
            abierto ? '-translate-y-[6px] -rotate-45' : 'group-hover:-translate-x-[13px]'
          }`}
        />
      </span>
    </button>
  )
}
