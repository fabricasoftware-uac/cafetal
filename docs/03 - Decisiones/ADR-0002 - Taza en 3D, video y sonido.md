---
tipo: adr
numero: 0002
estado: aceptada
fecha: 2026-11-03
proyecto: CaFETAL
---

# ADR-0002: Taza 3D con Three.js, video de fondo y efectos de sonido

## Contexto
El cliente pidió "más poder": una taza de café en 3D protagonista con humo, videos de café de fondo y efectos de sonido. Three.js no está en el stack estándar.

## Decisión
- **Three.js vanilla** (0.187), con `import()` dinámico solo cuando la sección `#taza` se acerca (600 px). Mismo patrón que Pixeles (ADR-0002 de ese proyecto). Componente: `src/components/tres/Taza3D.tsx`.
  - Modelos de **Meshy** (texto → 3D, refinado PBR): taza, sachet, grano. Optimizados con `@gltf-transform/cli` (meshopt + texturas WebP 1024/512): 5,7 MB → 400 KB, 8,8 MB → 552 KB, 6,4 MB → 264 KB. Originales en `brand/3d-originales/`.
  - Café: disco con textura de canvas (crema hacia el borde) en `MeshBasicMaterial` sin tone mapping. Vapor: 26 sprites.
  - Bucle solo con la taza a la vista y la pestaña activa; `setPixelRatio(min(dpr, 1.75))`; sin WebGL o con movimiento reducido queda un póster.
- **Video** de Pexels (licencia Pexels): recortado a 10 s, 1280 px, H.264 CRF 30, sin audio, `faststart`. `preload="none"` y pausa fuera de pantalla (`ui/VideoFondo.tsx`). Créditos en `public/video/creditos.json` y en el pie.
- **Sonido** de ElevenLabs (texto → efecto), normalizado a -20 LUFS con ffmpeg. **Apagado por defecto**, interruptor en la barra, preferencia en localStorage (`lib/sonido.tsx`).
- **Ilustraciones** de las fichas generadas con Magnific (estilo serigrafía sobre negro), recortadas por luminancia a WebP con alfa (`public/ilustraciones/`).

## Consecuencias
- Coste diferido ≈ 150 KB gzip de Three.js + 1,2 MB de modelos, solo si se llega a `#taza`.
- Las claves (Meshy, ElevenLabs, Pexels) viven en `.env.local` (ignorado por git) y solo las usan los scripts de `scripts/`. El cliente dijo que las cambiaría al terminar: **rotarlas**.
- Regenerar recursos: `node scripts/meshy.mjs`, `node scripts/sonidos.mjs`, `node scripts/pexels-video.mjs <id> <nombre>`.
