import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usuariosService } from '../../src/services/usuariosService'
import { configurarHttp } from '../../src/services/http'

function respuestaJson(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => 'application/json' },
    json: async () => body
  }
}

describe('servicio de usuarios', () => {
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

  it('consulta el perfil propio', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, { datos: { usuario: { id: 1, nombre: 'Ana', email: 'ana@example.com' } } })
    )

    const perfil = await usuariosService.perfil()

    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toBe('http://api.test/clasify_api/usuarios/me')
    expect(opciones.method).toBe('GET')
    expect(opciones.headers.Authorization).toBe('Bearer token')
    expect(perfil.nombre).toBe('Ana')
  })

  it('edita solo los campos enviados', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, { datos: { usuario: { id: 1, nombre: 'Ana Editada' } } })
    )

    const perfil = await usuariosService.actualizarPerfil({ nombre: 'Ana Editada' })

    const [url, opciones] = fetch.mock.calls[0]
    expect(url).toBe('http://api.test/clasify_api/usuarios/me')
    expect(opciones.method).toBe('PATCH')
    expect(JSON.parse(opciones.body)).toEqual({ nombre: 'Ana Editada' })
    expect(perfil.nombre).toBe('Ana Editada')
  })

  it('cambia la contraseña con los nombres del backend', async () => {
    fetch.mockResolvedValue(respuestaJson(200, { datos: { usuario: { id: 1 } } }))

    await usuariosService.cambiarContrasena({
      passwordActual: 'Clasify123!',
      passwordNueva: 'NuevaClave123!'
    })

    const [, opciones] = fetch.mock.calls[0]
    expect(opciones.method).toBe('PATCH')
    expect(JSON.parse(opciones.body)).toEqual({
      password: 'NuevaClave123!',
      password_actual: 'Clasify123!'
    })
    expect(opciones.headers.Authorization).toBe('Bearer token')
  })

  it('lista los anuncios propios con paginación', async () => {
    fetch.mockResolvedValue(
      respuestaJson(200, {
        datos: [{ id: 1, titulo: 'Bicicleta' }],
        paginacion: { pagina: 2, limite: 20, total: 21, paginas: 2 }
      })
    )

    const respuesta = await usuariosService.listarAnuncios({ pagina: 2, limite: 20 })

    expect(fetch.mock.calls[0][0]).toBe(
      'http://api.test/clasify_api/usuarios/me/anuncios?pagina=2&limite=20'
    )
    expect(respuesta.paginacion.total).toBe(21)
  })
})
