import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAnunciosStore } from '../../src/stores/anuncios'
import { anunciosService } from '../../src/services/anunciosService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: {
    listar: vi.fn(),
    detalle: vi.fn()
  }
}))

describe('store de anuncios', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('carga una página de anuncios', async () => {
    anunciosService.listar.mockResolvedValue({
      datos: [{ id: 1, titulo: 'Bicicleta' }],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
    const store = useAnunciosStore()

    await store.cargarListado({ estado: 'disponible', orden: 'fecha_desc', pagina: 1 })

    expect(store.listado).toHaveLength(1)
    expect(store.estadoListado).toBe('success')
  })

  it('marca el listado vacío', async () => {
    anunciosService.listar.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })
    const store = useAnunciosStore()

    await store.cargarListado({ estado: 'disponible', orden: 'fecha_desc', pagina: 1 })

    expect(store.estadoListado).toBe('empty')
  })

  it('registra un error de listado', async () => {
    anunciosService.listar.mockRejectedValue(
      new ApiError({ estado: 0, codigo: 'ERROR_CONEXION', mensaje: 'Sin conexión', tipo: 'conexion' })
    )
    const store = useAnunciosStore()

    await store.cargarListado({ estado: 'disponible', orden: 'fecha_desc', pagina: 1 })

    expect(store.estadoListado).toBe('error')
    expect(store.errorListado.mensaje).toBe('Sin conexión')
  })

  it('carga el detalle y distingue no encontrado', async () => {
    anunciosService.detalle.mockResolvedValue({ id: 1, titulo: 'Bicicleta' })
    const store = useAnunciosStore()

    await store.cargarDetalle(1)

    expect(store.estadoDetalle).toBe('success')
    expect(store.detalle.titulo).toBe('Bicicleta')

    anunciosService.detalle.mockRejectedValue(
      new ApiError({ estado: 404, codigo: 'NO_ENCONTRADO', mensaje: 'No existe' })
    )

    await store.cargarDetalle(999)

    expect(store.estadoDetalle).toBe('notfound')
  })

  it('limpia el detalle privado al cambiar la versión de sesión', () => {
    const store = useAnunciosStore()
    store.detalle = {
      id: 1,
      conversacion: { id: 4 },
      ultimos_mensajes: [{ texto: 'Hola' }]
    }
    store.estadoDetalle = 'success'

    store.sincronizarSesion(1)

    expect(store.detalle).toBeNull()
    expect(store.estadoDetalle).toBe('idle')
    expect(store.versionSesion).toBe(1)

    store.detalle = { id: 2, conversacion: { id: 8 } }
    store.sincronizarSesion(1)
    expect(store.detalle.id).toBe(2)

    store.sincronizarSesion(2)
    expect(store.detalle).toBeNull()
  })

  it('ignora un detalle privado que llega después del cambio de sesión', async () => {
    let resolver
    anunciosService.detalle.mockImplementation(
      () => new Promise((resolve) => {
        resolver = resolve
      })
    )
    const store = useAnunciosStore()

    const carga = store.cargarDetalle(1)
    store.sincronizarSesion(1)
    resolver({ id: 1, conversacion: { id: 4 }, ultimos_mensajes: [{ texto: 'Hola' }] })
    await carga

    expect(store.detalle).toBeNull()
    expect(store.estadoDetalle).toBe('idle')
  })
})
