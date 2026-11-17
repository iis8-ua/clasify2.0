import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AccionesAnuncio from '../../src/components/anuncios/AccionesAnuncio.vue'
import { useAnunciosStore } from '../../src/stores/anuncios'
import { useSessionStore } from '../../src/stores/session'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div />' } },
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
  { path: '/anuncios/:id/editar', name: 'anuncio-editar', component: { template: '<div />' } }
]

async function montar(anuncio, usuarioId = 1) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  session.establecerSesion('token', { id: usuarioId, nombre: 'Usuario' })
  const anuncios = useAnunciosStore()
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/1')
  await router.isReady()
  const wrapper = mount(AccionesAnuncio, {
    props: { anuncio },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router, anuncios }
}

const anuncio = {
  id: 1,
  titulo: 'Bicicleta',
  estado: 'disponible',
  id_autor: 1
}

describe('acciones del anuncio', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('no muestra acciones a un usuario que no es el autor', async () => {
    const { wrapper } = await montar(anuncio, 2)
    expect(wrapper.text()).toBe('')
  })

  it('muestra las acciones al autor', async () => {
    const { wrapper } = await montar(anuncio)
    expect(wrapper.text()).toContain('Editar')
    expect(wrapper.text()).toContain('Marcar como vendido')
    expect(wrapper.text()).toContain('Eliminar')
  })

  it('abre la confirmación de eliminación y permite cancelar', async () => {
    const { wrapper, anuncios } = await montar(anuncio)
    const eliminar = vi.spyOn(anuncios, 'eliminar').mockResolvedValue()

    await wrapper.findAll('button').find((boton) => boton.text() === 'Eliminar').trigger('click')
    expect(wrapper.get('[role="dialog"]').text()).toContain('Eliminar anuncio')

    await wrapper.findAll('button').find((boton) => boton.text() === 'Cancelar').trigger('click')
    expect(eliminar).not.toHaveBeenCalled()
  })

  it('elimina el anuncio al confirmar', async () => {
    const { wrapper, router, anuncios } = await montar(anuncio)
    const eliminar = vi.spyOn(anuncios, 'eliminar').mockResolvedValue()

    await wrapper.findAll('button').find((boton) => boton.text() === 'Eliminar').trigger('click')
    await wrapper.findAll('button').find((boton) => boton.text() === 'Eliminar' && boton.element.closest('[role="dialog"]')).trigger('click')
    await flushPromises()

    expect(eliminar).toHaveBeenCalledWith(1)
    expect(router.currentRoute.value.name).toBe('anuncios')
  })

  it('navega a la edición', async () => {
    const { wrapper, router } = await montar(anuncio)
    await wrapper.findAll('button').find((boton) => boton.text() === 'Editar').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('anuncio-editar')
  })

  it('confirma el cambio a vendido', async () => {
    const { wrapper, anuncios } = await montar(anuncio)
    const cambiarEstado = vi.spyOn(anuncios, 'cambiarEstado').mockResolvedValue({ ...anuncio, estado: 'vendido' })

    await wrapper.findAll('button').find((boton) => boton.text() === 'Marcar como vendido').trigger('click')
    await wrapper.findAll('button').find((boton) => boton.text() === 'Marcar vendido').trigger('click')
    await flushPromises()

    expect(cambiarEstado).toHaveBeenCalledWith(1, 'vendido')
  })

  it('vuelve a disponible sin confirmación adicional', async () => {
    const { wrapper, anuncios } = await montar({ ...anuncio, estado: 'vendido' })
    const cambiarEstado = vi.spyOn(anuncios, 'cambiarEstado').mockResolvedValue({ ...anuncio, estado: 'disponible' })

    await wrapper.findAll('button').find((boton) => boton.text() === 'Volver a disponible').trigger('click')
    await flushPromises()

    expect(cambiarEstado).toHaveBeenCalledWith(1, 'disponible')
  })
})
