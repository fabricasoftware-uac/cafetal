---
tipo: adr
numero: 0001
estado: aceptada
fecha: 2026-11-03
proyecto: CaFETAL
---

# ADR-0001: Tipografía de la web distinta a la del manual

## Contexto
El manual fija Arial (principal) y LOGGER (secundaria). El cliente pidió cambiar Arial por una letra elegante que combine con LOGGER; las referencias de la ronda 3 piden titulares condensados de gran tamaño.

## Decisión
- **Big Shoulders** (Google, variable): titulares en mayúsculas, con palabras pequeñas intercaladas (`.titular .menor`).
- **Fraunces** (Google, variable, ejes SOFT/WONK): texto y titulares en caja baja (portada).
- **LOGGER**: nombres de sabor, sellos y detalles de marca. Sin Á/É/Í/Ú/Ñ: `components/ui/Logger.tsx` compone la tilde.

Tres familias (la base recomienda dos): se acepta porque LOGGER es de marca y no se usa para leer.

## Consecuencias
- Licencia web de LOGGER pendiente de compra (cliente).
- Big Shoulders y Fraunces se sirven desde el build (`next/font/google`): el build depende de Google Fonts (Gotchas).
