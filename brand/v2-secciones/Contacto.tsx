import Image from 'next/image'
import { CONTACTO, enlaceWhatsApp } from '@/lib/sitio'

const PERFILES = ['Distribuidores', 'Aliados estratégicos', 'Embajadores'] as const

export function Contacto() {
  return (
    <section id="contacto" data-nav="oscuro" data-seccion className="relative h-[130svh] max-sm:h-auto">
      <div className="sticky top-0 h-svh overflow-hidden max-sm:relative max-sm:h-[70svh]">
        <Image
          src="/img/cafetal-pitalito.webp"
          alt="Montañas de Pitalito con café secándose al sol en el patio"
          fill
          quality={80}
          sizes="100vw"
          className="object-cover object-[50%_60%]"
          style={{ filter: 'brightness(.6) contrast(1.05)' }}
        />
      </div>
      <div className="absolute inset-0 max-sm:static">
        <div
          data-revelar
          className="sticky top-[96px] mr-[clamp(1rem,3.2vw,3rem)] ml-auto w-[380px] bg-espresso p-8 max-sm:mx-4 max-sm:-mt-20 max-sm:w-auto"
        >
          <h2 className="text-frase">Pide tu caja</h2>
          <p className="mt-5">
            Calle 7 Sur # 2E-32, La Isla
            <br />
            {CONTACTO.ciudad}
          </p>
          <dl className="mt-6 grid gap-2">
            {PERFILES.map((p) => (
              <div key={p} className="flex justify-between gap-4">
                <dt className="text-suave">{p}</dt>
                <dd>
                  <a href={enlaceWhatsApp(`Hola CaFETAL, me interesa ser parte de sus ${p.toLowerCase()}.`)} target="_blank" rel="noreferrer" className="enlace">
                    Escríbenos
                  </a>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 tabular-nums">{CONTACTO.telefonoVisible}</p>
          <a
            href={enlaceWhatsApp('Hola CaFETAL, quiero pedir una caja.')}
            target="_blank"
            rel="noreferrer"
            className="accion -mx-8 -mb-8 mt-8 flex h-[52px] w-[calc(100%+4rem)]"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
