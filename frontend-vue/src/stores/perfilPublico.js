import { defineStore } from 'pinia'
import { perfilPublicoService } from '../services/perfilPublicoService'
import { normalizarError } from '../services/errors'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export const usePerfilPublicoStore = defineStore('perfilPublico', {
  state: () => ({
    perfil: null,
    estadoPerfil: 'idle',
    errorPerfil: null,
    valoraciones: [],
    paginacionValoraciones: { ...PAGINACION_INICIAL },
    estadoValoraciones: 'idle',
    errorValoraciones: null,
    anuncios: [],
    paginacionAnuncios: { ...PAGINACION_INICIAL },
    estadoAnuncios: 'idle',
    errorAnuncios: null,
    solicitudPerfil: 0,
    solicitudValoraciones: 0,
    solicitudAnuncios: 0,
    versionSesion: -1
  }),
  actions: {
    async cargarPerfil(id) {
      const solicitud = ++this.solicitudPerfil
      this.estadoPerfil = 'loading'
      this.errorPerfil = null
      this.perfil = null
      try {
        const perfil = await perfilPublicoService.perfil(id)
        if (solicitud !== this.solicitudPerfil) return null
        this.perfil = perfil
        this.estadoPerfil = 'success'
        return perfil
      } catch (error) {
        if (solicitud !== this.solicitudPerfil) return null
        this.errorPerfil = normalizarError(error)
        this.estadoPerfil = this.errorPerfil.estado === 404 ? 'notfound' : 'error'
        return null
      }
    },
    async cargarValoraciones(id, pagina = 1, limite = 20) {
      const solicitud = ++this.solicitudValoraciones
      this.estadoValoraciones = 'loading'
      this.errorValoraciones = null
      try {
        const respuesta = await perfilPublicoService.valoraciones(id, { pagina, limite })
        if (solicitud !== this.solicitudValoraciones) return null
        this.valoraciones = respuesta.datos
        this.paginacionValoraciones = respuesta.paginacion
        this.estadoValoraciones = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudValoraciones) return null
        this.errorValoraciones = normalizarError(error)
        this.estadoValoraciones = 'error'
        return null
      }
    },
    async cargarAnuncios(id, pagina = 1, limite = 20) {
      const solicitud = ++this.solicitudAnuncios
      this.estadoAnuncios = 'loading'
      this.errorAnuncios = null
      try {
        const respuesta = await perfilPublicoService.anuncios(id, { pagina, limite })
        if (solicitud !== this.solicitudAnuncios) return null
        this.anuncios = respuesta.datos
        this.paginacionAnuncios = respuesta.paginacion
        this.estadoAnuncios = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudAnuncios) return null
        this.errorAnuncios = normalizarError(error)
        this.estadoAnuncios = 'error'
        return null
      }
    },
    limpiar() {
      this.perfil = null
      this.estadoPerfil = 'idle'
      this.errorPerfil = null
      this.valoraciones = []
      this.paginacionValoraciones = { ...PAGINACION_INICIAL }
      this.estadoValoraciones = 'idle'
      this.errorValoraciones = null
      this.anuncios = []
      this.paginacionAnuncios = { ...PAGINACION_INICIAL }
      this.estadoAnuncios = 'idle'
      this.errorAnuncios = null
      this.solicitudPerfil += 1
      this.solicitudValoraciones += 1
      this.solicitudAnuncios += 1
    },
    sincronizarSesion(version) {
      if (this.versionSesion !== version) {
        this.limpiar()
        this.versionSesion = version
      }
    }
  }
})
