import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnunciosListView from '../../src/views/AnunciosListView.vue'
import { anunciosService } from '../../src/services/anunciosService'
import { categoriasService } from '../../src/services/categoriasService'

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

describe('búsqueda demasiado larga en la URL', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el error y no ejecuta la búsqueda', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'anuncios', component: AnunciosListView }]
    })
    await router.push({ name: 'anuncios', query: { texto: 'a'.repeat(151) } })
    await router.isReady()

    const wrapper = mount(AnunciosListView, {
      global: { plugins: [pinia, router] }
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Búsqueda no válida')
    expect(wrapper.text()).toContain('150 caracteres')
    expect(anunciosService.listar).not.toHaveBeenCalled()
    expect(categoriasService.listar).not.toHaveBeenCalled()
  })
})
