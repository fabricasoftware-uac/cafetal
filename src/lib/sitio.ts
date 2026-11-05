/** Secciones navegables: el orden es el de la página. */
export const SECCIONES = [
  { id: 'nosotros', nombre: 'Quiénes somos', nota: 'De Pitalito, Huila' },
  { id: 'historia', nombre: 'Historia', nota: 'Del cafetal a tu taza' },
  { id: 'ritual', nombre: 'Momentos', nota: 'Un sachet, todos tus momentos' },
  { id: 'prepara', nombre: 'Prepara tu taza', nota: 'Tres minutos, a tu gusto' },
  { id: 'sabores', nombre: 'Sabores', nota: 'Tradicional y Premium By Gugo' },
  { id: 'impacto', nombre: 'Impacto', nota: 'Un ecosistema que regenera' },
  { id: 'contacto', nombre: 'Contacto', nota: 'Distribuidores y aliados' },
] as const

/*
 * Datos de contacto. Teléfono, correo y dirección son los del brochure de AiCAFÉ:
 * pendiente de que el cliente confirme los de CaFETAL (docs/04 - Pendientes).
 */
export const CONTACTO = {
  whatsapp: '573212367179',
  telefonoVisible: '+57 321 236 7179',
  correo: 'aicafebiofer@gmail.com',
  ciudad: 'Pitalito, Huila · Colombia',
}

export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`
}
