import type { Metadata, Viewport } from 'next'
import { Big_Shoulders, Fraunces } from 'next/font/google'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { Intro } from '@/components/intro/Intro'
import { Barra } from '@/components/navegacion/Barra'
import { FinTransicion } from '@/components/navegacion/Ancla'
import { BotonArriba } from '@/components/navegacion/BotonArriba'
import { CursorGrano } from '@/components/ui/CursorGrano'
import { ScrollSuave } from '@/components/proveedores/ScrollSuave'
import { Revelados } from '@/components/ui/Movimiento'
import { ProveedorInfusion } from '@/lib/infusion'
import { ProveedorCarrito } from '@/lib/carrito'
import { PanelCarrito } from '@/components/carrito/PanelCarrito'
import { ProveedorSonido } from '@/lib/sonido'
import './globals.css'

// Fraunces variable: se omite `weight` para conservar los ejes SOFT y WONK (Gotchas → next/font)
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})
// Titulares condensados (ADR-0001)
const bigShoulders = Big_Shoulders({ subsets: ['latin'], weight: 'variable', variable: '--font-big-shoulders', display: 'swap' })
// LOGGER, tipografía secundaria del manual. Licencia web pendiente de compra (docs/04 - Pendientes)
const logger = localFont({ src: './fuentes/logger.woff2', variable: '--font-logger-local', display: 'swap' })

export const metadata: Metadata = {
  title: 'CaFETAL · Café tostado y molido de Pitalito, Huila',
  description:
    'Café 100 % colombiano de Pitalito, Huila, tostado y molido en sachet. Línea Tradicional y Premium Sabores By Gugo. De la tradición a la innovación.',
}

export const viewport: Viewport = { themeColor: '#22160f' }

/*
 * Antes del primer pintado: decide si la intro se muestra (una vez por sesión, nunca con movimiento
 * reducido) y marca `mov` para que el revelado por scroll oculte de entrada lo que va a animar.
 */
const decidir = `try{var h=document.documentElement,r=matchMedia('(prefers-reduced-motion: reduce)').matches,v=sessionStorage.getItem('cafetal:intro')||/[?&]intro=no/.test(location.search);h.dataset.intro=(r||v)?'no':'si';if(!r){h.classList.add('mov');if(!v)sessionStorage.setItem('cafetal:intro','1')}}catch(e){document.documentElement.dataset.intro='no'}`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO" className={`${fraunces.variable} ${bigShoulders.variable} ${logger.variable}`} suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: script estático propio */}
        <script dangerouslySetInnerHTML={{ __html: decidir }} />
      </head>
      <body>
        <ScrollSuave>
          <ProveedorSonido>
            <ProveedorCarrito>
            <ProveedorInfusion>
              <Intro />
              <Barra />
              {children}
              <BotonArriba />
              <CursorGrano />
              <FinTransicion />
              <Revelados />
              <PanelCarrito />
            </ProveedorInfusion>
            </ProveedorCarrito>
          </ProveedorSonido>
        </ScrollSuave>
      </body>
    </html>
  )
}
