import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FichaPortada } from '@/components/productos/FichaPortada'
import { BannerVideo, Intensidad, Preparacion, RuedaSensorial, TePuedeGustar } from '@/components/productos/SeccionesFicha'
import { Pie } from '@/components/secciones/Pie'
import { PRODUCTOS, producto } from '@/lib/productos'

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ sabor: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ sabor: string }> }): Promise<Metadata> {
  const p = producto((await params).sabor)
  return p ? { title: `${p.nombre} · CaFETAL`, description: p.texto } : {}
}

export default async function Ficha({ params }: { params: Promise<{ sabor: string }> }) {
  const p = producto((await params).sabor)
  if (!p) notFound()
  return (
    <>
      <main>
        <FichaPortada p={p} />
        <Intensidad p={p} />
        <RuedaSensorial p={p} />
        <Preparacion />
        <TePuedeGustar p={p} />
        <BannerVideo p={p} />
      </main>
      <Pie />
    </>
  )
}
