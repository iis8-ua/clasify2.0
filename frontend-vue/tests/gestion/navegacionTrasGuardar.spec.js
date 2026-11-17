import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnuncioCrearView from '../../src/views/AnuncioCrearView.vue'
import AnuncioEditarView from '../../src/views/AnuncioEditarView.vue'
import { anunciosService } from '../../src/services/anunciosService'
import { categoriasService } from '../../src/services/categoriasService'
import { useSessionStore } from '../../src/stores/session'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: {
    detalle: vi.fn(),
    crear: vi.fn(),
    actualizar: vi.fn()
  }
}))

vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn()
  }
}))

const detalle = {
  id: 8,
  titulo: 'Bicicleta de montaña',
  descripcion: 'Bicicleta de 29 pulgadas',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  autor: { id: 1, nombre: 'Ana Ruiz' },
  categoria: { id: 8, nombre: 'Bicicletas' },
  num_favoritos: 3,
  es_favorito: false
}

beforeEach(() => {
  vi.clearAllMocks()
  window.sessionStorage.clear()
  categoriasService.listar.mockResolvedValue({
    datos: [{ id: 8, nombre: 'Bicicletas' }],
    paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
  })
})

async function montar(rutas, rutaInicial) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  session.establecerSesion('token', { id: 1, nombre: 'Ana Ruiz' })
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push(rutaInicial)
  await router.isReady()
  const wrapper = mount(
    { template: '<RouterView />' },
    { global: { plugins: [pinia, router] } }
  )
  await flushPromises()
  return { wrapper, router }
}

describe('navegación después de guardar', () => {
  it('reemplaza el formulario de creación para que volver no regrese a él', async () => {
    anunciosService.crear.mockResolvedValue({ ...detalle, id: 99 })
    const { wrapper, router } = await montar(
      [
        { path: '/', name: 'anuncios', component: { template: '<div />' } },
        { path: '/anuncios/nuevo', name: 'anuncio-crear', component: AnuncioCrearView },
        { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
      ],
      '/'
    )
    await router.push('/anuncios/nuevo')
    await flushPromises()

    await wrapper.get('#anuncio-titulo').setValue('Anuncio nuevo')
    await wrapper.get('#anuncio-descripcion').setValue('Descripción del anuncio')
    await wrapper.get('#anuncio-precio').setValue('10.50')
    await wrapper.get('#anuncio-categoria').setValue('8')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('anuncio-detalle')

    router.back()
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('anuncios')
  })

  it('reemplaza el formulario de edición para que volver no regrese a él', async () => {
    anunciosService.detalle.mockResolvedValue({ ...detalle })
    anunciosService.actualizar.mockResolvedValue({ ...detalle, titulo: 'Bicicleta revisada' })
    const { wrapper, router } = await montar(
      [
        { path: '/', name: 'anuncios', component: { template: '<div />' } },
        { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
        { path: '/anuncios/:id/editar', name: 'anuncio-editar', component: AnuncioEditarView }
      ],
      '/'
    )
    await router.push('/anuncios/8')
    await router.push('/anuncios/8/editar')
    await flushPromises()

    await wrapper.get('#anuncio-titulo').setValue('Bicicleta revisada')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('anuncio-detalle')

    router.back()
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('anuncio-detalle')
    expect(router.currentRoute.value.name).not.toBe('anuncio-editar')
  })
})
