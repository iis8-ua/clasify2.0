import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAnunciosStore } from '../../src/stores/anuncios'
import { anunciosService } from '../../src/services/anunciosService'

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: {
    listar: vi.fn(),
    detalle: vi.fn(),
    crear: vi.fn(),
    actualizar: vi.fn(),
    cambiarEstado: vi.fn(),
    eliminar: vi.fn()
  }
}))

describe('store de gestión de anuncios', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('crea un anuncio y actualiza el detalle', async () => {
    anunciosService.crear.mockResolvedValue({ id: 5, titulo: 'Nuevo' })
    const store = useAnunciosStore()

    const anuncio = await store.crear({ titulo: 'Nuevo' }, null)

    expect(anuncio.id).toBe(5)
    expect(store.detalle.id).toBe(5)
    expect(store.estadoDetalle).toBe('success')
  })

  it('actualiza el detalle y el elemento del listado', async () => {
    anunciosService.actualizar.mockResolvedValue({ id: 1, titulo: 'Actualizado' })
    const store = useAnunciosStore()
    store.listado = [{ id: 1, titulo: 'Anterior' }]

    await store.actualizar(1, { titulo: 'Actualizado' }, null)

    expect(store.detalle.titulo).toBe('Actualizado')
    expect(store.listado[0].titulo).toBe('Actualizado')
  })

  it('cambia el estado del anuncio', async () => {
    anunciosService.cambiarEstado.mockResolvedValue({ id: 1, estado: 'vendido' })
    const store = useAnunciosStore()

    await store.cambiarEstado(1, 'vendido')

    expect(store.detalle.estado).toBe('vendido')
  })

  it('elimina el anuncio del listado y del detalle', async () => {
    anunciosService.eliminar.mockResolvedValue()
    const store = useAnunciosStore()
    store.listado = [{ id: 1, titulo: 'Anuncio' }]
    store.detalle = { id: 1, titulo: 'Anuncio' }

    await store.eliminar(1)

    expect(store.listado).toHaveLength(0)
    expect(store.detalle).toBeNull()
  })
})
