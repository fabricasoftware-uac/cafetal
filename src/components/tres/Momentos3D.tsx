'use client'

import { useEffect, useRef, useState } from 'react'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

export const MODELOS_MOMENTO = ['mancuerna', 'portatil', 'mochila', 'hamaca'] as const

/*
 * El sachet de CaFETAL (Meshy) flota al frente y gira; detrás aparece el objeto del momento actual
 * (Meshy) con un salto, y el anterior se encoge y se va. El cambio de momento hace que el sachet dé
 * una voltereta. Three.js entra con import() al acercarse; sin WebGL queda el contenido de texto.
 */
export function Momentos3D({ momento }: { momento: number }) {
  const lienzo = useRef<HTMLDivElement>(null)
  const estado = useRef(momento)
  estado.current = momento
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const nodo = lienzo.current
    if (!nodo || prefiereMenosMovimiento()) return
    let cancelado = false
    let limpiar: (() => void) | null = null

    const montar = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (cancelado) return
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch {
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      nodo.appendChild(renderer.domElement)

      const escena = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      const camara = new THREE.PerspectiveCamera(30, 1, 0.01, 50)
      camara.position.set(0, 0.25, 5.4)
      camara.lookAt(0, 0, 0)
      const luz = new THREE.DirectionalLight('#ffe4bd', 2.4)
      luz.position.set(-2, 3, 3)
      const contra = new THREE.DirectionalLight('#e1b75d', 1.6)
      contra.position.set(3, 1, -2)
      escena.add(luz, contra, new THREE.AmbientLight('#3a2a1d', 0.7))

      const cargador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
      const normalizar = (o: InstanceType<typeof THREE.Object3D>, tam: number) => {
        const caja = new THREE.Box3().setFromObject(o)
        const t = caja.getSize(new THREE.Vector3())
        o.scale.setScalar(tam / Math.max(t.x, t.y, t.z))
        caja.setFromObject(o)
        const c = caja.getCenter(new THREE.Vector3())
        o.position.sub(c)
        const g = new THREE.Group()
        g.add(o)
        return g
      }
      const [gSachet, ...gObjetos] = await Promise.all([
        cargador.loadAsync('/3d/sachet.glb'),
        ...MODELOS_MOMENTO.map((m) => cargador.loadAsync(`/3d/${m}.glb`).catch(() => null)),
      ])
      if (cancelado) {
        renderer.dispose()
        return
      }
      const sachet = normalizar(gSachet.scene, 0.85)
      sachet.position.set(-0.75, 0, 0.6)
      escena.add(sachet)
      const objetos = gObjetos.map((g) => {
        if (!g) return null
        const o = normalizar(g.scene, 1.45)
        o.position.set(0.85, -0.05, -0.4)
        o.scale.setScalar(0.001)
        escena.add(o)
        return o
      })

      let mx = 0
      let my = 0
      const alMover = (e: PointerEvent) => {
        mx = e.clientX / window.innerWidth - 0.5
        my = e.clientY / window.innerHeight - 0.5
      }
      window.addEventListener('pointermove', alMover, { passive: true })
      const medir = () => {
        const { width, height } = nodo.getBoundingClientRect()
        renderer.setSize(width, height, false)
        camara.aspect = width / Math.max(1, height)
        camara.updateProjectionMatrix()
      }
      medir()
      const ro = new ResizeObserver(medir)
      ro.observe(nodo)
      let visible = false
      const io = new IntersectionObserver(([e]) => {
        visible = e?.isIntersecting ?? false
        if (visible) arrancar()
      })
      io.observe(nodo)

      let raf = 0
      let previo = performance.now()
      let t = 0
      let ultimo = -1
      let voltereta = 0
      const escalas = objetos.map(() => 0.001)
      const cuadro = (ahora: number) => {
        raf = 0
        if (!visible || document.hidden) return
        const dt = Math.min(0.05, (ahora - previo) / 1000)
        previo = ahora
        t += dt
        const m = estado.current
        if (m !== ultimo) {
          if (ultimo !== -1) voltereta = Math.PI * 2
          ultimo = m
        }
        // El sachet flota, gira y, al cambiar de momento, da una voltereta
        voltereta += (0 - voltereta) * Math.min(1, dt * 3)
        sachet.rotation.y = t * 0.6 + mx * 0.6
        sachet.rotation.x = voltereta + Math.sin(t * 0.9) * 0.12 + my * 0.3
        sachet.position.y = Math.sin(t * 1.3) * 0.08
        objetos.forEach((o, k) => {
          if (!o) return
          const objetivo = k === m ? 1 : 0.001
          escalas[k] = (escalas[k] ?? 0) + (objetivo - (escalas[k] ?? 0)) * Math.min(1, dt * (k === m ? 5 : 8))
          // rebote al llegar: se pasa un poco y vuelve
          const s = k === m ? escalas[k] * (1 + Math.sin(Math.min(1, escalas[k] ?? 0) * Math.PI) * 0.12) : escalas[k]
          o.scale.setScalar(Math.max(0.001, s ?? 0.001))
          o.rotation.y = t * 0.35 + mx * 0.4
          o.position.y = -0.05 + Math.sin(t * 1.1 + 1) * 0.05
          o.visible = (escalas[k] ?? 0) > 0.01
        })
        renderer.render(escena, camara)
        arrancar()
      }
      function arrancar() {
        if (!raf) {
          previo = performance.now()
          raf = requestAnimationFrame(cuadro)
        }
      }
      arrancar()
      setListo(true)
      limpiar = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener('pointermove', alMover)
        escena.traverse((o) => {
          const me = o as InstanceType<typeof THREE.Mesh>
          me.geometry?.dispose()
          const mats = Array.isArray(me.material) ? me.material : me.material ? [me.material] : []
          for (const mat of mats) mat.dispose()
        })
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }
    const vigia = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          vigia.disconnect()
          montar().catch(() => {})
        }
      },
      { rootMargin: '600px 0px' },
    )
    vigia.observe(nodo)
    return () => {
      cancelado = true
      vigia.disconnect()
      limpiar?.()
    }
  }, [])

  return <div ref={lienzo} aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${listo ? 'opacity-100' : 'opacity-0'}`} />
}
