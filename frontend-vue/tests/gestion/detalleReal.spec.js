import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnuncioDetalleView from '../../src/views/AnuncioDetalleView.vue'
import { useSessionStore } from '../../src/stores/session'
import { http } from '../../src/services/http'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

vi.mock('../../src/services/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

const anuncio = {
  id: 8,
  titulo: 'Bicicleta de montaña',
  descripcion: 'Bicicleta de 29 pulgadas',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  autor: {
    id: 1,
    nombre: 'Ana Ruiz',
    biografia: 'Perfil de prueba',
    fecha_alta: '2026-11-10T09:00:00.000Z',
    valoracion_media: 4.5,
    num_valoraciones: 2
  },
  categoria: { id: 8, nombre: 'Bicicletas' },
  num_favoritos: 3,
  es_favorito: false
}

describe('detalle con la forma real del backend', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.sessionStorage.clear()
  })

  it('muestra las acciones al autor y oculta el favorito propio', async () => {
    http.get.mockResolvedValue({ datos: { anuncio } })
    const pinia = createPinia()
    setActivePinia(pinia)
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana Ruiz' })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'anuncios', component: { template: '<div />' } },
        { path: '/anuncios/:id', name: 'anuncio-detalle', component: AnuncioDetalleView },
        { path: '/anuncios/:id/editar', name: 'anuncio-editar', component: { template: '<div />' } },
        { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }
      ]
    })
    await router.push('/anuncios/8')
    await router.isReady()

    const wrapper = mount(AnuncioDetalleView, {
      global: { plugins: [pinia, router] }
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Bicicleta de montaña')
    expect(wrapper.text()).toContain('Editar')
    expect(wrapper.text()).toContain('Marcar como vendido')
    expect(wrapper.text()).toContain('Eliminar')
    expect(wrapper.text()).not.toContain('Añadir a favoritos')
  })
})
