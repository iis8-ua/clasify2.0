import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTemaStore } from '../../src/stores/tema'

const almacen = new Map()

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: {
    getItem: (clave) => almacen.get(clave) ?? null,
    setItem: (clave, valor) => almacen.set(clave, String(valor)),
    removeItem: (clave) => almacen.delete(clave),
    clear: () => almacen.clear()
  }
})

describe('tema', () => {
  beforeEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.tema
    setActivePinia(createPinia())
  })

  it('empieza en tema claro y lo aplica al documento', () => {
    const tema = useTemaStore()

    tema.aplicar()

    expect(tema.tema).toBe('claro')
    expect(document.documentElement.dataset.tema).toBe('claro')
  })

  it('alterna y persiste el tema oscuro', () => {
    const tema = useTemaStore()

    tema.alternar()

    expect(tema.tema).toBe('oscuro')
    expect(tema.esOscuro).toBe(true)
    expect(document.documentElement.dataset.tema).toBe('oscuro')
    expect(window.localStorage.getItem('clasify.tema')).toBe('oscuro')
  })

  it('recupera la preferencia guardada', () => {
    window.localStorage.setItem('clasify.tema', 'oscuro')

    const tema = useTemaStore()

    expect(tema.tema).toBe('oscuro')
  })

  it('usa el tema claro ante un valor inválido', () => {
    window.localStorage.setItem('clasify.tema', 'sepia')

    const tema = useTemaStore()

    expect(tema.tema).toBe('claro')
  })
})
