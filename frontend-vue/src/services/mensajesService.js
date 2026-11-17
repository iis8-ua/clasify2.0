import { http } from './http'

function paginacion({ pagina = 1, limite = 20 } = {}) {
  return `pagina=${pagina}&limite=${limite}`
}

export const mensajesService = {
  async listarConversaciones({ pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/me/conversaciones?${paginacion({ pagina, limite })}`, { auth: true })
  },
  async listarMensajes(id, { pagina = 1, limite = 20, desde = 'final' } = {}) {
    return http.get(
      `/conversaciones/${id}/mensajes?${paginacion({ pagina, limite })}&desde=${desde}`,
      { auth: true }
    )
  },
  async enviar(id, texto) {
    return http.post(`/conversaciones/${id}/mensajes`, { texto }, { auth: true })
  },
  async iniciar(idAnuncio, texto) {
    return http.post(`/anuncios/${idAnuncio}/mensajes`, { texto }, { auth: true })
  }
}
