import { http } from './http'

export const categoriasService = {
  async listar({ pagina = 1, limite = 100 } = {}) {
    return http.get(`/categorias?pagina=${pagina}&limite=${limite}`)
  }
}
