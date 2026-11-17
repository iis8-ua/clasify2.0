import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnuncioDetalleView from '../../src/views/AnuncioDetalleView.vue'
import { useSessionStore } from '../../src/stores/session'
import { anunciosService } from '../../src/services/anunciosService'
import { categoriasService } from '../../src/services/categoriasService'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))
vi.mock('../../src/services/anunciosService', () => ({
  anunciosService: { detalle: vi.fn(), listar: vi.fn(), listarDeUsuario: vi.fn() }
}))
vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() }
}))

const base = {
  id: 25,
  titulo: 'Bicicleta',
  descripcion: 'Descripción',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_autor: 2,
  id_categoria: 8,
  autor: { id: 2, nombre: 'Carlos', biografia: '', fecha_alta: '2026-11-10T09:00:00.000Z', valoracion_media: null, num_valoraciones: 0 },
  categoria: { id: 8, nombre: 'Bicicletas' },
  num_favoritos: 0,
  es_favorito: false
}

async function montar({ autenticado = true, datos = base } = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  if (autenticado) {
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
  }
  anunciosService.detalle.mockResolvedValue(datos)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: AnuncioDetalleView },
      { path: '/conversaciones/:id', name: 'conversacion', component: { template: '<div />' } },
      { path: '/login', name: 'login', component: { template: '<div />' } },
      { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }
    ]
  })
  await router.push('/anuncios/25')
  await router.isReady()
  const wrapper = mount(AnuncioDetalleView, { global: { plugins: [pinia, router] } })
  await flushPromises()
  return { wrapper, router }
}

describe('contactar desde el detalle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    categoriasService.listar.mockResolvedValue({ datos: [{ id: 8, nombre: 'Bicicletas' }], paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 } })
    anunciosService.listar.mockResolvedValue({ datos: [] })
    anunciosService.listarDeUsuario.mockResolvedValue({ datos: [] })
  })

  it('oculta Contactar en un anuncio propio', async () => {
    const { wrapper } = await montar({ datos: { ...base, id_autor: 1, autor: { ...base.autor, id: 1 } } })
    expect(wrapper.text()).not.toContain('Contactar')
  })

  it('deshabilita Contactar en un anuncio vendido sin conversación', async () => {
    const { wrapper } = await montar({ datos: { ...base, estado: 'vendido' } })
    const boton = wrapper.findAll('button').find((item) => item.text().includes('Contactar'))
    expect(boton.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('No se puede iniciar una conversación')
  })

  it('abre la conversación existente sin crear otra', async () => {
    const { wrapper, router } = await montar({ datos: { ...base, conversacion: { id: 4 } } })
    const boton = wrapper.findAll('button').find((item) => item.text().includes('Ver conversación'))
    await boton.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('conversacion')
    expect(router.currentRoute.value.params.id).toBe('4')
  })

  it('muestra los últimos mensajes solo al participar', async () => {
    const { wrapper } = await montar({
      datos: {
        ...base,
        conversacion: { id: 4 },
        ultimos_mensajes: [{ id: 1, texto: 'Hola', fecha: '2026-11-11T10:00:00.000Z', id_emisor: 2 }],
        num_mensajes: 1
      }
    })

    expect(wrapper.text()).toContain('Últimos mensajes')
    expect(wrapper.text()).toContain('Ver conversación completa (1)')
  })

  it('invita a acceder a un visitante', async () => {
    const { wrapper, router } = await montar({ autenticado: false })
    const boton = wrapper.findAll('button').find((item) => item.text().includes('Contactar'))
    await boton.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('login')
  })
})
