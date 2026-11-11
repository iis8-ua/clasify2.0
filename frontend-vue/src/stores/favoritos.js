import { defineStore } from 'pinia'
import { favoritosService } from '../services/favoritosService'
import { normalizarError } from '../services/errors'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export const useFavoritosStore = defineStore('favoritos', {
  state: () => ({
    listado: [],
    paginacion: { ...PAGINACION_INICIAL },
    estado: 'idle',
    error: null,
    procesando: {},
    solicitudActual: 0,
    versionSesion: -1
  }),
  getters: {
    hayResultados: (state) => state.listado.length > 0,
    estaProcesando: (state) => (id) => Boolean(state.procesando[id])
  },
  actions: {
    async cargar(pagina = 1, limite = 20) {
      const solicitud = ++this.solicitudActual
      this.estado = 'loading'
      this.error = null

      try {
        const respuesta = await favoritosService.listar({ pagina, limite })
        if (solicitud !== this.solicitudActual) {
          return null
        }
        this.listado = respuesta.datos
        this.paginacion = respuesta.paginacion
        this.estado = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudActual) {
          return null
        }
        this.error = normalizarError(error)
        this.estado = 'error'
        return null
      }
    },
    async anadir(idAnuncio) {
      this.procesando = { ...this.procesando, [idAnuncio]: true }
      try {
        const resultado = await favoritosService.anadir(idAnuncio)
        this.estado = 'idle'
        return resultado
      } finally {
        const { [idAnuncio]: _eliminado, ...resto } = this.procesando
        this.procesando = resto
      }
    },
    async quitar(idAnuncio) {
      this.procesando = { ...this.procesando, [idAnuncio]: true }
      try {
        await favoritosService.quitar(idAnuncio)
        this.estado = 'idle'
      } finally {
        const { [idAnuncio]: _eliminado, ...resto } = this.procesando
        this.procesando = resto
      }
    },
    limpiar() {
      this.listado = []
      this.paginacion = { ...PAGINACION_INICIAL }
      this.estado = 'idle'
      this.error = null
      this.procesando = {}
      this.solicitudActual += 1
    },
    sincronizarSesion(version) {
      if (this.versionSesion !== version) {
        this.limpiar()
        this.versionSesion = version
      }
    }
  }
})
