import { http } from './http'

function paginacion({ pagina = 1, limite = 20 } = {}) {
  return `pagina=${pagina}&limite=${limite}`
}

export const valoracionesService = {
  async listarRecibidas(id, { pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/${id}/valoraciones?${paginacion({ pagina, limite })}`)
  },
  async listarEscritas({ pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/me/valoraciones?${paginacion({ pagina, limite })}`, { auth: true })
  },
  async guardar(id, { puntuacion, comentario }) {
    const { estado, datos } = await http.put(
      `/usuarios/${id}/valoracion`,
      { puntuacion, comentario },
      { auth: true, conEstado: true }
    )
    return { estado, nuevo: datos?.datos?.nuevo ?? false, valoracion: datos?.datos?.valoracion }
  },
  async eliminar(id) {
    return http.delete(`/usuarios/${id}/valoracion`, { auth: true })
  }
}
