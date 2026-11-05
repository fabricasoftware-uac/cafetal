---
tipo: diseño
estado: borrador
creado: 2026-11-03
---

# Identidad visual — CaFETAL

Fuente: `Manual-Marca\Manual de Marca CAFETAL.pdf` (8 p.) + brochures 2026.

## Logo

Tres lockups (los mismos que `Manual-Marca\DIGITALES`):

| Lockup | Contenido | Uso |
|---|---|---|
| `logo-slogan` | casa + CaFETAL + "Café Tostado y Molido" + "Roasted and ground coffee" | Versión principal |
| `logo` | casa + CaFETAL | Cabecera, tamaños medios |
| `imagotipo` | casa | Favicon, marca de agua, tamaños pequeños |

Colores oficiales por lockup: dorado, negro, blanco, gris.

### SVG

`brand\svg\` — **extraídos de los vectores del PDF (p. 4, versión dorada), no vectorizados desde PNG**: fidelidad 1:1. Script: `brand\extract_logo.py` (PyMuPDF).

- `*-{dorado,negro,blanco,gris}.svg`: un `<path>` por bloque, para `<img>`.
- `*-animable.svg`: `fill="currentColor"` y estructura para animar:
  - `#cafetal-casa` → `.casa-trazo` (un trazo compuesto de 550 segmentos) + `.casa-detalle`
  - `#cafetal-marca` → 7 `.letra` con `data-letra` (C a F E T A L) y `--i` para escalonar
  - `#cafetal-slogan` → 18 `.letra` · `#cafetal-subslogan` → 22 `.letra`
- `favicon.svg`: imagotipo dorado en lienzo cuadrado.

> [!warning] Glifo descartado
> El PDF trae un trazo rosado `#CF1A5A` de 3 × 3 pt dentro de la "o" de "Tostado". Es un residuo del archivo fuente (no aparece en ningún PNG de DIGITALES). El extractor lo elimina.

Pendiente: pasar los SVG por SVGO al montar el proyecto (logo-slogan pesa ~87 KB; las letras de LOGGER son trazos "rústicos" con 200–400 segmentos cada una).

## Color

| Token | Manual | Valor real en el PDF |
|---|---|---|
| Negro | `#010101` (C91 M79 Y62 K97) | `#231F20` |
| Dorado | `#E1B75D` (C13 M28 Y71 K2) | `#DBB263` |
| Gris (versión) | — | `#9A9FA3` |

Se usa el valor del manual. El brochure amplía la paleta con fondos negros cálidos, dorado metálico y los colores de los 4 sabores premium: anís (rojo), campesino (café/cobre), cardamomo (verde), jengibre (ocre).

## Tipografía

| Manual | Observación |
|---|---|
| Principal: **Arial** | Funcional, pero no aporta la elegancia pedida para la web |
| Secundaria: **LOGGER** (`Manual-Marca\fonts\LOGGER.TTF`) | 41 glifos, **solo mayúsculas**, sin números. © 1991 D. Rakowski, "All Rights Reserved" → **licencia web por confirmar** antes de incrustarla |

El brochure usa en la práctica una serif de alto contraste (Misión / Visión) y una sans condensada en negrita ("TU RITMO ES ÚNICO"). La web debe proponer un par equivalente y documentarlo con ADR si se aparta del manual.

## Usos incorrectos (manual p. 7)

No deformar · no recolorear fuera de la paleta · no mover ni reordenar elementos · no inclinar · no sombras.
→ Las animaciones deben **terminar** en el logo exacto; durante la entrada se permite desplazar letras, nunca dejar el estado final alterado.
