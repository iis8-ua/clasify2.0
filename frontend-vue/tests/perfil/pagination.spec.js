import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import MisAnunciosSection from '../../src/components/perfil/MisAnunciosSection.vue'
import { usuariosService } from '../../src/services/usuariosService'
import { categoriasService } from '../../src/services/categoriasService'

vi.mock('../../src/services/usuariosService', () => ({
  usuariosService: {
    perfil: vi.fn(),
    actualizarPerfil: vi.fn(),
    cambiarContrasena: vi.fn(),
    listarAnuncios: vi.fn()
  }
}))

vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn()
  }
}))

function crearAnuncio(id) {
  return {
    id,
    titulo: `Anuncio ${id}`,
    precio: `${id}.00`,
    estado: 'disponible',
    imagen: null,
    fecha_creacion: '2026-11-08T10:00:00.000Z',
    id_categoria: 8,
    id_autor: 1
  }
}

const anuncios = Array.from({ length: 21 }, (_valor, indice) => crearAnuncio(indice + 1))

function respuestaPagina(pagina, datos) {
  return {
    datos,
    paginacion: {
      pagina,
      limite: 20,
      total: 21,
      paginas: 2
    }
  }
}

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/perfil', name: 'perfil', component: MisAnunciosSection },
      { path: '/anuncios/nuevo', name: 'anuncio-crear', component: { template: '<div />' } },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push('/perfil?pagina=1')
  await router.isReady()
  const wrapper = mount(MisAnunciosSection, {
    global: { plugins: [pinia, router] }
  })
  await flushPromises()
  return { wrapper, router }
}

describe('paginación de anuncios propios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
    usuariosService.listarAnuncios.mockImplementation(({ pagina }) =>
      Promise.resolve(
        respuestaPagina(pagina, pagina === 1 ? anuncios.slice(0, 20) : anuncios.slice(20))
      )
    )
  })

  it('recorre todas las páginas y conserva la página en la URL', async () => {
    const { wrapper, router } = await montar()

    expect(wrapper.findAll('.anuncio-card')).toHaveLength(20)
    expect(wrapper.text()).toContain('Página 1 de 2')
    expect(wrapper.findAll('button').find((boton) => boton.text() === 'Anterior').attributes('disabled')).toBeDefined()

    await wrapper.findAll('button').find((boton) => boton.text() === 'Siguiente').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(usuariosService.listarAnuncios).toHaveBeenLastCalledWith({ pagina: 2, limite: 20 })
    expect(wrapper.findAll('.anuncio-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('Anuncio 21')
    expect(wrapper.text()).toContain('Página 2 de 2')
    expect(wrapper.findAll('button').find((boton) => boton.text() === 'Siguiente').attributes('disabled')).toBeDefined()
  })
})
