import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FavoritosView from '../../src/views/FavoritosView.vue'
import { favoritosService } from '../../src/services/favoritosService'
import { categoriasService } from '../../src/services/categoriasService'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))
vi.mock('../../src/services/favoritosService', () => ({
  favoritosService: { listar: vi.fn(), quitar: vi.fn() }
}))
vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() }
}))

const anuncio = {
  id: 25,
  titulo: 'Bicicleta',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1
}

async function montar(ruta = '/favoritos') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/favoritos', name: 'favoritos', component: FavoritosView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(FavoritosView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('acciones de la lista de favoritos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
  })

  it('quita una tarjeta tras confirmar y la retira de la lista', async () => {
    favoritosService.listar.mockResolvedValue({
      datos: [anuncio],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
    favoritosService.quitar.mockResolvedValue()
    const { wrapper } = await montar()

    await wrapper.get('.favorite-remove button').trigger('click')
    await wrapper.get('.confirm-dialog .button--danger').trigger('click')
    await flushPromises()

    expect(favoritosService.quitar).toHaveBeenCalledWith(25)
    expect(wrapper.findAll('.anuncio-card')).toHaveLength(0)
  })
})
