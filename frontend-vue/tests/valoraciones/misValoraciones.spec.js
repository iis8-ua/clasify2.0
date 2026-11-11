import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import MisValoracionesSection from '../../src/components/valoraciones/MisValoracionesSection.vue'
import { useSessionStore } from '../../src/stores/session'
import { valoracionesService } from '../../src/services/valoracionesService'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))
vi.mock('../../src/services/valoracionesService', () => ({
  valoracionesService: { listarRecibidas: vi.fn(), listarEscritas: vi.fn(), eliminar: vi.fn() }
}))

async function montar(ruta = '/perfil') {
  const pinia = createPinia()
  setActivePinia(pinia)
  useSessionStore().establecerSesion('token', { id: 1, nombre: 'Ana' })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/perfil', name: 'perfil', component: MisValoracionesSection },
      { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(MisValoracionesSection, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('mis valoraciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    valoracionesService.listarRecibidas.mockResolvedValue({ datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } })
    valoracionesService.listarEscritas.mockResolvedValue({ datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } })
  })

  it('corrige una página de recibidas fuera de rango', async () => {
    valoracionesService.listarRecibidas.mockImplementation((_id, { pagina }) =>
      Promise.resolve({
        datos: pagina === 5 ? [] : [{ id: 1, puntuacion: 5, comentario: 'Bien', fecha: '2026-11-11T10:00:00.000Z', autor: { id: 2 } }],
        paginacion: { pagina, limite: 20, total: 21, paginas: 2 }
      })
    )
    const { router } = await montar('/perfil?valoracionesRecibidasPagina=5')

    expect(router.currentRoute.value.query.valoracionesRecibidasPagina).toBe('2')
    expect(valoracionesService.listarRecibidas).toHaveBeenLastCalledWith(1, { pagina: 2, limite: 20 })
  })

  it('normaliza un tamaño inválido y conserva el resto', async () => {
    valoracionesService.listarEscritas.mockResolvedValue({ datos: [], paginacion: { pagina: 2, limite: 20, total: 41, paginas: 3 } })
    const { router } = await montar('/perfil?valoracionesRecibidasLimite=abc&valoracionesEscritasPagina=2')

    expect(router.currentRoute.value.query.valoracionesRecibidasLimite).toBeUndefined()
    expect(router.currentRoute.value.query.valoracionesEscritasPagina).toBe('2')
  })
})
