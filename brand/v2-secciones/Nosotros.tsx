import Image from 'next/image'

const DATOS = [
  ['Origen', 'Pitalito, Huila'],
  ['Café', '100 % colombiano'],
  ['Formato', 'Sachet de 5 g'],
] as const

export function Nosotros() {
  return (
    <section id="nosotros" data-nav="oscuro" data-seccion className="marco py-[clamp(7rem,10vw,9rem)]">
      <div className="rejilla gap-y-10">
        <dl className="order-last col-span-12 grid grid-cols-3 gap-4 text-nota lg:order-none lg:col-span-2 lg:grid-cols-1 lg:content-start lg:gap-6 lg:pt-3">
          {DATOS.map(([clave, valor]) => (
            <div key={clave} data-revelar>
              <dt className="text-suave">{clave}</dt>
              <dd className="mt-1">{valor}</dd>
            </div>
          ))}
        </dl>

        <div className="col-span-12 lg:col-span-10 lg:col-start-3">
          <h2 data-revelar className="text-display">
            Quiénes somos
          </h2>
          <p data-revelar className="mt-10 max-w-[40ch] text-frase">
            <span className="relative float-left mt-[0.18em] mr-[0.5em] block size-[3.6em] overflow-hidden max-sm:size-[4.9em]">
              <Image
                src="/img/cerezas-cuadro.webp"
                alt="Cerezas de café maduras en la rama"
                fill
                quality={80}
                sizes="(min-width: 640px) 140px, 110px"
                className="object-cover"
              />
            </span>
            CaFETAL Group nació en Pitalito, Huila. Tostamos nuestro café de origen y lo guardamos en un sachet que se
            prepara como una infusión.
          </p>
        </div>

        <div className="col-span-12 grid gap-10 sm:grid-cols-2 lg:col-span-10 lg:col-start-3 lg:mt-6 lg:gap-[clamp(2rem,5vw,6rem)]">
          <div data-revelar className="grid content-start gap-6">
            <p>
              Queremos que el café de finca quepa en la vida de quien no tiene tiempo para una cafetera, y que el mundo nos
              reconozca por transformar la industria cafetera con modelos sostenibles y éticos.
            </p>
            <p>
              Nos mueven siete valores: sostenibilidad, innovación, equidad, transparencia, calidad, regeneración y
              propósito social.
            </p>
          </div>
          <div data-revelar="imagen" className="overflow-hidden">
            <Image
              src="/img/embajadora-taza.webp"
              alt="Embajadora de CaFETAL mostrando una taza con el sachet infusionándose"
              width={586}
              height={1080}
              quality={80}
              sizes="(min-width: 640px) 36vw, 92vw"
              className="aspect-[4/5] w-full object-cover object-[50%_30%]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
