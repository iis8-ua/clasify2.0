import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnunciosListView from '../../src/views/AnunciosListView.vue'
import { anunciosService } from '../../src/services/anunciosService'
import { categoriasService } from '../../src/services/categoriasService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: {
    listar: vi.fn()
  }
}))

vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn()
  }
}))

const anuncio = {
  id: 21,
  titulo: 'Anuncio de la página dos',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1
}

async function montar(ruta = '/?pagina=2') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'anuncios', component: AnunciosListView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(AnunciosListView, {
    global: { plugins: [pinia, router] }
  })
  await flushPromises()
  return { wrapper, router }
}

describe('paginación del catálogo con error', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
  })

  it('conserva la página y permite reintentar cuando falla una página', async () => {
    anunciosService.listar.mockRejectedValueOnce(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const { wrapper, router } = await montar()

    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(wrapper.text()).toContain('No se pudo cargar el catálogo')

    anunciosService.listar.mockResolvedValue({
      datos: [anuncio],
      paginacion: { pagina: 2, limite: 20, total: 21, paginas: 2 }
    })
    await wrapper.findAll('button').find((boton) => boton.text() === 'Reintentar').trigger('click')
    await flushPromises()

    expect(anunciosService.listar).toHaveBeenLastCalledWith({
      texto: '',
      categoria: null,
      estado: 'disponible',
      orden: 'fecha_desc',
      pagina: 2
    })
    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(wrapper.text()).toContain('Anuncio de la página dos')
  })
})
