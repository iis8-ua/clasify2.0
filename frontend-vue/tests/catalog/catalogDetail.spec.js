import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnuncioDetalleView from '../../src/views/AnuncioDetalleView.vue'
import { anunciosService } from '../../src/services/anunciosService'
import { ApiError } from '../../src/services/errors'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: {
    listar: vi.fn(),
    detalle: vi.fn()
  }
}))

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div />' } },
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: AnuncioDetalleView }
]

const detalle = {
  id: 1,
  titulo: 'Bicicleta de montaña',
  descripcion: 'Bicicleta de 29 pulgadas',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_autor: 1,
  id_categoria: 8,
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

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/1')
  await router.isReady()
  return mount(AnuncioDetalleView, {
    global: { plugins: [pinia, router] }
  })
}

describe('detalle de anuncio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra los datos públicos del anuncio', async () => {
    anunciosService.detalle.mockResolvedValue(detalle)
    const wrapper = await montar()
    await flushPromises()

    expect(wrapper.text()).toContain('Bicicleta de montaña')
    expect(wrapper.text()).toContain('250,00')
    expect(wrapper.text()).toContain('Bicicletas')
    expect(wrapper.text()).toContain('Ana Ruiz')
    expect(wrapper.text()).toContain('4.5 de 5')
    expect(wrapper.text()).toContain('3 favoritos')
    expect(wrapper.text()).not.toContain('ana@example.com')
    expect(wrapper.text()).not.toContain('Editar')
    expect(wrapper.text()).not.toContain('Eliminar')
  })

  it('muestra anuncio no encontrado', async () => {
    anunciosService.detalle.mockRejectedValue(
      new ApiError({ estado: 404, codigo: 'NO_ENCONTRADO', mensaje: 'No existe' })
    )
    const wrapper = await montar()
    await flushPromises()

    expect(wrapper.text()).toContain('Anuncio no encontrado')
  })
})
