import { defineStore } from 'pinia'

const TOKEN_KEY = 'clasify.session.token'

function leerToken() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.sessionStorage.getItem(TOKEN_KEY)
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    token: leerToken(),
    usuario: null,
    estado: 'visitante',
    error: null,
    sessionVersion: 0
  }),
  getters: {
    estaAutenticado: (state) => state.estado === 'autenticado' && state.usuario !== null,
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
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(TOKEN_KEY, token)
      }
    },
    limpiarSesion() {
      this.token = null
      this.usuario = null
      this.estado = 'visitante'
      this.error = null
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(TOKEN_KEY)
      }
    },
    cerrarSesion() {
      this.limpiarSesion()
      this.sessionVersion += 1
    }
  }
})
