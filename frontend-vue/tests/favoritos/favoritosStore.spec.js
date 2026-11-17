import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritosStore } from '../../src/stores/favoritos'
import { favoritosService } from '../../src/services/favoritosService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/favoritosService', () => ({
  favoritosService: {
    anadir: vi.fn(),
    quitar: vi.fn(),
    listar: vi.fn()
  }
}))

describe('store de favoritos', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('carga una lista con resultados', async () => {
    favoritosService.listar.mockResolvedValue({
      datos: [{ id: 1, titulo: 'Bicicleta' }],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
    const store = useFavoritosStore()

    await store.cargar(1)

    expect(favoritosService.listar).toHaveBeenCalledWith({ pagina: 1, limite: 20 })
    expect(store.listado).toHaveLength(1)
    expect(store.estado).toBe('success')
    expect(store.paginacion.total).toBe(1)
  })

  it('distingue una lista vacía de un error', async () => {
    favoritosService.listar.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })
    const store = useFavoritosStore()

    await store.cargar(1)

    expect(store.estado).toBe('empty')
    expect(store.error).toBeNull()
  })

  it('guarda un error comprensible si falla la carga', async () => {
    favoritosService.listar.mockRejectedValue(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const store = useFavoritosStore()

    await store.cargar(1)

    expect(store.estado).toBe('error')
    expect(store.error.mensaje).toBe('Fallo del servidor')
  })

  it('añade y quita favoritos sin dejar operaciones pendientes', async () => {
    favoritosService.anadir.mockResolvedValue({ favorito: { id: 1 }, nuevo: true })
    favoritosService.quitar.mockResolvedValue()
    const store = useFavoritosStore()

    const resultado = await store.anadir(1)
    expect(resultado.nuevo).toBe(true)
    expect(resultado.favorito.id).toBe(1)
    expect(store.procesando[1]).toBeUndefined()

    await store.quitar(1)
    expect(store.procesando[1]).toBeUndefined()
    expect(favoritosService.quitar).toHaveBeenCalledWith(1)
  })

  it('invalida la lista tras añadir o quitar y la recarga actualizada', async () => {
    favoritosService.listar.mockResolvedValueOnce({
      datos: [{ id: 1, titulo: 'Bicicleta' }],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
    favoritosService.anadir.mockResolvedValue({ favorito: { id: 10 }, nuevo: true })
    favoritosService.quitar.mockResolvedValue()
    const store = useFavoritosStore()

    await store.cargar(1)
    expect(store.estado).toBe('success')

    await store.anadir(1)
    expect(store.estado).toBe('idle')

    favoritosService.listar.mockResolvedValueOnce({
      datos: [{ id: 1 }, { id: 2 }],
      paginacion: { pagina: 1, limite: 20, total: 2, paginas: 1 }
    })
    await store.cargar(1)
    expect(store.listado).toHaveLength(2)

    await store.quitar(1)
    expect(store.estado).toBe('success')

    favoritosService.listar.mockResolvedValueOnce({
      datos: [{ id: 2 }],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
    await store.cargar(1)
    expect(store.listado).toHaveLength(1)
  })

  it('limpia los datos al cambiar la versión de sesión', () => {
    const store = useFavoritosStore()
    store.listado = [{ id: 1 }]
    store.paginacion = { pagina: 2, limite: 20, total: 21, paginas: 2 }
    store.estado = 'success'

    store.sincronizarSesion(1)

    expect(store.versionSesion).toBe(1)
    expect(store.listado).toEqual([])
    expect(store.estado).toBe('idle')

    store.listado = [{ id: 2 }]
    store.sincronizarSesion(1)
    expect(store.listado).toHaveLength(1)

    store.sincronizarSesion(2)
    expect(store.listado).toEqual([])
  })

  it('ignora la respuesta de una página anterior', async () => {
    let resolverPrimera
    let resolverSegunda
    favoritosService.listar
      .mockImplementationOnce(() => new Promise((resolve) => { resolverPrimera = resolve }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolverSegunda = resolve }))
    const store = useFavoritosStore()

    const primera = store.cargar(1)
    const segunda = store.cargar(2)
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

    expect(store.listado[0].id).toBe(2)
    expect(store.paginacion.pagina).toBe(2)
  })
})
