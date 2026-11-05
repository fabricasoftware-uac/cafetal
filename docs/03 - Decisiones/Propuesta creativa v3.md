---
tipo: decisión
estado: en construcción
creado: 2026-11-03
---

# Propuesta creativa v3 — CaFETAL

La v1 (genérica) y la v2 ("dark room") fueron rechazadas: aburridas, poco elegantes. El cliente mandó referencias de una web de café de nivel premio (composición, no marca: **referencia no es copia**; ni nombres, ni textos, ni imágenes de terceros).

## Lo que el cliente pidió (ronda 3)

1. Portada con **video de café** a pantalla completa (Pexels).
2. **Sin menú hamburguesa**: barra con menús desplegables con tarjetas de imagen al pasar el ratón.
3. Sección de historia: titular enorme y condensado, fotos inclinadas alrededor.
4. Sección con **video de fondo** y elementos de café que se mueven con el ratón.
5. Sección de impacto con ornamento de línea que aparece y se anima al bajar.
6. **Línea que se va trazando** al bajar entre capítulos con video.
7. **Productos**: página de grilla y **ficha de producto** con ilustración partida en V.
8. Pie rediseñado.
9. **Taza 3D protagonista**: con café y humo, que antoje.
10. Intro **elegante y divertida**.

## Estructura

**Barra**: dos píldoras a cada lado de la etiqueta dorada colgante (la casa). Izquierda: Nosotros ▾, El café ▾, Productos ▾. Derecha: Sabores, Impacto, Contacto. Botón redondo de sonido a la izquierda y de WhatsApp a la derecha. En teléfono: la etiqueta abre una hoja con las mismas tarjetas.

**Inicio**
1. Portada — video de tostión a sangre; titular grande abajo a la izquierda; tarjetas apiladas abajo a la derecha; tres capítulos numerados que cambian el video; cinta de cajas de sabor.
2. Desde Pitalito — titular condensado centrado, fotos inclinadas que flotan con el ratón, arcos que se dibujan.
3. El ciclo del café — línea discontinua que se traza con el scroll entre cuatro capítulos en tarjetas de video: Origen (cosecha), Secado, Tostión, La taza.
4. Tu taza — taza 3D protagonista con café y vapor; elegir sabor y líquido e infusionar (cuenta en la etiqueta).
5. El ritual — video de caficultores de fondo; cuatro cápsulas de línea con iconos que siguen al ratón.
6. Impacto — verde profundo, ornamento de línea que se dibuja, fotos inclinadas.
7. Pie.

**/productos** y **/productos/[sabor]** — grilla de cajas recortadas; ficha con fondo partido en V, ilustraciones del ingrediente a los lados, granos 3D flotando y sello giratorio.

## Ronda 3b

- **Botón de volver arriba** (`navegacion/BotonArriba.tsx`): taza dorada con flecha de vapor y anillo de progreso. Al pulsarlo estalla en granos y gotas (GSAP Physics2D, con gravedad), despega y, al llegar arriba, cae una segunda salpicadura desde la barra. Suena si el sonido está encendido. Con movimiento reducido solo sube.

## Ronda 3c (2026-11-03)

- Bug del recuadro café sobre el banner: era el telón del pie (ScrollTrigger con medidas viejas). **Telón eliminado.**
- Bug /productos en blanco: el revelado solo buscaba elementos al montar; ahora en cada ruta.
- Portada nueva **sin taza** (pedido del cliente): el video se ve solo a través de "CAFÉ DE ORIGEN" (capa espresso + `mix-blend-mode: multiply`) y al bajar se entra por la O.
- Carrusel: tarjetas de color con caja recortada; nombre al pasar el ratón; acelera e inclina con el scroll.
- Arma tu taza: sabores con miniatura, el fondo toma el color del sabor, el nombre cae letra a letra, llega la caja y saltan sus ingredientes (Physics2D). Taza lista: lluvia de granos.
- Ficha: perfil de taza en anillos con pestañas, rueda sensorial con ingredientes, preparación con video, "también te puede gustar", banner de video. **Valores de perfil y porcentajes son de muestra.**
- Pie: logo vivo (casa que se dibuja, letras que caen, humo de chimenea, letras que se levantan con el cursor); "Creado por Fábrica de Software · Powered by EmprendeLab".
- Sistemas globales: cursor grano (taza sobre enlaces, granitos al clic), transición de páginas con ola de café.
- Sonidos: bienvenida, pop, campana, subida (granos + porcelana); ritual sin sonidos.
- Recortes de caja: tradicional, anís y campesino (Magnific). **Cardamomo y jengibre pendientes** (límite diario).

## Tipografía (desvía del manual — ADR-0001)

Titulares: **Big Shoulders Display** (condensada, en mayúsculas) con palabras pequeñas en Fraunces. Texto: **Fraunces**. **LOGGER**: nombres de sabor y sellos.

## Recursos

- Video: Pexels (créditos en `public/video/creditos.json`, se muestran en el pie).
- 3D: Meshy (taza, sachet, grano) optimizados con gltf-transform.
- Sonido: ElevenLabs (6 efectos, -20 LUFS).
