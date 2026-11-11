import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { favoritosService } from '../../src/services/favoritosService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('servicio de favoritos', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    configurarHttp({
      baseUrl: 'http://api.test/clasify_api',
      getToken: () => 'token',
      onUnauthorized: vi.fn()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('añade un favorito', async () => {
    fetch.mockResolvedValue(
      respuestaJson(201, {
        datos: { favorito: { id: 10, id_usuario: 1, id_anuncio: 25 } }
      })
    )

    const { favorito, nuevo } = await favoritosService.anadir(25)

    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toBe('http://api.test/clasify_api/anuncios/25/favorito')
    expect(opciones.method).toBe('POST')
    expect(opciones.headers.Authorization).toBe('Bearer token')
    expect(favorito.id).toBe(10)
    expect(nuevo).toBe(true)
  })

  it('reconoce que el favorito ya existía con una respuesta 200', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: { favorito: { id: 10, id_usuario: 1, id_anuncio: 25 } }
      })
    )

    const { nuevo } = await favoritosService.anadir(25)

    expect(nuevo).toBe(false)
  })

  it('quita un favorito con respuesta 204', async () => {
    fetch.mockResolvedValue({
      status: 204,
      ok: true,
      headers: { get: () => '' }
    })

    await expect(favoritosService.quitar(25)).resolves.toBeUndefined()
    expect(fetch.mock.calls[0][1].method).toBe('DELETE')
    expect(fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer token')
  })

  it('lista los favoritos con paginación', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: [{ id: 25, titulo: 'Bicicleta' }],
        paginacion: { pagina: 2, limite: 20, total: 21, paginas: 2 }
      })
    )

    const respuesta = await favoritosService.listar({ pagina: 2, limite: 20 })

    expect(fetch.mock.calls[0][0]).toBe(
      'http://api.test/clasify_api/usuarios/me/favoritos?pagina=2&limite=20'
    )
    expect(respuesta.datos).toHaveLength(1)
    expect(respuesta.paginacion.total).toBe(21)
  })
})
