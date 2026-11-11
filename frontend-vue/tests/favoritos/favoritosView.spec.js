import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FavoritosView from '../../src/views/FavoritosView.vue'
import { favoritosService } from '../../src/services/favoritosService'
import { categoriasService } from '../../src/services/categoriasService'
import { ApiError } from '../../src/services/errors'

vi.mock('../../src/services/favoritosService', () => ({
  favoritosService: {
    listar: vi.fn()
  }
}))

vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn()
  }
}))

const anuncio = {
  id: 25,
  titulo: 'Bicicleta de montaña',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1
}

function respuestaListado(datos, paginacion) {
  return { datos, paginacion }
}

async function montar(ruta = '/favoritos') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'anuncios', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      { path: '/favoritos', name: 'favoritos', component: FavoritosView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(FavoritosView, {
    global: { plugins: [pinia, router] }
  })
  await flushPromises()
  return { wrapper, router }
}

describe('vista de favoritos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
  })

  it('muestra las tarjetas de los favoritos con su información', async () => {
    favoritosService.listar.mockResolvedValue(
      respuestaListado(
        [anuncio, { ...anuncio, id: 26, titulo: 'Mesa vendida', estado: 'vendido' }],
        { pagina: 1, limite: 20, total: 2, paginas: 1 }
      )
    )
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('Bicicleta de montaña')
    expect(wrapper.text()).toContain('Mesa vendida')
    expect(wrapper.text()).toContain('Bicicletas')
    expect(wrapper.text()).toContain('Vendido')
    expect(wrapper.text()).toContain('250,00')
    expect(wrapper.get('.anuncio-card__title').element.tagName).toBe('H2')
    expect(wrapper.text()).not.toContain('Quitar de favoritos')
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Paginación de favoritos')
  })

  it('muestra un estado vacío distinto del error', async () => {
    favoritosService.listar.mockResolvedValue(
      respuestaListado([], { pagina: 1, limite: 20, total: 0, paginas: 0 })
    )
    const { wrapper, router } = await montar()

    expect(wrapper.text()).toContain('Sin favoritos')
    expect(wrapper.text()).toContain('Explorar anuncios')

    await wrapper.findAll('button').find((boton) => boton.text() === 'Explorar anuncios').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('anuncios')
  })

  it('muestra un error comprensible y permite reintentar', async () => {
    favoritosService.listar.mockRejectedValueOnce(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('No se pudieron cargar los favoritos')
    expect(wrapper.text()).toContain('Fallo del servidor')

    favoritosService.listar.mockResolvedValue(
      respuestaListado([anuncio], { pagina: 1, limite: 20, total: 1, paginas: 1 })
    )
    await wrapper.findAll('button').find((boton) => boton.text() === 'Reintentar').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Bicicleta de montaña')
  })

  it('conserva la página y permite reintentar cuando falla una página', async () => {
    favoritosService.listar.mockRejectedValueOnce(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const { wrapper, router } = await montar('/favoritos?pagina=2')

    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(wrapper.text()).toContain('No se pudieron cargar los favoritos')

    favoritosService.listar.mockResolvedValue(
      respuestaListado([anuncio], { pagina: 2, limite: 20, total: 21, paginas: 2 })
    )
    await wrapper.findAll('button').find((boton) => boton.text() === 'Reintentar').trigger('click')
    await flushPromises()

    expect(favoritosService.listar).toHaveBeenLastCalledWith({ pagina: 2, limite: 20 })
    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(wrapper.text()).toContain('Bicicleta de montaña')
  })

  it('carga la página indicada en la URL', async () => {
    favoritosService.listar.mockResolvedValue(
      respuestaListado([anuncio], { pagina: 2, limite: 20, total: 21, paginas: 2 })
    )
    await montar('/favoritos?pagina=2')

    expect(favoritosService.listar).toHaveBeenCalledWith({ pagina: 2, limite: 20 })
  })

  it('solicita acceso si la sesión ha caducado', async () => {
    favoritosService.listar.mockRejectedValue(
      new ApiError({ estado: 401, codigo: 'TOKEN_CADUCADO', mensaje: 'Sesión caducada' })
    )
    const { router } = await montar()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/favoritos')
  })

  it('normaliza una página no válida a la primera', async () => {
    favoritosService.listar.mockResolvedValue(
      respuestaListado([], { pagina: 1, limite: 20, total: 0, paginas: 0 })
    )
    const { router } = await montar('/favoritos?pagina=abc')

    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(favoritosService.listar).toHaveBeenCalledWith({ pagina: 1, limite: 20 })
  })

  it('normaliza una página fuera de rango cuando no hay favoritos', async () => {
    favoritosService.listar.mockResolvedValue(
      respuestaListado([], { pagina: 5, limite: 20, total: 0, paginas: 0 })
    )
    const { router } = await montar('/favoritos?pagina=5')

    expect(router.currentRoute.value.query.pagina).toBeUndefined()
    expect(favoritosService.listar).toHaveBeenLastCalledWith({ pagina: 1, limite: 20 })
  })
})
