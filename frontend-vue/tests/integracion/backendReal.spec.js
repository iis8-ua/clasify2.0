import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import AnunciosListView from '../../src/views/AnunciosListView.vue'
import FavoritosView from '../../src/views/FavoritosView.vue'
import AnuncioDetalleView from '../../src/views/AnuncioDetalleView.vue'
import { authService } from '../../src/services/authService'
import { favoritosService } from '../../src/services/favoritosService'
import { configurarHttp } from '../../src/services/http'
import { useSessionStore } from '../../src/stores/session'

const ejecutar = process.env.VALIDACION_BACKEND === '1'
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/clasify_api'
let token = null
let idAnuncio = null
let favoritoCreado = false
let pinia = null

function crearRouter(rutas) {
  return createRouter({ history: createMemoryHistory(), routes: rutas })
}

function montar(componente, router) {
  return mount(componente, { global: { plugins: [pinia, router, PrimeVue, ToastService] } })
}

describe.skipIf(!ejecutar)('validación contra el backend real', () => {
  beforeAll(async () => {
    configurarHttp({
      baseUrl: API,
      getToken: () => token,
      onUnauthorized: () => {}
    })
    pinia = createPinia()
    setActivePinia(pinia)
    const sesion = await authService.iniciarSesion({
      email: 'ana@example.com',
      password: 'Clasify123!'
    })
    token = sesion.token
    useSessionStore().establecerSesion(sesion.token, sesion.usuario)
    const respuesta = await fetch(`${API}/anuncios?pagina=1&limite=100`)
    const listado = await respuesta.json()
    const favoritosActuales = await favoritosService.listar({ pagina: 1, limite: 100 })
    const idsFavoritos = new Set(favoritosActuales.datos.map((favorito) => favorito.id))
    const ajeno = listado.datos.find(
      (anuncio) =>
        anuncio.id_autor !== sesion.usuario.id && !idsFavoritos.has(anuncio.id)
    )
    if (!ajeno) {
      throw new Error('No hay anuncios ajenos sin favorito para ejecutar la validación')
    }
    idAnuncio = ajeno.id
  })

  afterAll(async () => {
    if (token && idAnuncio && favoritoCreado) {
      await fetch(`${API}/anuncios/${idAnuncio}/favorito`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  })

  it('renderiza el catálogo con los anuncios reales del backend', async () => {
    const router = crearRouter([
      { path: '/', name: 'anuncios', component: AnunciosListView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ])
    await router.push('/')
    await router.isReady()
    const wrapper = montar(AnunciosListView, router)
    await vi.waitFor(() => {
      expect(wrapper.findAll('.anuncio-card').length).toBeGreaterThan(0)
    }, { timeout: 8000 })
    expect(wrapper.find('.anuncio-card__title').text().length).toBeGreaterThan(0)
  })

  it('refleja el detalle real de un anuncio ajeno', async () => {
    const router = crearRouter([
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: AnuncioDetalleView }
    ])
    await router.push(`/anuncios/${idAnuncio}`)
    await router.isReady()
    const wrapper = montar(AnuncioDetalleView, router)
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('favoritos')
    }, { timeout: 8000 })
    expect(wrapper.text()).not.toContain('Gestionar anuncio')
    expect(wrapper.get('.anuncio-card__title, #detail-title').text().length).toBeGreaterThan(0)
  })

  it('añade una sola vez el favorito real y lo lista', async () => {
    const primero = await favoritosService.anadir(idAnuncio)
    const segundo = await favoritosService.anadir(idAnuncio)
    favoritoCreado = primero.nuevo

    expect(primero.nuevo).toBe(true)
    expect(segundo.nuevo).toBe(false)

    const router = crearRouter([
      { path: '/favoritos', name: 'favoritos', component: FavoritosView },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } },
      { path: '/', name: 'anuncios', component: { template: '<div />' } }
    ])
    await router.push('/favoritos')
    await router.isReady()
    const wrapper = montar(FavoritosView, router)
    await vi.waitFor(() => {
      expect(wrapper.findAll('.anuncio-card').length).toBeGreaterThan(0)
    }, { timeout: 8000 })
    expect(wrapper.get('.anuncio-card__title').element.tagName).toBe('H2')
  })
})
