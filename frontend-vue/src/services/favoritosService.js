import { http } from './http'

export const favoritosService = {
  async anadir(idAnuncio) {
    const respuesta = await http.post(`/anuncios/${idAnuncio}/favorito`, undefined, { auth: true })
    return respuesta.datos.favorito
  },
  async quitar(idAnuncio) {
    await http.delete(`/anuncios/${idAnuncio}/favorito`, { auth: true })
  },
  async listar({ pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/me/favoritos?pagina=${pagina}&limite=${limite}`, { auth: true })
  }
}
