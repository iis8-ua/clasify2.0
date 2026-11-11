import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { perfilPublicoService } from '../../src/services/perfilPublicoService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return { status, ok: status >= 200 && status < 300, headers: { get: () => 'application/json' }, json: async () => body }
}

describe('servicio de perfil público', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    configurarHttp({ baseUrl: 'http://api.test/clasify_api', getToken: () => 'token', onUnauthorized: vi.fn() })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('obtiene el perfil público', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: { usuario: { id: 1, nombre: 'Ana' } } }))
    const perfil = await perfilPublicoService.perfil(1)
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/usuarios/1')
    expect(perfil.nombre).toBe('Ana')
  })

  it('obtiene anuncios y valoraciones con paginación', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: [], paginacion: { pagina: 2, limite: 50, total: 0, paginas: 0 } }))
    await perfilPublicoService.anuncios(1, { pagina: 2, limite: 50 })
    await perfilPublicoService.valoraciones(1, { pagina: 2, limite: 50 })
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/usuarios/1/anuncios?pagina=2&limite=50')
    expect(fetch.mock.calls[1][0]).toBe('http://api.test/clasify_api/usuarios/1/valoraciones?pagina=2&limite=50')
  })
})
