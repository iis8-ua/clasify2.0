import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import BotonFavorito from '../../src/components/favoritos/BotonFavorito.vue'
import AnuncioCard from '../../src/components/catalog/AnuncioCard.vue'
import PaginacionCatalogo from '../../src/components/catalog/PaginacionCatalogo.vue'
import { useSessionStore } from '../../src/stores/session'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } },
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
]

const anuncio = {
  id: 25,
  titulo: 'Bicicleta de montaña',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1,
  es_favorito: false,
  num_favoritos: 2
}

async function montarBoton(datos = anuncio, usuarioId = 2) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  session.establecerSesion('token', { id: usuarioId, nombre: 'Usuario' })
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/25')
  await router.isReady()
  const wrapper = mount(BotonFavorito, {
    props: { anuncio: datos },
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router }
}

describe('accesibilidad de favoritos', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('expone un nombre accesible que indica la acción y el estado', async () => {
    const { wrapper } = await montarBoton()

    expect(wrapper.get('button').attributes('aria-label')).toBe('Añadir a favoritos')
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')

    await wrapper.setProps({ anuncio: { ...anuncio, es_favorito: true } })

    expect(wrapper.get('button').attributes('aria-label')).toBe('Quitar de favoritos')
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('oculta la acción al autor también para lectores de pantalla', async () => {
    const { wrapper } = await montarBoton({ ...anuncio, id_autor: 2 }, 2)
    expect(wrapper.text()).toBe('')
  })

  it('mantiene accesible el enlace de cada tarjeta', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createRouter({ history: createMemoryHistory(), routes: rutas })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AnuncioCard, {
      props: { anuncio, nombreCategoria: 'Bicicletas' },
      global: { plugins: [pinia, router] }
    })
    await flushPromises()

    expect(wrapper.get('a').attributes('aria-label')).toBe('Ver detalle de Bicicleta de montaña')
    expect(wrapper.get('a').attributes('href')).toBe('/anuncios/25')
    expect(wrapper.text()).toContain('Disponible')
  })

  it('etiqueta la paginación y sus controles', () => {
    const wrapper = mount(PaginacionCatalogo, {
      props: { pagina: 1, paginas: 2, ariaLabel: 'Paginación de favoritos' }
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Paginación de favoritos')
    expect(wrapper.text()).toContain('Página 1 de 2')
    expect(wrapper.text()).toContain('Primera')
    expect(wrapper.text()).toContain('Última')
  })
})
