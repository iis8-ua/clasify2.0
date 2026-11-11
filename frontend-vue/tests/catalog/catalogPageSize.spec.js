import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnunciosListView from '../../src/views/AnunciosListView.vue'
import SelectorTamanoPagina from '../../src/components/catalog/SelectorTamanoPagina.vue'
import { anunciosService } from '../../src/services/anunciosService'
import { categoriasService } from '../../src/services/categoriasService'

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: { listar: vi.fn() }
}))
vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() }
}))

async function montar(ruta = '/') {
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
  const wrapper = mount(AnunciosListView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('tamaño de página del catálogo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
    anunciosService.listar.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })
  })

  it('emite el tamaño elegido y vuelve a página 1', async () => {
    const wrapper = mount(SelectorTamanoPagina, { props: { modelValue: 20 } })
    await wrapper.get('select').setValue('50')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([50])
  })

  it('actualiza la URL y la petición al cambiar el tamaño', async () => {
    anunciosService.listar.mockImplementation(({ pagina, limite }) =>
      Promise.resolve({
        datos: [{ id: 1, titulo: 'Bicicleta', precio: '250.00', estado: 'disponible', imagen: null, fecha_creacion: '2026-11-08T10:00:00.000Z', id_categoria: 8, id_autor: 2 }],
        paginacion: { pagina, limite, total: 21, paginas: 2 }
      })
    )
    const { wrapper, router } = await montar('/?pagina=2&limite=20')

    await wrapper.get('.page-size select').setValue('50')
    await flushPromises()

    expect(router.currentRoute.value.query.limite).toBe('50')
    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(anunciosService.listar).toHaveBeenLastCalledWith(
      expect.objectContaining({ pagina: 1, limite: 50 })
    )
  })
})
