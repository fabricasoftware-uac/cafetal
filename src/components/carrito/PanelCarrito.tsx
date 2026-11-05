'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { Logger } from '@/components/ui/Logger'
import { useCarrito } from '@/lib/carrito'
import { PRODUCTOS } from '@/lib/productos'

/** Panel lateral del pedido. El botón final abre WhatsApp con el detalle ya escrito. */
export function PanelCarrito() {
  const c = useCarrito()

  useEffect(() => {
    if (!c.abierto) return
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && c.cerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [c.abierto, c.cerrar])

  return (
    <div className={`fixed inset-0 z-[80] ${c.abierto ? '' : 'pointer-events-none'}`} aria-hidden={!c.abierto}>
      <button
        type="button"
        aria-label="Cerrar el pedido"
        tabIndex={c.abierto ? 0 : -1}
        onClick={c.cerrar}
        className={`absolute inset-0 bg-noche/60 transition-opacity duration-500 ${c.abierto ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        inert={!c.abierto}
        className={`absolute top-0 right-0 flex h-full w-[min(440px,100vw)] flex-col bg-espresso text-crema shadow-[-30px_0_60px_-30px_rgb(0_0_0/.8)] transition-transform duration-[650ms] [transition-timing-function:var(--ease-cafe)] ${
          c.abierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="titular text-[2.4rem] leading-none">
            Tu pedido <span className="menor">· {c.total}</span>
          </h2>
          <button type="button" onClick={c.cerrar} className="grid size-11 place-items-center rounded-full bg-tostado text-durazno transition-transform hover:rotate-90" aria-label="Cerrar">
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {c.lineas.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="titular text-[2rem]">Tu taza está vacía</p>
                <p className="mt-2 text-nota text-suave">Agrega una caja desde los sabores.</p>
              </div>
            </div>
          ) : (
            <ul className="grid gap-3 pb-6">
              {c.lineas.map((l) => {
                const p = PRODUCTOS.find((x) => x.slug === l.slug)
                if (!p) return null
                return (
                  <li key={l.slug} className="flex items-center gap-4 rounded-[18px] bg-noche/50 p-3">
                    <span className="relative size-[76px] shrink-0 overflow-hidden rounded-[12px]" style={{ background: p.tarjeta }}>
                      <Image src={p.recorte ?? p.foto} alt="" fill sizes="76px" className={p.recorte ? 'object-contain p-1.5' : 'object-cover'} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <Logger className="block text-[1.3rem] leading-none">{p.nombre}</Logger>
                      <span className="mt-1 block text-[0.8rem] text-suave">Caja de 20 sachets</span>
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-tostado p-1">
                      <button type="button" onClick={() => c.cambiar(l.slug, l.cajas - 1)} className="grid size-8 place-items-center rounded-full hover:bg-cafe" aria-label={`Quitar una caja de ${p.nombre}`}>
                        −
                      </button>
                      <span className="w-6 text-center tabular-nums">{l.cajas}</span>
                      <button type="button" onClick={() => c.cambiar(l.slug, l.cajas + 1)} className="grid size-8 place-items-center rounded-full hover:bg-cafe" aria-label={`Agregar una caja de ${p.nombre}`}>
                        +
                      </button>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <footer className="grid gap-3 border-t border-crema/10 px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="text-nota text-suave">Te confirmamos precio y envío por WhatsApp.</p>
          <a
            href={c.lineas.length ? c.enlacePedido() : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!c.lineas.length}
            className={`pildora pildora-llena w-full justify-between ${c.lineas.length ? '' : 'pointer-events-none opacity-40'}`}
          >
            <span>Pedir por WhatsApp</span>
            <span aria-hidden="true">→</span>
          </a>
          {c.lineas.length ? (
            <button type="button" onClick={c.vaciar} className="enlace justify-self-center text-nota text-suave">
              Vaciar el pedido
            </button>
          ) : null}
        </footer>
      </aside>
    </div>
  )
}

/** Botón "Agregar al pedido": la caja vuela hacia el carrito de la barra. */
export function BotonAgregar({ slug, tono = 'llena', className }: { slug: string; tono?: 'llena' | 'linea' | 'oscura'; className?: string }) {
  const c = useCarrito()
  return (
    <button
      type="button"
      onClick={(e) => {
        c.agregar(slug)
        volarAlCarrito(e.currentTarget, slug)
      }}
      className={`pildora ${tono === 'llena' ? 'pildora-llena' : tono === 'oscura' ? 'pildora-oscura' : ''} ${className ?? ''}`}
    >
      <span>Agregar al pedido</span>
      <span aria-hidden="true">+</span>
    </button>
  )
}

function volarAlCarrito(origen: Element, slug: string) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const destino = document.querySelector('[data-carrito]')
  const p = PRODUCTOS.find((x) => x.slug === slug)
  if (!destino || !p) return
  const a = origen.getBoundingClientRect()
  const b = destino.getBoundingClientRect()
  const n = document.createElement('img')
  n.src = p.recorte ?? p.foto
  n.alt = ''
  n.style.cssText = `position:fixed;z-index:85;pointer-events:none;width:90px;left:${a.left + a.width / 2 - 45}px;top:${a.top - 40}px;object-fit:contain;filter:drop-shadow(0 10px 12px rgb(0 0 0/.5))`
  document.body.appendChild(n)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top - 40 + 35)
  n.animate(
    [
      { transform: 'translate(0,0) scale(1) rotate(0)' },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 120}px) scale(.8) rotate(-20deg)`, offset: 0.5 },
      { transform: `translate(${dx}px,${dy}px) scale(.15) rotate(-40deg)`, opacity: 0.4 },
    ],
    { duration: 850, easing: 'cubic-bezier(.65,0,.35,1)' },
  ).onfinish = () => n.remove()
}
