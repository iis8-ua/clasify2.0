import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import BotonFavorito from '../../src/components/favoritos/BotonFavorito.vue'
import { useSessionStore } from '../../src/stores/session'
import { useFavoritosStore } from '../../src/stores/favoritos'
import { ApiError } from '../../src/services/errors'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } },
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
]

const anuncio = {
  id: 25,
  titulo: 'Bicicleta',
  id_autor: 1,
  es_favorito: false,
  num_favoritos: 2
}

async function montar({ autenticado = true, datos = anuncio } = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  if (autenticado) {
    session.establecerSesion('token', { id: 2, nombre: 'Carlos' })
  }
  const favoritos = useFavoritosStore()
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/25')
  await router.isReady()
  const wrapper = mount(BotonFavorito, {
    props: { anuncio: datos },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router, favoritos, session }
}

describe('botón de favorito', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('invita a acceder a un visitante y conserva el anuncio de retorno', async () => {
    const { wrapper, router } = await montar({ autenticado: false })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/anuncios/25')
  })

  it('añade un favorito y actualiza el estado', async () => {
    const { wrapper, favoritos } = await montar()
    const anadir = vi.spyOn(favoritos, 'anadir').mockResolvedValue({ id: 1 })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(anadir).toHaveBeenCalledWith(25)
    expect(wrapper.emitted('cambio')[0][0]).toEqual({ esFavorito: true, numFavoritos: 3 })

    await wrapper.setProps({ anuncio: { ...anuncio, es_favorito: true, num_favoritos: 3 } })
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Quitar de favoritos')
  })

  it('quita un favorito y actualiza el estado', async () => {
    const { wrapper, favoritos } = await montar({
      datos: { ...anuncio, es_favorito: true, num_favoritos: 3 }
    })
    const quitar = vi.spyOn(favoritos, 'quitar').mockResolvedValue()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(quitar).toHaveBeenCalledWith(25)
    expect(wrapper.emitted('cambio')[0][0]).toEqual({ esFavorito: false, numFavoritos: 2 })
  })

  it('no procesa dos pulsaciones mientras la primera está en curso', async () => {
    const { wrapper, favoritos } = await montar()
    let resolver
    const anadir = vi.spyOn(favoritos, 'anadir').mockImplementation(
      () => new Promise((resolve) => {
        resolver = resolve
      })
    )

    await wrapper.get('button').trigger('click')
    await wrapper.get('button').trigger('click')

    expect(anadir).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()

    resolver({ id: 1 })
    await flushPromises()
  })

  it('oculta la acción al autor del anuncio', async () => {
    const { wrapper } = await montar({
      datos: { ...anuncio, id_autor: 2 }
    })

    expect(wrapper.text()).toBe('')
  })

  it('usa autor.id cuando el detalle no trae id_autor', async () => {
    const { wrapper } = await montar({
      datos: { ...anuncio, id_autor: undefined, autor: { id: 2 } }
    })

    expect(wrapper.text()).toBe('')
  })

  it('converge a no guardado al quitar un favorito inexistente', async () => {
    const { wrapper, favoritos } = await montar({
      datos: { ...anuncio, es_favorito: true, num_favoritos: 3 }
    })
    vi.spyOn(favoritos, 'quitar').mockRejectedValue(
      new ApiError({ estado: 404, codigo: 'NO_ENCONTRADO', mensaje: 'No está en favoritos' })
    )

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('cambio')[0][0]).toEqual({ esFavorito: false, numFavoritos: 2 })
    expect(wrapper.text()).not.toContain('No está en favoritos')
  })

  it('solicita acceso de nuevo si la sesión no es válida', async () => {
    const { wrapper, router, favoritos } = await montar()
    vi.spyOn(favoritos, 'anadir').mockRejectedValue(
      new ApiError({ estado: 401, codigo: 'TOKEN_CADUCADO', mensaje: 'Sesión caducada' })
    )

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/anuncios/25')
  })
})
