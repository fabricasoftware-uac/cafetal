import type { Metadata } from 'next'
import { Pie } from '@/components/secciones/Pie'
import { SalonFama } from '@/components/secciones/SalonFama'

export const metadata: Metadata = {
  title: 'Productos · CaFETAL',
  description: 'Línea Tradicional y Premium Sabores By Gugo: anís, campesino, cardamomo y jengibre. Café 100 % colombiano en sachet.',
}

export default function PaginaProductos() {
  return (
    <>
      <main>
        <SalonFama principal />
      </main>
      <Pie />
    </>
  )
}
