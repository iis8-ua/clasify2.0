import { defineStore } from 'pinia'
import { valoracionesService } from '../services/valoracionesService'
import { normalizarError } from '../services/errors'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export const useValoracionesStore = defineStore('valoraciones', {
  state: () => ({
    recibidas: [],
    paginacionRecibidas: { ...PAGINACION_INICIAL },
    estadoRecibidas: 'idle',
    errorRecibidas: null,
    escritas: [],
    paginacionEscritas: { ...PAGINACION_INICIAL },
    estadoEscritas: 'idle',
    errorEscritas: null,
    guardando: false,
    eliminando: false,
    solicitudRecibidas: 0,
    solicitudEscritas: 0,
    versionSesion: -1
  }),
  actions: {
    async cargarRecibidas(id, pagina = 1, limite = 20) {
      const solicitud = ++this.solicitudRecibidas
      this.estadoRecibidas = 'loading'
      this.errorRecibidas = null
      try {
        const respuesta = await valoracionesService.listarRecibidas(id, { pagina, limite })
        if (solicitud !== this.solicitudRecibidas) return null
        this.recibidas = respuesta.datos
        this.paginacionRecibidas = respuesta.paginacion
        this.estadoRecibidas = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudRecibidas) return null
        this.errorRecibidas = normalizarError(error)
        this.estadoRecibidas = 'error'
        return null
      }
    },
    async cargarEscritas(pagina = 1, limite = 20) {
      const solicitud = ++this.solicitudEscritas
      this.estadoEscritas = 'loading'
      this.errorEscritas = null
      try {
        const respuesta = await valoracionesService.listarEscritas({ pagina, limite })
        if (solicitud !== this.solicitudEscritas) return null
        this.escritas = respuesta.datos
        this.paginacionEscritas = respuesta.paginacion
        this.estadoEscritas = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudEscritas) return null
        this.errorEscritas = normalizarError(error)
        this.estadoEscritas = 'error'
        return null
      }
    },
    async guardar(id, datos) {
      this.guardando = true
      try {
        const resultado = await valoracionesService.guardar(id, datos)
        return resultado
      } finally {
        this.guardando = false
      }
    },
    async eliminar(id) {
      this.eliminando = true
      try {
        await valoracionesService.eliminar(id)
      } finally {
        this.eliminando = false
      }
    },
    limpiar() {
      this.recibidas = []
      this.paginacionRecibidas = { ...PAGINACION_INICIAL }
      this.estadoRecibidas = 'idle'
      this.errorRecibidas = null
      this.escritas = []
      this.paginacionEscritas = { ...PAGINACION_INICIAL }
      this.estadoEscritas = 'idle'
      this.errorEscritas = null
      this.guardando = false
      this.eliminando = false
      this.solicitudRecibidas += 1
      this.solicitudEscritas += 1
    },
    sincronizarSesion(version) {
      if (this.versionSesion !== version) {
        this.limpiar()
        this.versionSesion = version
      }
    }
  }
})
