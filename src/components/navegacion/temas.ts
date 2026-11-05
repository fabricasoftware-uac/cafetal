/** Tema de cada sección (`data-nav`). La navbar toma el fondo de la sección que tiene debajo. */
export type TemaNav = 'oscuro' | 'crema' | 'verde' | 'dorado' | 'anis' | 'campesino' | 'cardamomo' | 'jengibre'

export const TEMAS: Record<TemaNav, { fondo: string; tinta: string; logo: string; claro: boolean }> = {
  oscuro: { fondo: 'var(--color-negro)', tinta: 'var(--color-crema)', logo: 'var(--color-dorado)', claro: false },
  crema: { fondo: 'var(--color-papel)', tinta: 'var(--color-tinta)', logo: 'var(--color-tinta)', claro: true },
  verde: { fondo: 'var(--color-verde)', tinta: 'var(--color-crema)', logo: 'var(--color-dorado)', claro: false },
  dorado: { fondo: 'var(--color-dorado)', tinta: 'var(--color-tinta)', logo: 'var(--color-tinta)', claro: true },
  anis: { fondo: 'var(--color-anis)', tinta: 'var(--color-crema)', logo: 'var(--color-dorado)', claro: false },
  campesino: { fondo: 'var(--color-campesino)', tinta: 'var(--color-crema)', logo: 'var(--color-dorado)', claro: false },
  cardamomo: { fondo: 'var(--color-cardamomo)', tinta: 'var(--color-crema)', logo: 'var(--color-dorado)', claro: false },
  jengibre: { fondo: 'var(--color-jengibre)', tinta: 'var(--color-tinta)', logo: 'var(--color-tinta)', claro: true },
}

export const LISTA_TEMAS = Object.keys(TEMAS) as TemaNav[]
