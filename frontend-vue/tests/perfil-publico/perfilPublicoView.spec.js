import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PerfilPublicoView from '../../src/views/PerfilPublicoView.vue'
import { perfilPublicoService } from '../../src/services/perfilPublicoService'
import { categoriasService } from '../../src/services/categoriasService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/perfilPublicoService', () => ({
  perfilPublicoService: { perfil: vi.fn(), anuncios: vi.fn(), valoraciones: vi.fn() }
}))
vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() }
}))

const perfil = { id: 1, nombre: 'Ana Ruiz', biografia: 'Perfil de prueba', fecha_alta: '2026-11-10T09:00:00.000Z', valoracion_media: 4.5, num_valoraciones: 2 }

async function montar(ruta = '/usuarios/1') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/usuarios/:id', name: 'perfil-publico', component: PerfilPublicoView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(PerfilPublicoView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('vista de perfil público', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    perfilPublicoService.perfil.mockResolvedValue(perfil)
    perfilPublicoService.anuncios.mockResolvedValue({ datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } })
    perfilPublicoService.valoraciones.mockResolvedValue({ datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } })
    categoriasService.listar.mockResolvedValue({ datos: [{ id: 8, nombre: 'Bicicletas' }], paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 } })
  })

  it('muestra datos públicos sin email', async () => {
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('Ana Ruiz')
    expect(wrapper.text()).toContain('Perfil de prueba')
    expect(wrapper.text()).toContain('4.5 de 5')
    expect(wrapper.text()).not.toContain('@')
  })

  it('muestra no encontrado', async () => {
    perfilPublicoService.perfil.mockRejectedValue(new ApiError({ estado: 404, codigo: 'NO_ENCONTRADO', mensaje: 'No existe' }))
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('Perfil no encontrado')
  })

  it('muestra error y reintenta', async () => {
    perfilPublicoService.perfil.mockRejectedValueOnce(new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo' }))
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('No se pudo cargar el perfil')
    await wrapper.findAll('button').find((b) => b.text() === 'Reintentar').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Ana Ruiz')
  })

  it('muestra estados vacíos de valoraciones y anuncios', async () => {
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('Sin valoraciones')
    expect(wrapper.text()).toContain('Sin anuncios')
  })
})
