import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { categoriasService } from '../../src/services/categoriasService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('servicio de categorías', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    configurarHttp({
      baseUrl: 'http://api.test/clasify_api',
      getToken: () => null,
      onUnauthorized: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('lista categorías paginadas', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: [{ id: 1, nombre: 'Electrónica' }],
        paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
      })
    )

    const respuesta = await categoriasService.listar({ pagina: 1, limite: 100 })

    expect(fetch.mock.calls[0][0]).toBe(
      'http://api.test/clasify_api/categorias?pagina=1&limite=100'
    )
    expect(respuesta.datos[0].nombre).toBe('Electrónica')
  })
})
