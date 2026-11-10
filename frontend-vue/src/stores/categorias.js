import { defineStore } from 'pinia'
import { categoriasService } from '../services/categoriasService'

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    items: [],
    porId: {},
    cargadas: false,
    cargando: false,
    error: null
  }),
  getters: {
    nombreDe: (state) => (id) => state.porId[id] ?? 'Categoría no disponible'
  },
  actions: {
    async cargar() {
      if (this.cargadas || this.cargando) {
        return
      }

      this.cargando = true
      this.error = null

      try {
        const acumuladas = []
        let pagina = 1
        let paginas = 1

        do {
          const respuesta = await categoriasService.listar({ pagina, limite: 100 })
          acumuladas.push(...respuesta.datos)
          paginas = respuesta.paginacion.paginas
          pagina += 1
        } while (pagina <= paginas)

        this.items = acumuladas
        this.porId = Object.fromEntries(acumuladas.map((categoria) => [categoria.id, categoria.nombre]))
        this.cargadas = true
      } catch (error) {
        this.error = error
      } finally {
        this.cargando = false
      }
    }
  }
})
