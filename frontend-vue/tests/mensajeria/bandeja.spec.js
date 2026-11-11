import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import MensajesView from '../../src/views/MensajesView.vue'
import { mensajesService } from '../../src/services/mensajesService'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))
vi.mock('../../src/services/mensajesService', () => ({
  mensajesService: { listarConversaciones: vi.fn() }
}))

const conversacion = {
  id: 4,
  anuncio: { id: 25, titulo: 'Bicicleta', precio: '250.00', estado: 'disponible', imagen: null, fecha_creacion: '2026-11-10T10:00:00.000Z', id_categoria: 8 },
  contraparte: { id: 2, nombre: 'Carlos' },
  ultimo_mensaje: { id: 12, texto: '¿Sigue disponible?', fecha: '2026-11-11T11:00:00.000Z' },
  no_leidos: 2
}

async function montar(ruta = '/mensajes') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/mensajes', name: 'mensajes', component: MensajesView },
      { path: '/conversaciones/:id', name: 'conversacion', component: { template: '<div />' } },
      { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } },
      { path: '/', name: 'anuncios', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(MensajesView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('bandeja de conversaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mensajesService.listarConversaciones.mockResolvedValue({
      datos: [conversacion],
      paginacion: { pagina: 1, limite: 20, total: 1, paginas: 1 }
    })
  })

  it('muestra conversación, no leídos y enlaces', async () => {
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('Bicicleta')
    expect(wrapper.text()).toContain('Carlos')
    expect(wrapper.text()).toContain('¿Sigue disponible?')
    expect(wrapper.text()).toContain('2 sin leer')
    expect(wrapper.get('a[href="/usuarios/2"]').text()).toBe('Carlos')
    expect(wrapper.get('a[href="/conversaciones/4"]').exists()).toBe(true)
  })

  it('muestra vacío y error', async () => {
    mensajesService.listarConversaciones.mockResolvedValueOnce({ datos: [], paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 } })
    const vacio = await montar()
    expect(vacio.wrapper.text()).toContain('Sin conversaciones')

    mensajesService.listarConversaciones.mockRejectedValueOnce({ estado: 500, mensaje: 'Fallo' })
    const error = await montar()
    expect(error.wrapper.text()).toContain('No se pudieron cargar los mensajes')
  })

  it('sincroniza página y tamaño con la URL', async () => {
    mensajesService.listarConversaciones.mockResolvedValue({ datos: [conversacion], paginacion: { pagina: 2, limite: 50, total: 51, paginas: 2 } })
    const { router } = await montar('/mensajes?pagina=2&limite=50')

    expect(mensajesService.listarConversaciones).toHaveBeenCalledWith({ pagina: 2, limite: 50 })
    expect(router.currentRoute.value.query.pagina).toBe('2')
    expect(router.currentRoute.value.query.limite).toBe('50')
  })
})
