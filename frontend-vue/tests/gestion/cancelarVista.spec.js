import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnuncioCrearView from '../../src/views/AnuncioCrearView.vue'
import { categoriasService } from '../../src/services/categoriasService'
import { useSessionStore } from '../../src/stores/session'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn()
  }
}))

describe('cancelación de creación', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
  })

  it('pide confirmación si hay cambios y respeta la cancelación', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'anuncios', component: { template: '<div />' } },
        { path: '/login', name: 'login', component: { template: '<div />' } },
        { path: '/anuncios/nuevo', name: 'anuncio-crear', component: AnuncioCrearView }
      ]
    })
    await router.push('/anuncios/nuevo')
    await router.isReady()
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = mount(
      { template: '<RouterView />' },
      { global: { plugins: [pinia, router] } }
    )
    await flushPromises()

    await wrapper.get('#anuncio-titulo').setValue('Cambio sin guardar')
    await flushPromises()
    await wrapper.findAll('button').find((boton) => boton.text() === 'Cancelar').trigger('click')
    await flushPromises()

    expect(confirmar).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('anuncio-crear')

    confirmar.mockReturnValue(true)
    await wrapper.findAll('button').find((boton) => boton.text() === 'Cancelar').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('anuncios')
    confirmar.mockRestore()
  })

  it('permite ir a login con cambios si la sesión ya no es válida', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'anuncios', component: { template: '<div />' } },
        { path: '/login', name: 'login', component: { template: '<div />' } },
        { path: '/anuncios/nuevo', name: 'anuncio-crear', component: AnuncioCrearView }
      ]
    })
    await router.push('/anuncios/nuevo')
    await router.isReady()
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const wrapper = mount(
      { template: '<RouterView />' },
      { global: { plugins: [pinia, router] } }
    )
    await flushPromises()

    await wrapper.get('#anuncio-titulo').setValue('Cambio sin guardar')
    await flushPromises()
    session.cerrarSesion()
    await router.push('/login')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(confirmar).not.toHaveBeenCalled()
    confirmar.mockRestore()
  })
})
