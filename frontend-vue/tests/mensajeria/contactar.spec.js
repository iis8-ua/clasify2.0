import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import ModalContactar from '../../src/components/mensajeria/ModalContactar.vue'
import { useMensajesStore } from '../../src/stores/mensajes'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))

const rutas = [
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } }
]

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/25')
  await router.isReady()
  const wrapper = mount(ModalContactar, {
    props: { anuncio: { id: 25, titulo: 'Bicicleta' }, open: true },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router, mensajes: useMensajesStore() }
}

describe('modal de contacto', () => {
  beforeEach(() => vi.clearAllMocks())

  it('valida el mensaje obligatorio', async () => {
    const { wrapper, mensajes } = await montar()
    const iniciar = vi.spyOn(mensajes, 'iniciar')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('El mensaje es obligatorio')
    expect(iniciar).not.toHaveBeenCalled()
  })

  it('envía el primer mensaje y emite la conversación', async () => {
    const { wrapper, mensajes } = await montar()
    vi.spyOn(mensajes, 'iniciar').mockResolvedValue({ conversacion: { id: 4 }, mensaje: { id: 1 } })

    await wrapper.get('#contact-message').setValue('Hola')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(mensajes.iniciar).toHaveBeenCalledWith(25, 'Hola')
    expect(wrapper.emitted('enviado')[0]).toEqual([4])
  })

  it('solicita acceso si la sesión no es válida', async () => {
    const { wrapper, router, mensajes } = await montar()
    vi.spyOn(mensajes, 'iniciar').mockRejectedValue({ estado: 401, codigo: 'TOKEN_CADUCADO' })

    await wrapper.get('#contact-message').setValue('Hola')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
  })
})
