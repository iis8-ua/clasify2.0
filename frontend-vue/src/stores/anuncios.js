import { defineStore } from 'pinia'
import { anunciosService } from '../services/anunciosService'
import { normalizarError } from '../services/errors'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export const useAnunciosStore = defineStore('anuncios', {
  state: () => ({
    listado: [],
    paginacion: { ...PAGINACION_INICIAL },
    estadoListado: 'idle',
    errorListado: null,
    detalle: null,
    estadoDetalle: 'idle',
    errorDetalle: null,
    solicitudActual: 0
  }),
  getters: {
    hayResultados: (state) => state.listado.length > 0,
    totalPaginas: (state) => state.paginacion.paginas,
    paginaActual: (state) => state.paginacion.pagina
  },
  actions: {
    async cargarListado(filtros) {
      const solicitud = ++this.solicitudActual
      this.estadoListado = 'loading'
      this.errorListado = null

      try {
        const respuesta = await anunciosService.listar(filtros)
        if (solicitud !== this.solicitudActual) {
          return
        }
        this.listado = respuesta.datos
        this.paginacion = respuesta.paginacion
        this.estadoListado = respuesta.datos.length > 0 ? 'success' : 'empty'
      } catch (error) {
        if (solicitud !== this.solicitudActual) {
          return
        }
        this.errorListado = normalizarError(error)
        this.estadoListado = 'error'
      }
    },
    async cargarDetalle(id) {
      this.estadoDetalle = 'loading'
      this.errorDetalle = null
      this.detalle = null

      try {
        this.detalle = await anunciosService.detalle(id)
        this.estadoDetalle = 'success'
      } catch (error) {
        const normalizado = normalizarError(error)
        this.errorDetalle = normalizado
        this.estadoDetalle = normalizado.estado === 404 ? 'notfound' : 'error'
      }
    },
    limpiarDetalle() {
      this.detalle = null
      this.estadoDetalle = 'idle'
      this.errorDetalle = null
    },
    actualizarEnListado(anuncio) {
      const indice = this.listado.findIndex((item) => item.id === anuncio.id)
      if (indice !== -1) {
        this.listado[indice] = { ...this.listado[indice], ...anuncio }
      }
    },
    async crear(valores, imagen) {
      const anuncio = await anunciosService.crear(valores, imagen)
      this.detalle = anuncio
      this.estadoDetalle = 'success'
      this.estadoListado = 'idle'
      this.listado = []
      return anuncio
    },
    async actualizar(id, valores, imagen) {
      const anuncio = await anunciosService.actualizar(id, valores, imagen)
      this.detalle = anuncio
      this.estadoDetalle = 'success'
      this.actualizarEnListado(anuncio)
      return anuncio
    },
    async cambiarEstado(id, estado) {
      const anuncio = await anunciosService.cambiarEstado(id, estado)
      this.detalle = anuncio
      this.estadoDetalle = 'success'
      this.actualizarEnListado(anuncio)
      return anuncio
    },
    async eliminar(id) {
      await anunciosService.eliminar(id)
      this.listado = this.listado.filter((item) => item.id !== id)
      if (this.detalle?.id === id) {
        this.limpiarDetalle()
      }
    }
  }
})
