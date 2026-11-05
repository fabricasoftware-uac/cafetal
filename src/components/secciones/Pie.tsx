import { LogoVivo } from '@/components/marca/LogoVivo'
import { Ancla } from '@/components/navegacion/Ancla'
import { Logger } from '@/components/ui/Logger'
import { Pildora } from '@/components/ui/Pildora'
import { PRODUCTOS } from '@/lib/productos'
import { CONTACTO, enlaceWhatsApp } from '@/lib/sitio'

const PERFILES = [
  ['Distribuidor', 'Lleva CaFETAL a tu ciudad o a tu tienda.'],
  ['Aliado', 'Hoteles, oficinas, eventos y empresas.'],
  ['Embajador', 'Comparte el café colombiano a tu manera.'],
] as const
const EXPLORA = [
  ['Quiénes somos', '#nosotros'],
  ['El ciclo del café', '#ciclo'],
  ['Tu taza', '#taza'],
  ['El ritual', '#ritual'],
  ['Impacto', '#impacto'],
] as const

/*
 * El cierre de la página. Los créditos de los videos de Pexels irán en una página aparte (pendiente del cliente).
 */
export function Pie() {
  return (
    <footer id="pie" className="pie relative z-50 bg-noche pt-[clamp(7rem,10vw,9rem)] text-durazno">
      <div id="contacto" className="marco grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <h2 className="titular text-[clamp(5rem,15vw,15rem)] leading-[0.92]">
          ¿Un
          <br />
          café?
        </h2>
        <div>
          <p className="max-w-[40ch] text-frase">Conviértete en parte de una nueva forma de disfrutar el café colombiano.</p>
          <ul className="mt-8 grid gap-2">
            {PERFILES.map(([perfil, texto]) => (
              <li key={perfil}>
                <a
                  href={enlaceWhatsApp(`Hola CaFETAL, quiero ser ${perfil.toLowerCase()}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-6 rounded-[18px] bg-espresso px-6 py-4 transition-colors duration-300 hover:bg-dorado hover:text-tinta"
                >
                  <span>
                    <span className="titular block text-[1.9rem] leading-none text-inherit group-hover:text-tinta">Quiero ser {perfil.toLowerCase()}</span>
                    <span className="mt-1 block text-nota opacity-75">{texto}</span>
                  </span>
                  <span aria-hidden="true" className="text-xl transition-transform duration-500 [transition-timing-function:var(--ease-salto)] group-hover:translate-x-1 group-hover:-rotate-[35deg]">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Pildora href={enlaceWhatsApp('Hola CaFETAL, quiero pedir una caja.')}>Pedir por WhatsApp</Pildora>
          </div>
        </div>
      </div>

      <div className="marco mt-[clamp(5rem,8vw,7rem)] grid gap-10 sm:grid-cols-3">
        <nav aria-label="Explora">
          <p className="titular text-[1.5rem]">Explora</p>
          <ul className="mt-4 grid gap-1.5">
            {EXPLORA.map(([n, a]) => (
              <li key={a}>
                <Ancla a={a} className="enlace decoration-transparent hover:decoration-current">
                  {n}
                </Ancla>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Productos">
          <p className="titular text-[1.5rem]">Productos</p>
          <ul className="mt-4 grid gap-1.5">
            {PRODUCTOS.map((p) => (
              <li key={p.slug}>
                <Ancla a={`/productos/${p.slug}`} className="transition-colors hover:text-dorado">
                  <Logger>{p.nombre}</Logger>
                </Ancla>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="titular text-[1.5rem]">Hablemos</p>
          <ul className="mt-4 grid gap-1.5">
            <li>
              <a href={enlaceWhatsApp('Hola CaFETAL.')} target="_blank" rel="noreferrer" className="enlace">
                WhatsApp {CONTACTO.telefonoVisible}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACTO.correo}`} className="enlace">
                {CONTACTO.correo}
              </a>
            </li>
            <li>Calle 7 Sur # 2E-32, La Isla</li>
            <li>{CONTACTO.ciudad}</li>
          </ul>
        </div>
      </div>

      {/* El nombre vuelve a todo lo ancho */}
      <div className="marco mt-[clamp(5rem,8vw,7rem)] flex justify-center text-dorado">
        <LogoVivo className="w-[min(78vw,620px)]" />
      </div>

      <div className="marco mt-14 grid gap-2 border-crema/10 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[0.8rem] text-suave sm:grid-cols-[1fr_auto]">
        <p>© {new Date().getFullYear()} CaFETAL Group · De la tradición a la innovación.</p>
        <p>
          Creado por <span className="text-durazno">Fábrica de Software</span> · Powered by <span className="text-durazno">EmprendeLab</span>
        </p>
      </div>
    </footer>
  )
}
