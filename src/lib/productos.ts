import type { TemaNav } from '@/components/navegacion/temas'

export interface Producto {
  slug: string
  nombre: string
  linea: 'Línea Tradicional' | 'Premium Sabores By Gugo'
  tema: TemaNav
  color: string
  /** Color de las ilustraciones y acentos de la ficha. */
  acento: string
  corto: string
  texto: string
  notas: string[]
  beneficios: string[]
  foto: string
  alt: string
  /** Caja recortada sin fondo (Magnific). Si falta, se usa `foto` dentro de la tarjeta. */
  recorte?: string
  /** Color plano de la tarjeta del carrusel y del campo de la ficha. */
  tarjeta: string
  /** Perfil de taza, sobre 10. MUESTRA: pendiente de la ficha de catación del cliente. */
  perfil: { balance: number; acidez: number; intensidad: number; cuerpo: number; aroma: number }
  /** Notas sensoriales (suman 100). MUESTRA: pendiente del cliente. */
  sensorial: { nombre: string; img: string; pct: number }[]
  /** Ingredientes que salen volando al elegir el sabor en "Tu taza". */
  particulas: string[]
}

/* Textos del brochure 2026 (resumidos). Los beneficios son los que el cliente publica en su brochure. */
export const PRODUCTOS: Producto[] = [
  {
    slug: 'tradicional',
    nombre: 'Tradicional',
    linea: 'Línea Tradicional',
    tema: 'oscuro',
    color: 'var(--color-tostado)',
    acento: '#e1b75d',
    corto: 'El café de origen de siempre',
    texto:
      'La Línea Tradicional captura la esencia del verdadero café de origen colombiano: un perfil clásico, equilibrado y profundamente aromático. Cuerpo medio, notas limpias y un carácter estable que honra su origen.',
    notas: ['Cuerpo medio', 'Notas limpias', '100 % colombiano'],
    beneficios: ['Energizante natural', 'Alto contenido nutricional', 'Activa tu mente', 'Sabor auténtico de origen'],
    foto: '/img/caja-tradicional.webp',
    alt: 'Caja negra de CaFETAL Línea Tradicional con un sachet',
    recorte: '/img/recortes/tradicional-4.webp',
    tarjeta: '#2b1d14',
    perfil: { balance: 9, acidez: 4, intensidad: 8, cuerpo: 7, aroma: 8 },
    sensorial: [{ nombre: 'Chocolate', img: 'chocolate', pct: 34 }, { nombre: 'Panela', img: 'panela', pct: 26 }, { nombre: 'Frutos secos', img: 'nueces', pct: 24 }, { nombre: 'Cítricos', img: 'citricos', pct: 16 }],
    particulas: ['granos', 'chocolate', 'panela'],
  },
  {
    slug: 'anis',
    nombre: 'Anís',
    linea: 'Premium Sabores By Gugo',
    tema: 'anis',
    color: 'var(--color-anis)',
    acento: '#e8a23b',
    corto: 'Herbal, dulce y licoroso',
    texto:
      'Una fusión exótica que combina la intensidad del café con el carácter dulce, herbal y ligeramente licoroso del anís. Su aroma profundo evoca tradición y calidez: se respira, se siente y se disfruta lentamente.',
    notas: ['Herbal', 'Licoroso', 'Envolvente'],
    beneficios: ['Estimula suavemente el apetito', 'Sensación cálida que reconforta', 'Efecto calmante', 'Estimula la digestión'],
    foto: '/img/sabor-anis.webp',
    alt: 'Caja roja de CaFETAL sabor anís con anís estrellado',
    recorte: '/img/recortes/anis-4.webp',
    tarjeta: '#9b1f25',
    perfil: { balance: 8, acidez: 4, intensidad: 7, cuerpo: 6, aroma: 9 },
    sensorial: [{ nombre: 'Anís', img: 'anis', pct: 38 }, { nombre: 'Panela', img: 'panela', pct: 24 }, { nombre: 'Chocolate', img: 'chocolate', pct: 22 }, { nombre: 'Cítricos', img: 'citricos', pct: 16 }],
    particulas: ['anis', 'granos', 'anis'],
  },
  {
    slug: 'campesino',
    nombre: 'Campesino',
    linea: 'Premium Sabores By Gugo',
    tema: 'campesino',
    color: 'var(--color-campesino)',
    acento: '#e9b26a',
    corto: 'Clavos y canela de finca',
    texto:
      'Homenaje al café de finca colombiano: el de las abuelas, el que perfumaba la cocina y reunía a la familia alrededor del fogón. Clavos y canela con la dulzura envolvente de lo que sabe a hogar, a campo y a tradición viva.',
    notas: ['Clavo', 'Canela', 'Sabe a hogar'],
    beneficios: ['Actúa como antioxidante natural', 'Fortalece el sistema inmunológico', 'Sensación térmica en el frío', 'Ayuda a la digestión'],
    foto: '/img/sabor-campesino.webp',
    alt: 'Caja café de CaFETAL sabor campesino con canela y clavos',
    recorte: '/img/recortes/campesino-4.webp',
    tarjeta: '#7a4526',
    perfil: { balance: 8, acidez: 3, intensidad: 8, cuerpo: 8, aroma: 9 },
    sensorial: [{ nombre: 'Canela y clavo', img: 'canela', pct: 36 }, { nombre: 'Panela', img: 'panela', pct: 26 }, { nombre: 'Frutos secos', img: 'nueces', pct: 22 }, { nombre: 'Chocolate', img: 'chocolate', pct: 16 }],
    particulas: ['canela', 'granos', 'panela'],
  },
  {
    slug: 'cardamomo',
    nombre: 'Cardamomo',
    linea: 'Premium Sabores By Gugo',
    tema: 'cardamomo',
    color: 'var(--color-cardamomo)',
    acento: '#bfe07a',
    corto: 'Especiado, fresco, elegante',
    texto:
      'Una fusión aromática única: la intensidad del café se equilibra con las notas cálidas y especiadas del cardamomo, creando una bebida envolvente y elegante que despierta los sentidos desde el primer sorbo.',
    notas: ['Especiado', 'Fresco', 'Elegante'],
    beneficios: ['Favorece la digestión', 'Aporta antioxidantes', 'Ayuda a refrescar el aliento', 'Estimula la claridad mental'],
    foto: '/img/sabor-cardamomo.webp',
    alt: 'Caja verde de CaFETAL sabor cardamomo con vainas',
    recorte: '/img/recortes/cardamomo-4.webp',
    tarjeta: '#1f5a3d',
    perfil: { balance: 8, acidez: 5, intensidad: 7, cuerpo: 6, aroma: 9 },
    sensorial: [{ nombre: 'Cardamomo', img: 'cardamomo', pct: 36 }, { nombre: 'Cítricos', img: 'citricos', pct: 26 }, { nombre: 'Panela', img: 'panela', pct: 20 }, { nombre: 'Frutos secos', img: 'nueces', pct: 18 }],
    particulas: ['cardamomo', 'granos', 'citricos'],
  },
  {
    slug: 'jengibre',
    nombre: 'Jengibre',
    linea: 'Premium Sabores By Gugo',
    tema: 'jengibre',
    color: 'var(--color-jengibre)',
    acento: '#2b1a10',
    corto: 'Picante suave y vital',
    texto:
      'Una explosión de sabor y vitalidad en cada sorbo: café recién preparado con el toque picante y vigorizante del jengibre, de notas terrosas y ligeramente cítricas, que despierta tus sentidos desde el primer instante.',
    notas: ['Picante suave', 'Cítrico', 'Vital'],
    beneficios: ['Reduce inflamaciones', 'Ayuda a mejorar la digestión', 'Fortalece el sistema inmune', 'Potencia la concentración'],
    foto: '/img/sabor-jengibre.webp',
    alt: 'Caja ocre de CaFETAL sabor jengibre con raíz de jengibre',
    recorte: '/img/recortes/jengibre-4.webp',
    tarjeta: '#c99239',
    perfil: { balance: 7, acidez: 5, intensidad: 8, cuerpo: 6, aroma: 8 },
    sensorial: [{ nombre: 'Jengibre', img: 'jengibre', pct: 38 }, { nombre: 'Cítricos', img: 'citricos', pct: 24 }, { nombre: 'Panela', img: 'panela', pct: 22 }, { nombre: 'Chocolate', img: 'chocolate', pct: 16 }],
    particulas: ['jengibre', 'granos', 'citricos'],
  },
]

export function producto(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug)
}
