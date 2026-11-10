import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { esErrorDeSesion } from '../services/errors'

const TOKEN_KEY = 'clasify.session.token'

function leerToken() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.sessionStorage.getItem(TOKEN_KEY)
}

function guardarToken(token) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(TOKEN_KEY, token)
  }
}

function borrarToken() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(TOKEN_KEY)
  }
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: leerToken(),
    usuario: null,
    estado: leerToken() ? 'inicial' : 'visitante',
    error: null,
    sessionVersion: 0
  }),
  getters: {
    estaAutenticado: (state) => state.estado === 'autenticado' && state.usuario !== null,
    estaComprobando: (state) => state.estado === 'comprobando' || state.estado === 'inicial',
    nombreVisible: (state) => state.usuario?.nombre ?? null,
    puedeCrear() {
      return this.estaAutenticado
    }
  },
  actions: {
    establecerSesion(token, usuario) {
      this.token = token
      this.usuario = usuario
      this.estado = 'autenticado'
      this.error = null
      this.sessionVersion += 1
      guardarToken(token)
    },
    limpiarSesion() {
      this.token = null
      this.usuario = null
      this.estado = 'visitante'
      this.error = null
      borrarToken()
    },
    cerrarSesion() {
      this.limpiarSesion()
      this.sessionVersion += 1
    },
    manejarNoAutorizado(error) {
      if (esErrorDeSesion(error.codigo)) {
        this.cerrarSesion()
      }
    },
    async registrar(datos) {
      const sesion = await authService.registrar(datos)
      this.establecerSesion(sesion.token, sesion.usuario)
      return sesion.usuario
    },
    async iniciarSesion(credenciales) {
      const sesion = await authService.iniciarSesion(credenciales)
      this.establecerSesion(sesion.token, sesion.usuario)
      return sesion.usuario
    },
    async restaurarSesion() {
      if (!this.token) {
        this.estado = 'visitante'
        return
      }

      this.estado = 'comprobando'
      this.error = null

      try {
        const usuario = await authService.obtenerUsuarioActual()
        this.usuario = usuario
        this.estado = 'autenticado'
        this.sessionVersion += 1
      } catch (error) {
        if (esErrorDeSesion(error.codigo)) {
          this.limpiarSesion()
          return
        }
        this.estado = 'error'
        this.error = error
      }
    },
    async reintentarRestauracion() {
      await this.restaurarSesion()
    }
  }
})
