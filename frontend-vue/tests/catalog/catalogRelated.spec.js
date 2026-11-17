import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnunciosRelacionados from '../../src/components/catalog/AnunciosRelacionados.vue'
import { anunciosService } from '../../src/services/anunciosService'
import { categoriasService } from '../../src/services/categoriasService'

vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: { listar: vi.fn(), listarDeUsuario: vi.fn() }
}))
vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() }
}))

const actual = {
  id: 10,
  titulo: 'Actual',
  precio: '100.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 2
}

function crear(id, autor = 3, estado = 'disponible') {
  return { ...actual, id, titulo: `Anuncio ${id}`, id_autor: autor, estado }
}

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
      { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }
    ]
  })
  await router.push('/anuncios/10')
  await router.isReady()
  const wrapper = mount(AnunciosRelacionados, {
    props: { anuncio: actual },
    global: { plugins: [pinia, router] }
  })
  await flushPromises()
  return wrapper
}

describe('anuncios relacionados', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
  })

  it('muestra similares y del vendedor, sin el actual ni vendidos', async () => {
    anunciosService.listar.mockResolvedValue({ datos: [actual, crear(11), crear(12, 3, 'vendido')] })
    anunciosService.listarDeUsuario.mockResolvedValue({ datos: [actual, crear(21, 2), crear(22, 2)] })

    const wrapper = await montar()

    expect(wrapper.text()).toContain('Anuncios similares')
    expect(wrapper.text()).toContain('Más de este vendedor')
    expect(wrapper.text()).toContain('Anuncio 11')
    expect(wrapper.text()).toContain('Anuncio 21')
    expect(wrapper.text()).not.toContain('Anuncio 12')
    expect(wrapper.text()).not.toContain('Actual')
    expect(wrapper.get('a[href="/usuarios/2"]').text()).toBe('Ver perfil')
  })

  it('oculta secciones sin resultados', async () => {
    anunciosService.listar.mockResolvedValue({ datos: [actual] })
    anunciosService.listarDeUsuario.mockResolvedValue({ datos: [actual] })

    const wrapper = await montar()

    expect(wrapper.text()).not.toContain('Anuncios similares')
    expect(wrapper.text()).not.toContain('Más de este vendedor')
  })
})
