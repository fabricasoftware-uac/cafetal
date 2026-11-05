import { Ciclo } from '@/components/secciones/Ciclo'
import { Impacto } from '@/components/secciones/Impacto'
import { Pie } from '@/components/secciones/Pie'
import { Pitalito } from '@/components/secciones/Pitalito'
import { Portada } from '@/components/secciones/Banner'
import { CintaSabores } from '@/components/secciones/Portada'
import { SalonFama } from '@/components/secciones/SalonFama'
import { Ritual } from '@/components/secciones/Ritual'
import { TuTaza } from '@/components/secciones/TuTaza'

export default function Inicio() {
  return (
    <>
      <main>
        <Portada />
        <CintaSabores />
        <Pitalito />
        <Ciclo />
        <TuTaza />
        <Ritual />
        <SalonFama />
        <Impacto />
      </main>
      <Pie />
    </>
  )
}
