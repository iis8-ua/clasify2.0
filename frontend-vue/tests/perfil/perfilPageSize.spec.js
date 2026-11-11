import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import MisAnunciosSection from '../../src/components/perfil/MisAnunciosSection.vue'
import { usuariosService } from '../../src/services/usuariosService'
import { categoriasService } from '../../src/services/categoriasService'

vi.mock('../../src/services/usuariosService', () => ({
  usuariosService: { listarAnuncios: vi.fn() }
}))
vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() }
}))

const anuncio = { id: 1, titulo: 'Bicicleta', precio: '250.00', estado: 'disponible', imagen: null, fecha_creacion: '2026-11-08T10:00:00.000Z', id_categoria: 8, id_autor: 1 }

async function montar(ruta = '/perfil') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/perfil', name: 'perfil', component: MisAnunciosSection },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(MisAnunciosSection, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('tamaño de página en anuncios propios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({ datos: [{ id: 8, nombre: 'Bicicletas' }], paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 } })
    usuariosService.listarAnuncios.mockResolvedValue({ datos: [anuncio], paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 } })
  })

  it('carga el tamaño de la URL y lo conserva al cambiar de página', async () => {
    const { router } = await montar('/perfil?limite=50')

    expect(usuariosService.listarAnuncios).toHaveBeenCalledWith({ pagina: 1, limite: 50 })
    expect(router.currentRoute.value.query.limite).toBe('50')
  })

  it('cambia el tamaño y vuelve a página 1', async () => {
    const { wrapper, router } = await montar('/perfil?pagina=2&limite=20')
    await wrapper.get('.page-size select').setValue('50')
    await flushPromises()

    expect(usuariosService.listarAnuncios).toHaveBeenLastCalledWith({ pagina: 1, limite: 50 })
    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(router.currentRoute.value.query.limite).toBe('50')
  })
})
