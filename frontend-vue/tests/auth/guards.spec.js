import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from '../../src/stores/session'
import { resolverAcceso } from '../../src/router/guards'

describe('guardas de autenticación', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('redirige a acceso con la ruta solicitada', () => {
    const session = useSessionStore()
    expect(
      resolverAcceso({ meta: { requiereSesion: true }, fullPath: '/favoritos' }, session)
    ).toEqual({ name: 'login', query: { redirect: '/favoritos' } })
  })

  it('redirige fuera del acceso cuando hay sesión', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    expect(resolverAcceso({ meta: { soloVisitantes: true } }, session)).toEqual({
      name: 'anuncios'
    })
  })

  it('permite rutas públicas', () => {
    const session = useSessionStore()
    expect(resolverAcceso({ meta: { publica: true } }, session)).toBe(true)
  })

  it('permite esperar la restauración antes de decidir sobre una ruta protegida', () => {
    const session = useSessionStore()
    session.estado = 'comprobando'

    expect(resolverAcceso({ meta: { requiereSesion: true }, fullPath: '/perfil' }, session)).toBe(true)
  })
})
