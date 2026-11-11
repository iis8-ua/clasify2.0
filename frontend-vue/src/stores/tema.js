import { defineStore } from 'pinia'

const CLAVE_TEMA = 'clasify.tema'
const TEMA_CLARO = 'claro'
const TEMA_OSCURO = 'oscuro'
const TEMAS = [TEMA_CLARO, TEMA_OSCURO]

function leerTemaGuardado() {
  if (typeof window === 'undefined') {
    return TEMA_CLARO
  }
  try {
    const guardado = window.localStorage.getItem(CLAVE_TEMA)
    return TEMAS.includes(guardado) ? guardado : TEMA_CLARO
  } catch {
    return TEMA_CLARO
  }
}

function guardarTema(tema) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(CLAVE_TEMA, tema)
  } catch {
    return
  }
}

function aplicarTema(tema) {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.dataset.tema = tema
}

export const useTemaStore = defineStore('tema', {
  state: () => ({
    tema: leerTemaGuardado()
  }),
  getters: {
    esOscuro: (state) => state.tema === TEMA_OSCURO,
    etiqueta: (state) => (state.tema === TEMA_OSCURO ? 'Tema oscuro' : 'Tema claro')
  },
  actions: {
    aplicar() {
      aplicarTema(this.tema)
    },
    establecer(tema) {
      this.tema = TEMAS.includes(tema) ? tema : TEMA_CLARO
      guardarTema(this.tema)
      this.aplicar()
    },
    alternar() {
      this.establecer(this.esOscuro ? TEMA_CLARO : TEMA_OSCURO)
    }
  }
})
