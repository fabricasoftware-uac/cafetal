import Image from 'next/image'
import { Logger } from '@/components/ui/Logger'
import { SonidosRitual } from './SonidosRitual'

// Los cuatro pasos del brochure ("4 pasos para disfrutar un café excepcional")
const PASOS = [
  { verbo: 'Abre', texto: 'Rasga el sobre exterior y saca el sachet de café.', src: '/img/caja-sachet.webp', alt: 'Caja y sobre negros de CaFETAL con el logo dorado', pos: '50% 40%' },
  { verbo: 'Coloca', texto: 'Ponlo dentro de la taza, con la etiqueta colgando por fuera.', src: '/img/sachet-taza.webp', alt: 'Taza blanca con un sachet de CaFETAL dentro', pos: '35% 50%' },
  { verbo: 'Vierte', texto: '100 ml de agua caliente, leche caliente o tu licor favorito.', src: '/img/taza-dorada.webp', alt: 'Café salpicando en una taza dorada con el sachet', pos: '50% 45%' },
  { verbo: 'Infusiona', texto: 'Mueve el sachet de dos a tres minutos. Déjalo en la taza y disfruta.', src: '/img/embajadora-brochure.webp', alt: 'Mujer sonriendo con una taza de café de CaFETAL', pos: '50% 25%' },
] as const

export function Ritual() {
  return (
    <section id="ritual" data-nav="oscuro" data-seccion aria-labelledby="ritual-titulo">
      <h2 id="ritual-titulo" className="sr-only">
        El ritual: abre, coloca, vierte, infusiona
      </h2>
      {PASOS.map((p) => (
        <div key={p.verbo} data-paso className="relative flow-root h-svh overflow-clip">
          <Image
            src={p.src}
            alt={p.alt}
            fill
            quality={80}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: p.pos, filter: 'brightness(.4) contrast(1.05) saturate(.85)' }}
          />
          {/* El verbo queda fijo al centro mientras su foto pasa detrás; el siguiente lo empuja */}
          <p
            aria-hidden="true"
            className="sticky top-[calc(50svh-0.42em)] mt-[calc(50svh-0.42em)] text-center text-mega text-crema max-sm:text-[22vw]"
          >
            <Logger>{p.verbo}</Logger>
          </p>
          <p className="absolute bottom-[clamp(1rem,3.2vw,3rem)] left-[clamp(1rem,3.2vw,3rem)] max-w-[34ch] bg-negro/80 px-5 py-4 text-cuerpo text-crema max-sm:right-4">
            {p.texto}
          </p>
        </div>
      ))}
      <SonidosRitual />
    </section>
  )
}
