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

describe('servicio de escritura de anuncios', () => {
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

  it('crea un anuncio sin imagen', async () => {
    fetch.mockResolvedValue(respuestaJson(201, { datos: { anuncio: { id: 1 } } }))
    const anuncio = await anunciosService.crear({
      titulo: 'Bicicleta',
      descripcion: 'Descripción',
      precio: '250.00',
      categoria: 8
    })

    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toBe('http://api.test/clasify_api/anuncios')
    expect(opciones.method).toBe('POST')
    expect(opciones.headers.Authorization).toBe('Bearer token')
    expect(opciones.body).toContain('Bicicleta')
    expect(anuncio.id).toBe(1)
  })

  it('edita con imagen usando FormData', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: { anuncio: { id: 1 } } }))
    const imagen = new File(['imagen'], 'foto.png', { type: 'image/png' })

    await anunciosService.actualizar(1, { precio: '230.00' }, imagen)

    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toBe('http://api.test/clasify_api/anuncios/1')
    expect(opciones.method).toBe('PATCH')
    expect(opciones.body).toBeInstanceOf(FormData)
    expect(opciones.headers.Authorization).toBe('Bearer token')
  })

  it('cambia el estado', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: { anuncio: { id: 1, estado: 'vendido' } } }))
    await anunciosService.cambiarEstado(1, 'vendido')

    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toBe('http://api.test/clasify_api/anuncios/1/estado')
    expect(opciones.method).toBe('PATCH')
    expect(opciones.body).toContain('vendido')
  })

  it('normaliza la forma real del detalle anidado', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: {
          anuncio: {
            id: 8,
            titulo: 'Bicicleta',
            autor: { id: 1, nombre: 'Ana' },
            categoria: { id: 3, nombre: 'Deportes' }
          }
        }
      })
    )

    const anuncio = await anunciosService.detalle(8)

    expect(anuncio.id_autor).toBe(1)
    expect(anuncio.id_categoria).toBe(3)
    expect(anuncio.autor.id).toBe(1)
    expect(anuncio.categoria.id).toBe(3)
  })

  it('normaliza también las respuestas de escritura', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: {
          anuncio: {
            id: 8,
            autor: { id: 1 },
            categoria: { id: 3 }
          }
        }
      })
    )

    const creado = await anunciosService.crear({ titulo: 'Bicicleta' })
    const actualizado = await anunciosService.actualizar(8, { titulo: 'Nueva' })
    const cambiado = await anunciosService.cambiarEstado(8, 'vendido')

    expect(creado.id_autor).toBe(1)
    expect(actualizado.id_categoria).toBe(3)
    expect(cambiado.id_autor).toBe(1)
  })

  it('elimina un anuncio con respuesta 204', async () => {
    fetch.mockResolvedValue({
      status: 204,
      ok: true,
      headers: { get: () => '' }
    })

    await expect(anunciosService.eliminar(1)).resolves.toBeUndefined()
    expect(fetch.mock.calls[0][1].method).toBe('DELETE')
  })
})
