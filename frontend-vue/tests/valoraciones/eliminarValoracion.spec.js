import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FormularioValoracion from '../../src/components/valoraciones/FormularioValoracion.vue'
import { useValoracionesStore } from '../../src/stores/valoraciones'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }]
  })
  await router.push('/usuarios/2')
  await router.isReady()
  const wrapper = mount(FormularioValoracion, {
    props: { usuarioId: 2, nombre: 'Carlos', valoracion: { puntuacion: 4, comentario: 'Bien' } },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, valoraciones: useValoracionesStore() }
}

describe('eliminar valoración', () => {
  beforeEach(() => vi.clearAllMocks())

  it('pide confirmación y elimina', async () => {
    const { wrapper, valoraciones } = await montar()
    const eliminar = vi.spyOn(valoraciones, 'eliminar').mockResolvedValue()

    await wrapper.findAll('button').find((b) => b.text() === 'Eliminar valoración').trigger('click')
    await wrapper.get('.confirm-dialog .button--danger').trigger('click')
    await flushPromises()

    expect(eliminar).toHaveBeenCalledWith(2)
    expect(wrapper.emitted('eliminado')).toHaveLength(1)
  })

  it('cancelar no elimina', async () => {
    const { wrapper, valoraciones } = await montar()
    const eliminar = vi.spyOn(valoraciones, 'eliminar')

    await wrapper.findAll('button').find((b) => b.text() === 'Eliminar valoración').trigger('click')
    await wrapper.findAll('button').find((b) => b.text() === 'Cancelar').trigger('click')

    expect(eliminar).not.toHaveBeenCalled()
  })

  it('converge si ya no existe', async () => {
    const { wrapper, valoraciones } = await montar()
    vi.spyOn(valoraciones, 'eliminar').mockRejectedValue({ estado: 404 })

    await wrapper.findAll('button').find((b) => b.text() === 'Eliminar valoración').trigger('click')
    await wrapper.get('.confirm-dialog .button--danger').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('eliminado')).toHaveLength(1)
  })
})
