import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from '../../src/stores/session'
import { authService } from '../../src/services/authService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/authService', () => ({
  authService: {
    registrar: vi.fn(),
    iniciarSesion: vi.fn(),
    obtenerUsuarioActual: vi.fn()
  }
}))

describe('store de sesión', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('guarda la sesión tras el registro', async () => {
    authService.registrar.mockResolvedValue({
      token: 'token',
      usuario: { id: 1, nombre: 'Ana' }
    })
    const session = useSessionStore()

    await session.registrar({ email: 'ana@example.com', nombre: 'Ana', password: 'Clasify123!' })

    expect(session.estaAutenticado).toBe(true)
    expect(session.token).toBe('token')
    expect(window.sessionStorage.getItem('clasify.session.token')).toBe('token')
  })

  it('guarda la sesión tras el acceso', async () => {
    authService.iniciarSesion.mockResolvedValue({
      token: 'token',
      usuario: { id: 1, nombre: 'Ana' }
    })
    const session = useSessionStore()

    await session.iniciarSesion({ email: 'ana@example.com', password: 'Clasify123!' })

    expect(session.estaAutenticado).toBe(true)
    expect(session.nombreVisible).toBe('Ana')
  })

  it('restaura la sesión con el token guardado', async () => {
    window.sessionStorage.setItem('clasify.session.token', 'token')
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana' })
    const session = useSessionStore()

    await session.restaurarSesion()

    expect(session.estado).toBe('autenticado')
    expect(session.usuario.nombre).toBe('Ana')
  })

  it('limpia la sesión si el token no es válido', async () => {
    window.sessionStorage.setItem('clasify.session.token', 'token')
    authService.obtenerUsuarioActual.mockRejectedValue(
      new ApiError({ estado: 401, codigo: 'TOKEN_CADUCADO', mensaje: 'Caducado' })
    )
    const session = useSessionStore()

    await session.restaurarSesion()

    expect(session.estado).toBe('visitante')
    expect(session.token).toBeNull()
    expect(window.sessionStorage.getItem('clasify.session.token')).toBeNull()
  })

  it('conserva el token si falla la comprobación por conexión', async () => {
    window.sessionStorage.setItem('clasify.session.token', 'token')
    authService.obtenerUsuarioActual.mockRejectedValue(
      new ApiError({ estado: 0, codigo: 'ERROR_CONEXION', mensaje: 'Sin conexión', tipo: 'conexion' })
    )
    const session = useSessionStore()

    await session.restaurarSesion()

    expect(session.estado).toBe('error')
    expect(session.token).toBe('token')
  })

  it('limpia la sesión al cerrar sesión', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })

    session.cerrarSesion()

    expect(session.estaAutenticado).toBe(false)
    expect(session.usuario).toBeNull()
    expect(window.sessionStorage.getItem('clasify.session.token')).toBeNull()
    expect(session.sessionVersion).toBeGreaterThan(1)
  })

  it('actualiza el usuario sin cerrar la sesión', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana', email: 'ana@example.com' })

    session.actualizarUsuario({ nombre: 'Ana Editada', biografia: 'Nueva' })

    expect(session.usuario.nombre).toBe('Ana Editada')
    expect(session.usuario.email).toBe('ana@example.com')
    expect(session.token).toBe('token')
    expect(session.estaAutenticado).toBe(true)
  })

  it('no cierra la sesión ante credenciales incorrectas de formulario', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })

    session.manejarNoAutorizado(
      new ApiError({ estado: 401, codigo: 'CREDENCIALES_INVALIDAS', mensaje: 'Credenciales incorrectas' })
    )

    expect(session.estaAutenticado).toBe(true)
  })

  it('cierra la sesión ante un código de sesión inválido', () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })

    session.manejarNoAutorizado(
      new ApiError({ estado: 401, codigo: 'TOKEN_CADUCADO', mensaje: 'Caducado' })
    )

    expect(session.estaAutenticado).toBe(false)
    expect(session.motivoSesion).toContain('sesión ha caducado')
  })
})
