import { defineStore } from 'pinia'
import { usuariosService } from '../services/usuariosService'
import { normalizarError } from '../services/errors'
import { useSessionStore } from './session'

const PAGINACION_INICIAL = { pagina: 1, limite: 20, total: 0, paginas: 0 }

export const usePerfilStore = defineStore('perfil', {
  state: () => ({
    perfil: null,
    estadoPerfil: 'idle',
    errorPerfil: null,
    anuncios: [],
    paginacion: { ...PAGINACION_INICIAL },
    estadoAnuncios: 'idle',
    errorAnuncios: null,
    solicitudAnuncios: 0,
    solicitudPerfil: 0,
    versionSesion: -1
  }),
  actions: {
    async cargarPerfil() {
      const solicitud = ++this.solicitudPerfil
      this.estadoPerfil = 'loading'
      this.errorPerfil = null

      try {
        const perfil = await usuariosService.perfil()
        if (solicitud !== this.solicitudPerfil) {
          return null
        }
        this.perfil = perfil
        this.estadoPerfil = 'success'
        return perfil
      } catch (error) {
        if (solicitud !== this.solicitudPerfil) {
          return null
        }
        this.errorPerfil = normalizarError(error)
        this.estadoPerfil = 'error'
        return null
      }
    },
    async actualizarPerfil(cambios) {
      const solicitud = ++this.solicitudPerfil
      const perfil = await usuariosService.actualizarPerfil(cambios)
      if (solicitud !== this.solicitudPerfil) {
        return null
      }
      this.perfil = perfil
      this.estadoPerfil = 'success'
      useSessionStore().actualizarUsuario(perfil)
      return perfil
    },
    async cambiarContrasena(datos) {
      return usuariosService.cambiarContrasena(datos)
    },
    async cargarAnuncios(pagina = 1) {
      const solicitud = ++this.solicitudAnuncios
      this.estadoAnuncios = 'loading'
      this.errorAnuncios = null

      try {
        const respuesta = await usuariosService.listarAnuncios({ pagina, limite: 20 })
        if (solicitud !== this.solicitudAnuncios) {
          return null
        }
        this.anuncios = respuesta.datos
        this.paginacion = respuesta.paginacion
        this.estadoAnuncios = respuesta.datos.length > 0 ? 'success' : 'empty'
        return respuesta.paginacion
      } catch (error) {
        if (solicitud !== this.solicitudAnuncios) {
          return null
        }
        this.errorAnuncios = normalizarError(error)
        this.estadoAnuncios = 'error'
        return null
      }
    },
    limpiar() {
      this.perfil = null
      this.estadoPerfil = 'idle'
      this.errorPerfil = null
      this.anuncios = []
      this.paginacion = { ...PAGINACION_INICIAL }
      this.estadoAnuncios = 'idle'
      this.errorAnuncios = null
      this.solicitudAnuncios += 1
      this.solicitudPerfil += 1
    },
    sincronizarSesion(version) {
      if (this.versionSesion !== version) {
        this.limpiar()
        this.versionSesion = version
      }
    }
  }
})
