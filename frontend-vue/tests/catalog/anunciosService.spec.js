import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { anunciosService } from '../../src/services/anunciosService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('servicio de anuncios', () => {
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

  it('construye la query del listado', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: [],
        paginacion: { pagina: 2, limite: 20, total: 0, paginas: 0 }
      })
    )

    await anunciosService.listar({
      texto: 'mesa',
      categoria: 3,
      estado: 'vendido',
      orden: 'precio_asc',
      pagina: 2
    })

    const url = fetch.mock.calls[0][0]
    expect(url).toContain('/anuncios?')
    expect(url).toContain('texto=mesa')
    expect(url).toContain('categoria=3')
    expect(url).toContain('estado=vendido')
    expect(url).toContain('orden=precio_asc')
    expect(url).toContain('pagina=2')
    expect(url).toContain('limite=20')
  })

  it('obtiene el detalle del anuncio', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: { anuncio: { id: 1, titulo: 'Bicicleta' } }
      })
    )

    const anuncio = await anunciosService.detalle(1)

    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/anuncios/1')
    expect(anuncio.titulo).toBe('Bicicleta')
  })
})
