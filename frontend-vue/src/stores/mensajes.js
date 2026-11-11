import { defineStore } from 'pinia'
import { mensajesService } from '../services/mensajesService'
import { normalizarError } from '../services/errors'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export const useMensajesStore = defineStore('mensajes', {
  state: () => ({
    conversaciones: [],
    paginacion: { ...PAGINACION_INICIAL },
    estado: 'idle',
    error: null,
    hilo: [],
    paginacionHilo: { ...PAGINACION_INICIAL },
    estadoHilo: 'idle',
    errorHilo: null,
    conversacionId: null,
    conversacionActual: null,
    enviando: false,
    solicitudLista: 0,
    solicitudHilo: 0,
    versionSesion: -1
  }),
  getters: {
    hayConversaciones: (state) => state.conversaciones.length > 0,
    hayMensajes: (state) => state.hilo.length > 0
  },
  actions: {
    async cargarConversaciones(pagina = 1, limite = 20) {
      const solicitud = ++this.solicitudLista
      this.estado = 'loading'
      this.error = null

      try {
        const respuesta = await mensajesService.listarConversaciones({ pagina, limite })
        if (solicitud !== this.solicitudLista) {
          return null
        }
        this.conversaciones = respuesta.datos
        this.paginacion = respuesta.paginacion
        this.estado = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudLista) {
          return null
        }
        this.error = normalizarError(error)
        this.estado = 'error'
        return null
      }
    },
    async cargarConversacion(id) {
      const existente = this.conversaciones.find((item) => item.id === id)
      if (existente) {
        this.conversacionActual = existente
        return existente
      }

      try {
        let pagina = 1
        let paginas = 1
        do {
          const respuesta = await mensajesService.listarConversaciones({ pagina, limite: 100 })
          const encontrada = respuesta.datos.find((item) => item.id === id)
          if (encontrada) {
            this.conversacionActual = encontrada
            return encontrada
          }
          paginas = respuesta.paginacion.paginas
          pagina += 1
        } while (pagina <= paginas)
      } catch {
        this.conversacionActual = null
        return null
      }

      this.conversacionActual = null
      return null
    },
    async cargarHilo(id, pagina = 1, limite = 20, { reemplazar = true } = {}) {
      const solicitud = ++this.solicitudHilo
      if (reemplazar) {
        this.estadoHilo = 'loading'
        this.errorHilo = null
        this.hilo = []
      }

      try {
        const respuesta = await mensajesService.listarMensajes(id, {
          pagina,
          limite,
          desde: 'final'
        })
        if (solicitud !== this.solicitudHilo) {
          return null
        }
        this.conversacionId = id
        this.hilo = reemplazar
          ? respuesta.datos
          : [...respuesta.datos, ...this.hilo]
        this.paginacionHilo = respuesta.paginacion
        this.estadoHilo = this.hilo.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudHilo) {
          return null
        }
        this.errorHilo = normalizarError(error)
        this.estadoHilo = this.errorHilo.estado === 404 ? 'notfound' : 'error'
        return null
      }
    },
    async enviar(id, texto) {
      this.enviando = true
      try {
        const respuesta = await mensajesService.enviar(id, texto)
        this.hilo = [...this.hilo, respuesta.datos.mensaje]
        this.estadoHilo = 'success'
        return respuesta.datos.mensaje
      } finally {
        this.enviando = false
      }
    },
    async iniciar(idAnuncio, texto) {
      const respuesta = await mensajesService.iniciar(idAnuncio, texto)
      return respuesta.datos
    },
    limpiar() {
      this.conversaciones = []
      this.paginacion = { ...PAGINACION_INICIAL }
      this.estado = 'idle'
      this.error = null
      this.hilo = []
      this.paginacionHilo = { ...PAGINACION_INICIAL }
      this.estadoHilo = 'idle'
      this.errorHilo = null
      this.conversacionId = null
      this.conversacionActual = null
      this.enviando = false
      this.solicitudLista += 1
      this.solicitudHilo += 1
    },
    sincronizarSesion(version) {
      if (this.versionSesion !== version) {
        this.limpiar()
        this.versionSesion = version
      }
    }
  }
})
