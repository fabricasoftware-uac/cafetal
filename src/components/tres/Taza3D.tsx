'use client'

import { useEffect, useRef, useState } from 'react'
import { prefiereMenosMovimiento } from '@/lib/movimiento'

interface Props {
  /** 0 = recién vertido, 1 = infusión terminada. */
  avance: number
  /** Color del líquido terminado (depende de lo que se vierte). */
  colorFinal: string
  /** El sachet está dentro de la taza (infusión en curso o terminada). */
  dentro: boolean
  /** Taza sin líquido (el ritual antes de verter). */
  vacia?: boolean
  /** Se pinta cuando la escena 3D está lista; hasta entonces se ve el póster. */
  alListo?: () => void
}

/*
 * Taza y sachet en 3D (modelos de Meshy, optimizados con gltf-transform: meshopt + WebP).
 * Three.js entra con import() dinámico solo cuando la sección se acerca (ADR-0002). Sin WebGL,
 * con error o con movimiento reducido no se monta nada y se queda el póster SVG.
 */
export function Taza3D({ avance, colorFinal, dentro, vacia = false, alListo }: Props) {
  const lienzo = useRef<HTMLDivElement>(null)
  const estado = useRef({ avance, colorFinal, dentro, vacia })
  estado.current = { avance, colorFinal, dentro, vacia }
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
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      } catch {
        return // sin WebGL: se queda el póster
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      nodo.appendChild(renderer.domElement)

      const escena = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      const camara = new THREE.PerspectiveCamera(28, 1, 0.01, 50)
      camara.position.set(0, 1.45, 2.55)
      camara.lookAt(0, 0.28, 0)

      // Luz cálida de ventana y un contraluz dorado: la taza sale de la oscuridad
      const clave = new THREE.DirectionalLight('#ffe4bd', 2.2)
      clave.position.set(-2, 3, 2)
      const contra = new THREE.DirectionalLight('#e1b75d', 1.4)
      contra.position.set(2.5, 1.2, -2)
      escena.add(clave, contra, new THREE.AmbientLight('#3a2a1d', 0.6))

      const cargador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
      const [gTaza, gSachet, gGrano] = await Promise.all([
        cargador.loadAsync('/3d/taza.glb'),
        cargador.loadAsync('/3d/sachet.glb'),
        cargador.loadAsync('/3d/grano.glb'),
      ])
      if (cancelado) {
        renderer.dispose()
        return
      }

      // Normaliza la taza: centrada, base en y = 0, 1 unidad de ancho
      const grupo = new THREE.Group()
      const taza = gTaza.scene
      const caja = new THREE.Box3().setFromObject(taza)
      const tam = caja.getSize(new THREE.Vector3())
      const escala = 1 / Math.max(tam.x, tam.z)
      taza.scale.setScalar(escala)
      caja.setFromObject(taza)
      const centro = caja.getCenter(new THREE.Vector3())
      taza.position.set(-centro.x, -caja.min.y, -centro.z)
      grupo.add(taza)
      const alto = caja.max.y - caja.min.y

      // Superficie del café: textura propia con la crema dorada hacia el borde y un remolino suave
      const lienzoCafe = document.createElement('canvas')
      lienzoCafe.width = lienzoCafe.height = 512
      const c2 = lienzoCafe.getContext('2d')
      if (c2) {
        const g = c2.createRadialGradient(256, 256, 20, 256, 256, 256)
        g.addColorStop(0, '#ffffff')
        g.addColorStop(0.62, '#f2e2d0')
        g.addColorStop(0.86, '#f7c98e')
        g.addColorStop(1, '#e9b27a')
        c2.fillStyle = g
        c2.fillRect(0, 0, 512, 512)
        c2.strokeStyle = 'rgba(255,240,220,.35)'
        c2.lineWidth = 6
        for (let k = 0; k < 3; k++) {
          c2.beginPath()
          for (let a = 0; a < Math.PI * 3; a += 0.05) {
            const rr = 40 + a * 22 + k * 14
            c2.lineTo(256 + Math.cos(a + k * 2) * rr, 256 + Math.sin(a + k * 2) * rr)
          }
          c2.stroke()
        }
      }
      const mapaCafe = new THREE.CanvasTexture(lienzoCafe)
      mapaCafe.colorSpace = THREE.SRGBColorSpace
      const liquido = new THREE.Mesh(
        new THREE.CircleGeometry(0.255, 64),
        // Poco reflejo del entorno: si no, el café se lava hacia el gris
        // Sin iluminación ni tone mapping: el color del café es exacto (la luz cenital lo lavaba a gris lila)
        new THREE.MeshBasicMaterial({ map: mapaCafe, color: '#8a5326', toneMapped: false }),
      )
      liquido.rotation.x = -Math.PI / 2
      liquido.position.set(-0.07, alto * 0.86, -0.02)
      grupo.add(liquido)

      // Sachet: arriba, esperando; baja a la taza cuando empieza la infusión
      const sachet = gSachet.scene
      const cajaS = new THREE.Box3().setFromObject(sachet)
      const tamS = cajaS.getSize(new THREE.Vector3())
      sachet.scale.setScalar(0.34 / tamS.y)
      cajaS.setFromObject(sachet)
      const centroS = cajaS.getCenter(new THREE.Vector3())
      const pivote = new THREE.Group()
      sachet.position.sub(centroS)
      pivote.add(sachet)
      pivote.position.set(-0.07, alto + 1.6, -0.02)
      grupo.add(pivote)
      // Tres granos sobre la mesa, junto al plato; el modelo sale claro y se lleva a tostado oscuro
      const grano = gGrano.scene
      const cajaG = new THREE.Box3().setFromObject(grano)
      grano.scale.setScalar(0.11 / cajaG.getSize(new THREE.Vector3()).x)
      grano.traverse((o) => {
        const m = (o as InstanceType<typeof THREE.Mesh>).material as InstanceType<typeof THREE.MeshStandardMaterial> | undefined
        if (m?.color) m.color.multiplyScalar(0.42)
      })
      for (const [x, z, giro] of [
        [0.56, 0.18, 0.4],
        [0.5, 0.42, 2.1],
        [-0.6, 0.36, 4.2],
      ] as const) {
        const copia = grano.clone()
        copia.position.set(x, 0.03, z)
        copia.rotation.set(Math.PI / 2.2, giro, 0)
        grupo.add(copia)
      }
      escena.add(grupo)

      // Vapor: sprites suaves que suben, se abren y se desvanecen; más vapor cuanto más lista está la taza
      const lienzoHumo = document.createElement('canvas')
      lienzoHumo.width = lienzoHumo.height = 128
      const h2 = lienzoHumo.getContext('2d')
      if (h2) {
        const g = h2.createRadialGradient(64, 64, 0, 64, 64, 64)
        g.addColorStop(0, 'rgba(255,248,240,.9)')
        g.addColorStop(0.45, 'rgba(255,248,240,.32)')
        g.addColorStop(1, 'rgba(255,248,240,0)')
        h2.fillStyle = g
        h2.fillRect(0, 0, 128, 128)
      }
      const mapaHumo = new THREE.CanvasTexture(lienzoHumo)
      const humos = Array.from({ length: 26 }, (_, k) => {
        const m = new THREE.SpriteMaterial({ map: mapaHumo, transparent: true, depthWrite: false, opacity: 0 })
        const sp = new THREE.Sprite(m)
        sp.userData = { fase: k / 26, deriva: (Math.random() - 0.5) * 0.18, giro: Math.random() * 6 }
        escena.add(sp)
        return sp
      })

      const colorAgua = new THREE.Color('#8a5326')
      const colorFin = new THREE.Color()
      const color = new THREE.Color()

      // Puntero: la taza gira hacia el cursor; en reposo, deriva lenta
      let objetivoGiro = 0
      let objetivoInclina = 0
      const alMover = (e: PointerEvent) => {
        const r = nodo.getBoundingClientRect()
        objetivoGiro = ((e.clientX - r.left) / r.width - 0.5) * 0.9
        objetivoInclina = ((e.clientY - r.top) / r.height - 0.5) * 0.25
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

      // El bucle solo corre con la taza a la vista y la pestaña activa (Gotchas → bucles infinitos)
      let visible = false
      const io = new IntersectionObserver(([e]) => {
        visible = e?.isIntersecting ?? false
        if (visible) arrancar()
      })
      io.observe(nodo)

      let raf = 0
      let previo = performance.now()
      let t = 0
      let ySachet = pivote.position.y
      const cuadro = (ahora: number) => {
        raf = 0
        if (!visible || document.hidden) return
        const dt = Math.min(0.05, (ahora - previo) / 1000)
        previo = ahora
        t += dt
        const { avance: a, colorFinal: cf, dentro: d, vacia: v } = estado.current

        grupo.rotation.y += (objetivoGiro + Math.sin(t * 0.35) * 0.12 - grupo.rotation.y) * Math.min(1, dt * 3)
        grupo.rotation.x += (objetivoInclina - grupo.rotation.x) * Math.min(1, dt * 3)

        // El sachet baja con un pequeño rebote y, dentro, se mece como al moverlo
        // En reposo la taza está servida: el sachet espera fuera de cuadro y solo baja al infusionar
        const destino = d ? alto * 0.78 + Math.sin(t * 2.1) * 0.025 : alto + 1.6
        ySachet += (destino - ySachet) * Math.min(1, dt * (d ? 4 : 2.5))
        pivote.position.y = ySachet
        pivote.visible = ySachet < alto + 1.2
        pivote.rotation.z = d ? Math.sin(t * 2.1) * 0.12 : Math.sin(t * 0.9) * 0.05
        pivote.rotation.y = t * 0.25

        colorFin.set(cf)
        color.copy(colorAgua).lerp(colorFin, a)
        ;(liquido.material as InstanceType<typeof THREE.MeshBasicMaterial>).color.copy(color)
        liquido.visible = !v && (d || a > 0)

        // El vapor sale del centro de la taza siguiendo su giro
        const intensidad = 0.35 + a * 0.65
        const origen = liquido.getWorldPosition(new THREE.Vector3())
        for (const sp of humos) {
          const u = sp.userData as { fase: number; deriva: number; giro: number }
          const f = (u.fase + t * 0.09) % 1
          sp.position.set(origen.x + Math.sin(f * 5 + u.giro) * 0.09 + u.deriva * f, origen.y + 0.04 + f * 0.85, origen.z + Math.cos(f * 4 + u.giro) * 0.05)
          sp.scale.setScalar(0.16 + f * 0.7)
          ;(sp.material as InstanceType<typeof THREE.SpriteMaterial>).opacity = Math.sin(f * Math.PI) ** 1.6 * (1 - f) * 0.95 * intensidad
          ;(sp.material as InstanceType<typeof THREE.SpriteMaterial>).rotation = u.giro + f * 1.4
        }

        renderer.render(escena, camara)
        arrancar()
      }
      function arrancar() {
        if (!raf) {
          previo = performance.now()
          raf = requestAnimationFrame(cuadro)
        }
      }
      const alCambiarPestana = () => !document.hidden && arrancar()
      document.addEventListener('visibilitychange', alCambiarPestana)
      arrancar()
      setListo(true)
      alListo?.()

      limpiar = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        window.removeEventListener('pointermove', alMover)
        document.removeEventListener('visibilitychange', alCambiarPestana)
        escena.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>
          m.geometry?.dispose()
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
          for (const mat of mats) mat.dispose()
        })
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    // Se monta cuando la sección se acerca, no al cargar la página
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
    // alListo es una notificación de una sola vez: no debe reiniciar la escena
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // El vapor sube más allá del lienzo: la máscara disuelve el borde para que no se vea el corte
  return (
    <div
      ref={lienzo}
      aria-hidden="true"
      className={`absolute inset-0 transition-opacity duration-700 ${listo ? 'opacity-100' : 'opacity-0'}`}
      style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, #000 30%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 30%)' }}
    />
  )
}
