import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '../../src/services/authService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('servicio de autenticación', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    configurarHttp({
      baseUrl: 'http://api.test/clasify_api',
      getToken: () => 'token-de-prueba',
      onUnauthorized: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('registra un usuario', async () => {
    fetch.mockResolvedValue(
      respuestaJson(201, {
        datos: { token: 'token', usuario: { id: 1, email: 'ana@example.com', nombre: 'Ana' } }
      })
    )

    const resultado = await authService.registrar({
      email: 'ana@example.com',
      nombre: 'Ana',
      password: 'Clasify123!'
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://api.test/clasify_api/auth/register',
      expect.objectContaining({ method: 'POST' })
    )
    expect(resultado.token).toBe('token')
    expect(resultado.usuario.nombre).toBe('Ana')
  })

  it('inicia sesión', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: { token: 'token', usuario: { id: 1, email: 'ana@example.com', nombre: 'Ana' } }
      })
    )

    const resultado = await authService.iniciarSesion({
      email: 'ana@example.com',
      password: 'Clasify123!'
    })

    expect(fetch).toHaveBeenCalledWith(
      'http://api.test/clasify_api/auth/login',
      expect.objectContaining({ method: 'POST' })
    )
    expect(resultado.token).toBe('token')
  })

  it('recupera el usuario actual con el token', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: { usuario: { id: 1, email: 'ana@example.com', nombre: 'Ana' } }
      })
    )

    const usuario = await authService.obtenerUsuarioActual()

    const llamada = fetch.mock.calls[0]
    expect(llamada[0]).toBe('http://api.test/clasify_api/auth/yo')
    expect(llamada[1].headers.Authorization).toBe('Bearer token-de-prueba')
    expect(usuario.nombre).toBe('Ana')
  })
})
