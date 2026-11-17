import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configurarHttp, http } from '../../src/services/http'
import { ApiError } from '../../src/services/errors'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('capa HTTP', () => {
  const onUnauthorized = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    onUnauthorized.mockReset()
    configurarHttp({
      baseUrl: 'http://api.test/clasify_api',
      getToken: () => 'token',
      onUnauthorized
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('propaga AbortSignal a fetch', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: [] }))
    const controller = new AbortController()

    await http.get('/anuncios', { signal: controller.signal })

    expect(fetch.mock.calls[0][1].signal).toBe(controller.signal)
  })

  it('no trata los errores de conexión como sesión inválida', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(http.get('/anuncios')).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('entrega el 401 a la frontera de sesión', async () => {
    fetch.mockResolvedValue(
      respuestaJson(401, {
        error: { codigo: 'TOKEN_CADUCADO', mensaje: 'Sesión caducada' }
      })
    )

    await expect(http.get('/perfil', { auth: true })).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalled()
  })

  it('expone el estado HTTP cuando se solicita', async () => {
    fetch.mockResolvedValue(respuestaJson(201, { datos: { favorito: { id: 1 } } }))

    const respuesta = await http.post('/anuncios/25/favorito', undefined, { conEstado: true })

    expect(respuesta.estado).toBe(201)
    expect(respuesta.datos.datos.favorito.id).toBe(1)
  })
})
