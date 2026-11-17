import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import MisAnunciosSection from '../../src/components/perfil/MisAnunciosSection.vue'
import { usuariosService } from '../../src/services/usuariosService'
import { categoriasService } from '../../src/services/categoriasService'
import { ApiError } from '../../src/services/errors'

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

const anuncio = {
  id: 1,
  titulo: 'Bicicleta de montaña',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1
}

async function montar(ruta = '/perfil') {
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
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(MisAnunciosSection, {
    global: { plugins: [pinia, router] }
  })
  await flushPromises()
  return { wrapper, router }
}

describe('sección de anuncios propios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [anuncio, { ...anuncio, id: 2, titulo: 'Mesa vendida', estado: 'vendido' }],
      paginacion: { pagina: 1, limite: 20, total: 2, paginas: 1 }
    })
  })

  it('muestra solo los anuncios propios y su estado', async () => {
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('Bicicleta de montaña')
    expect(wrapper.text()).toContain('Mesa vendida')
    expect(wrapper.text()).toContain('Bicicletas')
    expect(wrapper.text()).toContain('Vendido')
    expect(wrapper.get('.anuncio-card__title').element.tagName).toBe('H3')
    expect(wrapper.text()).not.toContain('Editar')
    expect(wrapper.text()).not.toContain('Eliminar')
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Paginación de mis anuncios')
  })

  it('ofrece crear un anuncio desde el estado vacío', async () => {
    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })
    const { wrapper, router } = await montar()

    expect(wrapper.text()).toContain('Sin anuncios publicados')
    await wrapper.findAll('button').find((boton) => boton.text() === 'Publicar anuncio').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('anuncio-crear')
  })

  it('muestra error y permite reintentar', async () => {
    usuariosService.listarAnuncios.mockRejectedValueOnce(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('No se pudieron cargar tus anuncios')
    expect(wrapper.text()).toContain('Fallo del servidor')

    await wrapper.findAll('button').find((boton) => boton.text() === 'Reintentar').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Bicicleta de montaña')
  })

  it('conserva la página y permite reintentar cuando falla una página', async () => {
    usuariosService.listarAnuncios.mockRejectedValueOnce(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const { wrapper, router } = await montar('/perfil?pagina=2')

    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(wrapper.text()).toContain('No se pudieron cargar tus anuncios')

    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [anuncio],
      paginacion: { pagina: 2, limite: 20, total: 21, paginas: 2 }
    })
    await wrapper.findAll('button').find((boton) => boton.text() === 'Reintentar').trigger('click')
    await flushPromises()

    expect(usuariosService.listarAnuncios).toHaveBeenLastCalledWith({ pagina: 2, limite: 20 })
    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(wrapper.text()).toContain('Bicicleta de montaña')
  })

  it('sincroniza la página con la URL y corrige una página fuera de rango', async () => {
    usuariosService.listarAnuncios.mockImplementation(({ pagina }) => {
      if (pagina === 5) {
        return Promise.resolve({
          datos: [],
          paginacion: { pagina: 5, limite: 20, total: 21, paginas: 2 }
        })
      }
      return Promise.resolve({
        datos: [anuncio],
        paginacion: { pagina: 2, limite: 20, total: 21, paginas: 2 }
      })
    })

    const { wrapper, router } = await montar('/perfil?pagina=5')

    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(usuariosService.listarAnuncios).toHaveBeenLastCalledWith({ pagina: 2, limite: 20 })
    expect(wrapper.text()).toContain('Bicicleta de montaña')
  })

  it('normaliza una página no válida a la primera', async () => {
    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })

    const { router } = await montar('/perfil?pagina=abc')

    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(usuariosService.listarAnuncios).toHaveBeenCalledWith({ pagina: 1, limite: 20 })
  })

  it('normaliza una página fuera de rango cuando no hay anuncios', async () => {
    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 5, limite: 20, total: 0, paginas: 0 }
    })
    const { router } = await montar('/perfil?pagina=5')

    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(usuariosService.listarAnuncios).toHaveBeenLastCalledWith({ pagina: 1, limite: 20 })
  })
})
