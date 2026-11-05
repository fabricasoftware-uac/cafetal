import Image from 'next/image'
import { Ancla } from '@/components/navegacion/Ancla'
import { Logger } from '@/components/ui/Logger'
import { Pildora } from '@/components/ui/Pildora'
import { PRODUCTOS } from '@/lib/productos'

/** Grilla de los cinco cafés. Se usa en el inicio (resumen) y en /productos (completa). */
export function GrillaProductos({ titulo = true }: { titulo?: boolean }) {
  return (
    <section id="productos" data-nav="claro" className="bg-papel py-[clamp(6rem,9vw,8rem)] text-espresso">
      {titulo ? (
        <div className="marco text-center">
          <p className="titular text-subtitulo text-cafe">CaFETAL en casa</p>
          <h2 className="titular text-mega text-espresso">Productos</h2>
        </div>
      ) : null}
      <ul className="marco mx-auto mt-14 grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 lg:grid-cols-5">
        {PRODUCTOS.map((p, i) => (
          <li key={p.slug} data-revelar>
            <Ancla a={`/productos/${p.slug}`} className="group block text-center">
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[18px] shadow-[0_30px_50px_-30px_rgb(34_22_15/.7)] transition-transform duration-700 [transition-timing-function:var(--ease-salto)] group-hover:-translate-y-2 group-hover:-rotate-2" style={{ background: p.tarjeta }}>
                {p.recorte ? (
                  <Image src={p.recorte} alt={p.alt} fill quality={85} sizes="(min-width: 1024px) 20vw, 45vw" className="object-contain p-3 drop-shadow-[0_18px_18px_rgb(0_0_0/.4)] transition-transform duration-700 [transition-timing-function:var(--ease-salto)] group-hover:scale-110 group-hover:rotate-3" />
                ) : (
                  <Image src={p.foto} alt={p.alt} fill quality={75} sizes="(min-width: 1024px) 20vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-110" style={{ objectPosition: i === 0 ? '40% 50%' : '62% 50%' }} />
                )}
              </span>
              <span className="mt-5 block font-display text-nota text-cafe italic">{p.linea === 'Línea Tradicional' ? 'Línea Tradicional' : 'Premium By Gugo'}</span>
              <span className="mt-1 block text-[clamp(1.4rem,2vw,1.9rem)] leading-none">
                <Logger>{p.nombre}</Logger>
              </span>
              <span className="mt-1 block text-nota text-cafe">{p.corto}</span>
            </Ancla>
          </li>
        ))}
      </ul>
      {titulo ? (
        <div className="mt-14 text-center">
          <Pildora a="/productos">Ver todos los productos</Pildora>
        </div>
      ) : null}
    </section>
  )
}
