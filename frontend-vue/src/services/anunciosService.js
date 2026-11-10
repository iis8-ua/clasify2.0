import { http } from './http'

const LIMITE = 20

export const anunciosService = {
  async listar(filtros = {}) {
    const parametros = new URLSearchParams()
    parametros.set('estado', filtros.estado ?? 'disponible')
    parametros.set('orden', filtros.orden ?? 'fecha_desc')
    parametros.set('pagina', String(filtros.pagina ?? 1))
    parametros.set('limite', String(LIMITE))

    if (filtros.texto) {
      parametros.set('texto', filtros.texto)
    }
    if (filtros.categoria) {
      parametros.set('categoria', String(filtros.categoria))
    }

    return http.get(`/anuncios?${parametros.toString()}`)
  },
  async detalle(id) {
    const respuesta = await http.get(`/anuncios/${id}`, { auth: true })
    return respuesta.datos.anuncio
  }
}
