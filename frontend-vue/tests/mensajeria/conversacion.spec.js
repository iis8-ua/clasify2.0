import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import ConversacionView from '../../src/views/ConversacionView.vue'
import { mensajesService } from '../../src/services/mensajesService'
import { useSessionStore } from '../../src/stores/session'
import { ApiError } from '../../src/services/errors'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))
vi.mock('../../src/services/mensajesService', () => ({
  mensajesService: { listarMensajes: vi.fn(), listarConversaciones: vi.fn(), enviar: vi.fn() }
}))

const mensaje = { id: 1, texto: 'Hola', fecha: '2026-11-11T10:00:00.000Z', leido: true, id_conversacion: 4, id_emisor: 2 }

async function montar(ruta = '/conversaciones/4') {
  const pinia = createPinia()
  setActivePinia(pinia)
  useSessionStore().establecerSesion('token', { id: 1, nombre: 'Ana' })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/conversaciones/:id', name: 'conversacion', component: ConversacionView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
      { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(ConversacionView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('hilo de mensajes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mensajesService.listarMensajes.mockResolvedValue({ datos: [mensaje], paginacion: { pagina: 1, limite: 20, total: 2, paginas: 2 } })
    mensajesService.listarConversaciones.mockResolvedValue({ datos: [{ id: 4, anuncio: { id: 25, titulo: 'Bicicleta' }, contraparte: { id: 2, nombre: 'Carlos' } }], paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 } })
    mensajesService.enviar.mockResolvedValue({ datos: { mensaje: { ...mensaje, id: 2, texto: 'Respuesta', id_emisor: 1 } } })
  })

  it('abre en los últimos mensajes y carga anteriores', async () => {
    const { wrapper } = await montar()
    expect(mensajesService.listarMensajes).toHaveBeenCalledWith(4, { pagina: 1, limite: 20, desde: 'final' })
    expect(wrapper.text()).toContain('Hola')

    mensajesService.listarMensajes.mockResolvedValue({ datos: [{ ...mensaje, id: 0, texto: 'Anterior' }], paginacion: { pagina: 2, limite: 20, total: 2, paginas: 2 } })
    await wrapper.findAll('button').find((b) => b.text() === 'Cargar mensajes anteriores').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Anterior')
    expect(wrapper.vm.$route.query.pagina).toBe('2')
  })

  it('recupera anuncio y contraparte al abrir directamente', async () => {
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('Bicicleta')
    expect(wrapper.text()).toContain('Carlos')
  })

  it('envía una respuesta y la muestra', async () => {
    const { wrapper } = await montar()
    await wrapper.get('#message-text').setValue('Respuesta')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(mensajesService.enviar).toHaveBeenCalledWith(4, 'Respuesta')
    expect(wrapper.text()).toContain('Respuesta')
  })

  it('muestra permisos al no participar', async () => {
    mensajesService.listarMensajes.mockRejectedValue(new ApiError({ estado: 403, codigo: 'SIN_PERMISOS', mensaje: 'Sin permisos' }))
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('No participas en esta conversación')
  })

  it('muestra no encontrado', async () => {
    mensajesService.listarMensajes.mockRejectedValue(new ApiError({ estado: 404, codigo: 'NO_ENCONTRADO', mensaje: 'No existe' }))
    const { wrapper } = await montar()
    expect(wrapper.text()).toContain('Conversación no encontrada')
  })
})
