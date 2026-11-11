import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import BotonQuitarFavorito from '../../src/components/favoritos/BotonQuitarFavorito.vue'
import { useFavoritosStore } from '../../src/stores/favoritos'
import { ApiError } from '../../src/services/errors'

const { toastAdd } = vi.hoisted(() => ({ toastAdd: vi.fn() }))
vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: toastAdd }) }))

const rutas = [
  { path: '/favoritos', name: 'favoritos', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } }
]

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/favoritos')
  await router.isReady()
  const wrapper = mount(BotonQuitarFavorito, {
    props: { anuncio: { id: 25, titulo: 'Bicicleta' } },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router, favoritos: useFavoritosStore() }
}

describe('botón de quitar favorito', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toastAdd.mockClear()
  })

  it('pide confirmación y emite el anuncio retirado', async () => {
    const { wrapper, favoritos } = await montar()
    const quitar = vi.spyOn(favoritos, 'quitar').mockResolvedValue()

    expect(wrapper.get('.favorite-remove button').attributes('aria-label')).toBe('Quitar Bicicleta de favoritos')

    await wrapper.get('button').trigger('click')
    await wrapper.get('.confirm-dialog .button--danger').trigger('click')
    await flushPromises()

    expect(quitar).toHaveBeenCalledWith(25)
    expect(wrapper.emitted('quitar')[0]).toEqual([25])
    expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({
      detail: 'Anuncio quitado de favoritos'
    }))
  })

  it('cancelar no elimina el favorito', async () => {
    const { wrapper, favoritos } = await montar()
    const quitar = vi.spyOn(favoritos, 'quitar').mockResolvedValue()

    expect(wrapper.get('.favorite-remove button').attributes('aria-label')).toBe('Quitar Bicicleta de favoritos')

    await wrapper.get('button').trigger('click')
    await wrapper.findAll('button').find((boton) => boton.text() === 'Cancelar').trigger('click')

    expect(quitar).not.toHaveBeenCalled()
    expect(wrapper.emitted('quitar')).toBeUndefined()
  })

  it('converge a retirado si el favorito ya no existe', async () => {
    const { wrapper, favoritos } = await montar()
    vi.spyOn(favoritos, 'quitar').mockRejectedValue(
      new ApiError({ estado: 404, codigo: 'NO_ENCONTRADO', mensaje: 'No existe' })
    )

    await wrapper.get('button').trigger('click')
    await wrapper.get('.confirm-dialog .button--danger').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('quitar')[0]).toEqual([25])
  })
})
