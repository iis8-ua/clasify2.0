export function urlImagen(nombre) {
  if (!nombre) {
    return null
  }
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base.replace(/\/$/, '')}/uploads/${nombre}`
}
