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
  id: 1,
  titulo: 'Bicicleta',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 2
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

describe('tamaño de página en favoritos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
    favoritosService.listar.mockResolvedValue({
      datos: [anuncio],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
  })

  it('carga el tamaño de la URL y lo conserva al cambiar de página', async () => {
    const { router } = await montar('/favoritos?limite=50')

    expect(favoritosService.listar).toHaveBeenCalledWith({ pagina: 1, limite: 50 })
    expect(router.currentRoute.value.query.limite).toBe('50')
  })

  it('cambia el tamaño, vuelve a página 1 y actualiza la URL', async () => {
    const { wrapper, router } = await montar('/favoritos?pagina=2&limite=20')
    await wrapper.get('.page-size select').setValue('50')
    await flushPromises()

    expect(favoritosService.listar).toHaveBeenLastCalledWith({ pagina: 1, limite: 50 })
    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(router.currentRoute.value.query.limite).toBe('50')
  })
})
