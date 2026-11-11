import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import CompartirAnuncio from '../../src/components/catalog/CompartirAnuncio.vue'

const { toastAdd } = vi.hoisted(() => ({ toastAdd: vi.fn() }))
vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: toastAdd }) }))

const anuncio = { id: 25, titulo: 'Bicicleta' }

async function montar() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }]
  })
  await router.push('/anuncios/25')
  await router.isReady()
  const wrapper = mount(CompartirAnuncio, {
    props: { anuncio },
    global: { plugins: [router] }
  })
  return wrapper
}

describe('compartir anuncio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toastAdd.mockClear()
  })

  afterEach(() => {
    delete navigator.share
    delete navigator.clipboard
  })

  it('usa Web Share cuando está disponible', async () => {
    navigator.share = vi.fn().mockResolvedValue()
    const wrapper = await montar()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(navigator.share).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Bicicleta',
      url: 'http://localhost:3000/anuncios/25'
    }))
  })

  it('copia el enlace cuando no hay Web Share', async () => {
    navigator.clipboard = { writeText: vi.fn().mockResolvedValue() }
    const wrapper = await montar()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/anuncios/25')
    expect(toastAdd).toHaveBeenCalledWith(expect.objectContaining({ detail: 'Enlace copiado' }))
  })

  it('no copia si el usuario cancela Web Share', async () => {
    navigator.share = vi.fn().mockRejectedValue({ name: 'AbortError' })
    navigator.clipboard = { writeText: vi.fn() }
    const wrapper = await montar()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
  })
})
