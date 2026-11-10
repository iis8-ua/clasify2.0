import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePerfilStore } from '../../src/stores/perfil'
import { useSessionStore } from '../../src/stores/session'
import { usuariosService } from '../../src/services/usuariosService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/usuariosService', () => ({
  usuariosService: {
    perfil: vi.fn(),
    actualizarPerfil: vi.fn(),
    cambiarContrasena: vi.fn(),
    listarAnuncios: vi.fn()
  }
}))

describe('store de perfil', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('carga el perfil propio', async () => {
    usuariosService.perfil.mockResolvedValue({ id: 1, nombre: 'Ana', email: 'ana@example.com' })
    const store = usePerfilStore()

    await store.cargarPerfil()

    expect(store.perfil.nombre).toBe('Ana')
    expect(store.estadoPerfil).toBe('success')
  })

  it('registra un error de carga del perfil', async () => {
    usuariosService.perfil.mockRejectedValue(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const store = usePerfilStore()

    await store.cargarPerfil()

    expect(store.estadoPerfil).toBe('error')
    expect(store.errorPerfil.mensaje).toBe('Fallo del servidor')
  })

  it('actualiza el perfil y el usuario de la sesión', async () => {
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    usuariosService.actualizarPerfil.mockResolvedValue({
      id: 1,
      nombre: 'Ana Editada',
      biografia: 'Nueva biografía'
    })
    const store = usePerfilStore()

    await store.actualizarPerfil({ nombre: 'Ana Editada' })

    expect(store.perfil.nombre).toBe('Ana Editada')
    expect(session.usuario.nombre).toBe('Ana Editada')
    expect(session.usuario.biografia).toBe('Nueva biografía')
  })

  it('delega el cambio de contraseña en el servicio', async () => {
    usuariosService.cambiarContrasena.mockResolvedValue({ id: 1 })
    const store = usePerfilStore()

    await store.cambiarContrasena({ passwordActual: 'actual', passwordNueva: 'nueva12345' })

    expect(usuariosService.cambiarContrasena).toHaveBeenCalledWith({
      passwordActual: 'actual',
      passwordNueva: 'nueva12345'
    })
  })

  it('carga los anuncios propios y distingue vacío de error', async () => {
    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [{ id: 1 }],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
    const store = usePerfilStore()

    await store.cargarAnuncios(1)
    expect(store.estadoAnuncios).toBe('success')
    expect(store.anuncios).toHaveLength(1)

    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })
    await store.cargarAnuncios(1)
    expect(store.estadoAnuncios).toBe('empty')

    usuariosService.listarAnuncios.mockRejectedValue(
      new ApiError({ estado: 0, codigo: 'ERROR_CONEXION', mensaje: 'Sin conexión', tipo: 'conexion' })
    )
    await store.cargarAnuncios(1)
    expect(store.estadoAnuncios).toBe('error')
    expect(store.errorAnuncios.mensaje).toBe('Sin conexión')
  })

  it('limpia perfil y anuncios al cambiar la versión de sesión', () => {
    const store = usePerfilStore()
    store.perfil = { id: 1 }
    store.anuncios = [{ id: 1 }]
    store.estadoPerfil = 'success'
    store.estadoAnuncios = 'success'

    store.sincronizarSesion(1)

    expect(store.perfil).toBeNull()
    expect(store.anuncios).toEqual([])
    expect(store.estadoPerfil).toBe('idle')
    expect(store.versionSesion).toBe(1)

    store.perfil = { id: 2 }
    store.sincronizarSesion(1)
    expect(store.perfil.id).toBe(2)

    store.sincronizarSesion(2)
    expect(store.perfil).toBeNull()
  })

  it('ignora la respuesta de una página anterior de anuncios', async () => {
    let resolverPrimera
    let resolverSegunda
    usuariosService.listarAnuncios
      .mockImplementationOnce(() => new Promise((resolve) => { resolverPrimera = resolve }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolverSegunda = resolve }))
    const store = usePerfilStore()

    const primera = store.cargarAnuncios(1)
    const segunda = store.cargarAnuncios(2)
    resolverSegunda({
      datos: [{ id: 2 }],
      paginacion: { pagina: 2, limite: 20, total: 2, paginas: 2 }
    })
    await segunda
    resolverPrimera({
      datos: [{ id: 1 }],
      paginacion: { pagina: 1, limite: 20, total: 2, paginas: 2 }
    })
    await primera

    expect(store.anuncios[0].id).toBe(2)
    expect(store.paginacion.pagina).toBe(2)
  })
})
