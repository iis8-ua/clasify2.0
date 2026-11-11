import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import ModalContactar from '../../src/components/mensajeria/ModalContactar.vue'
import FormularioMensaje from '../../src/components/mensajeria/FormularioMensaje.vue'
import TarjetaConversacion from '../../src/components/mensajeria/TarjetaConversacion.vue'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))

const rutas = [
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
  { path: '/conversaciones/:id', name: 'conversacion', component: { template: '<div />' } },
  { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } }
]

async function montar(componente, props = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/25')
  await router.isReady()
  return mount(componente, { props, global: { plugins: [pinia, router] } })
}

describe('accesibilidad de mensajería', () => {
  beforeEach(() => vi.clearAllMocks())

  it('etiqueta el modal de contacto y su campo', async () => {
    const wrapper = await montar(ModalContactar, { anuncio: { id: 25, titulo: 'Bicicleta' }, open: true })
    expect(wrapper.get('[role="dialog"]').attributes('aria-labelledby')).toBe('contact-title')
    expect(wrapper.get('label[for="contact-message"]').text()).toBe('Mensaje')
    expect(wrapper.get('#contact-message').attributes('aria-required')).toBe('true')
  })

  it('etiqueta el formulario del hilo', async () => {
    const wrapper = await montar(FormularioMensaje, { conversacionId: 4 })
    expect(wrapper.get('label[for="message-text"]').text()).toBe('Mensaje')
    expect(wrapper.get('#message-text').attributes('required')).toBeDefined()
  })

  it('ofrece enlace accesible en la tarjeta', async () => {
    const conversacion = {
      id: 4,
      anuncio: { id: 25, titulo: 'Bicicleta', precio: '250.00', imagen: null },
      contraparte: { id: 2, nombre: 'Carlos' },
      ultimo_mensaje: { texto: 'Hola', fecha: '2026-11-11T10:00:00.000Z' },
      no_leidos: 1
    }
    const wrapper = await montar(TarjetaConversacion, { conversacion })
    expect(wrapper.get('a[href="/conversaciones/4"]').attributes('aria-label')).toBe(
      'Abrir conversación sobre Bicicleta'
    )
    expect(wrapper.get('.conversation-card__unread').text()).toContain('1 sin leer')
  })
})
