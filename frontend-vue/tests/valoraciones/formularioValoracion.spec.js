import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FormularioValoracion from '../../src/components/valoraciones/FormularioValoracion.vue'
import { useValoracionesStore } from '../../src/stores/valoraciones'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))

const rutas = [
  { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } }
]

async function montar(props = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/usuarios/2')
  await router.isReady()
  const wrapper = mount(FormularioValoracion, {
    props: { usuarioId: 2, nombre: 'Carlos', ...props },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router, valoraciones: useValoracionesStore() }
}

describe('formulario de valoración', () => {
  beforeEach(() => vi.clearAllMocks())

  it('valida puntuación y longitud del comentario', async () => {
    const { wrapper, valoraciones } = await montar()
    const guardar = vi.spyOn(valoraciones, 'guardar')

    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('La puntuación debe ser un entero entre 1 y 5')

    await wrapper.get('#rating-score').setValue('5')
    await wrapper.get('#rating-comment').setValue('a'.repeat(501))
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('no puede superar los 500')
    expect(guardar).not.toHaveBeenCalled()
  })

  it('precarga y guarda la valoración', async () => {
    const { wrapper, valoraciones } = await montar({
      valoracion: { puntuacion: 4, comentario: 'Bien' }
    })
    const guardar = vi.spyOn(valoraciones, 'guardar').mockResolvedValue({})

    expect(wrapper.get('#rating-score').element.value).toBe('4')
    expect(wrapper.get('#rating-comment').element.value).toBe('Bien')

    await wrapper.get('#rating-score').setValue('5')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(guardar).toHaveBeenCalledWith(2, { puntuacion: 5, comentario: 'Bien' })
    expect(wrapper.emitted('guardado')).toHaveLength(1)
  })

  it('solicita acceso si la sesión no es válida', async () => {
    const { wrapper, router, valoraciones } = await montar()
    vi.spyOn(valoraciones, 'guardar').mockRejectedValue({ estado: 401, codigo: 'TOKEN_CADUCADO' })

    await wrapper.get('#rating-score').setValue('5')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
  })
})
