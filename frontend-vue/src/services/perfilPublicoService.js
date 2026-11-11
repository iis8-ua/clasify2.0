import { http } from './http'

function paginacion({ pagina = 1, limite = 20 } = {}) {
  return `pagina=${pagina}&limite=${limite}`
}

export const perfilPublicoService = {
  async perfil(id) {
    const respuesta = await http.get(`/usuarios/${id}`, { auth: true })
    return respuesta.datos.usuario
  },
  async anuncios(id, { pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/${id}/anuncios?${paginacion({ pagina, limite })}`)
  },
  async valoraciones(id, { pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/${id}/valoraciones?${paginacion({ pagina, limite })}`)
  }
}
