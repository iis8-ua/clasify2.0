import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from '../../src/stores/session'
import { resolverAcceso } from '../../src/router/guards'

describe('guardas de rutas', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('redirige al acceso y conserva la ruta solicitada', () => {
    const session = useSessionStore()
    const destino = resolverAcceso(
      { meta: { requiereSesion: true }, fullPath: '/perfil' },
      session
    )
    expect(destino).toEqual({ name: 'login', query: { redirect: '/perfil' } })
  })

  it('permite rutas públicas', () => {
    const session = useSessionStore()
    expect(resolverAcceso({ meta: { publica: true } }, session)).toBe(true)
  })

  it('redirige fuera de acceso y registro cuando hay sesión', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    expect(resolverAcceso({ meta: { soloVisitantes: true } }, session)).toEqual({
      name: 'anuncios'
    })
  })

  it('permite rutas protegidas con sesión', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    expect(resolverAcceso({ meta: { requiereSesion: true }, fullPath: '/favoritos' }, session)).toBe(true)
  })
})
