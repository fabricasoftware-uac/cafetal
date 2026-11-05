import { Logo } from '@/components/marca/Logo'
import { EnlaceSeccion } from '@/components/ui/EnlaceSeccion'
import { CONTACTO, enlaceWhatsApp, SECCIONES } from '@/lib/sitio'

/*
 * El cierre: la barra de navegación baja como un telón dorado hasta cubrir la pantalla (Navbar)
 * y este contenido aparece sobre ella. Sin movimiento, el pie es dorado por sí mismo.
 */
export function Pie() {
  return (
    <footer id="pie" data-nav="dorado" className="pie relative z-50 flex min-h-svh flex-col bg-dorado pt-[108px] text-tinta">
      <div className="marco rejilla flex-1 content-center gap-y-12">
        <div className="col-span-12 lg:col-span-7">
          <Logo variante="completo" className="h-[min(52svh,560px)] w-auto max-w-full" />
        </div>
        <div className="col-span-12 grid content-center gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <nav aria-label="Pie de página">
            <ul className="grid gap-1 text-frase">
              {SECCIONES.map((s) => (
                <li key={s.id}>
                  <EnlaceSeccion destino={s.id} className="inline-block transition-transform duration-500 [transition-timing-function:var(--ease-salto)] hover:translate-x-2">
                    {s.nombre}
                  </EnlaceSeccion>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-1">
            <a href={enlaceWhatsApp('Hola CaFETAL.')} target="_blank" rel="noreferrer" className="enlace w-fit">
              WhatsApp {CONTACTO.telefonoVisible}
            </a>
            <a href={`mailto:${CONTACTO.correo}`} className="enlace w-fit">
              {CONTACTO.correo}
            </a>
            <p>{CONTACTO.ciudad}</p>
          </div>
        </div>
      </div>
      <div className="marco grid gap-2 py-8 text-nota sm:grid-cols-[1fr_auto]">
        <p>© {new Date().getFullYear()} CaFETAL Group · Café 100 % colombiano</p>
        <p>De la tradición a la innovación.</p>
      </div>
    </footer>
  )
}
