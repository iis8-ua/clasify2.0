import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mensajesService } from '../../src/services/mensajesService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('servicio de mensajería', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    configurarHttp({ baseUrl: 'http://api.test/clasify_api', getToken: () => 'token', onUnauthorized: vi.fn() })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('lista conversaciones con paginación', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: [], paginacion: { pagina: 2, limite: 20, total: 0, paginas: 0 } }))
    await mensajesService.listarConversaciones({ pagina: 2, limite: 20 })
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/usuarios/me/conversaciones?pagina=2&limite=20')
  })

  it('lista el hilo desde el final', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } }))
    await mensajesService.listarMensajes(4, { pagina: 1, limite: 20, desde: 'final' })
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/conversaciones/4/mensajes?pagina=1&limite=20&desde=final')
  })

  it('envía un mensaje', async () => {
    fetch.mockResolvedValue(respuestaJson(201, { datos: { mensaje: { id: 1, texto: 'Hola' } } }))
    const respuesta = await mensajesService.enviar(4, 'Hola')
    expect(fetch.mock.calls[0][1].method).toBe('POST')
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ texto: 'Hola' })
    expect(respuesta.datos.mensaje.texto).toBe('Hola')
  })

  it('inicia una conversación desde un anuncio', async () => {
    fetch.mockResolvedValue(respuestaJson(201, { datos: { conversacion: { id: 4 }, mensaje: { id: 1 } } }))
    const respuesta = await mensajesService.iniciar(25, 'Hola')
    expect(fetch.mock.calls[0][0]).toBe('http://api.test/clasify_api/anuncios/25/mensajes')
    expect(respuesta.datos.conversacion.id).toBe(4)
  })
})
