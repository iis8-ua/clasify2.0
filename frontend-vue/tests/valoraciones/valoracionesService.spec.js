import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { valoracionesService } from '../../src/services/valoracionesService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return { status, ok: status >= 200 && status < 300, headers: { get: () => 'application/json' }, json: async () => body }
}

describe('servicio de valoraciones', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    configurarHttp({ baseUrl: 'http://api.test/clasify_api', getToken: () => 'token', onUnauthorized: vi.fn() })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('lista recibidas y escritas', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } }))
    await valoracionesService.listarRecibidas(2, { pagina: 1, limite: 20 })
    await valoracionesService.listarEscritas({ pagina: 2, limite: 50 })
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/usuarios/2/valoraciones?pagina=1&limite=20')
    expect(fetch.mock.calls[1][0]).toBe('http://api.test/clasify_api/usuarios/me/valoraciones?pagina=2&limite=50')
  })

  it('guarda con PUT y distingue estado', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: { nuevo: false, valoracion: { puntuacion: 5 } } }))
    const respuesta = await valoracionesService.guardar(2, { puntuacion: 5, comentario: 'Bien' })
    expect(fetch.mock.calls[0][1].method).toBe('PUT')
    expect(respuesta.estado).toBe(200)
    expect(respuesta.valoracion.puntuacion).toBe(5)
  })

  it('elimina con DELETE', async () => {
    fetch.mockResolvedValue({ status: 204, ok: true, headers: { get: () => '' } })
    await valoracionesService.eliminar(2)
    expect(fetch.mock.calls[0][1].method).toBe('DELETE')
  })
})
