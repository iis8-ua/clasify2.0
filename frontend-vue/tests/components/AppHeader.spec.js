import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import AppHeader from '../../src/components/layout/AppHeader.vue'
import { useSessionStore } from '../../src/stores/session'

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: { template: '<div />' } },
  { path: '/registro', name: 'registro', component: { template: '<div />' } },
  { path: '/anuncios/nuevo', name: 'anuncio-crear', component: { template: '<div />' } },
  { path: '/favoritos', name: 'favoritos', component: { template: '<div />' } },
  { path: '/perfil', name: 'perfil', component: { template: '<div />' } }
]

async function montarCabecera() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: rutas
  })
  await router.push('/')
  await router.isReady()
  return mount(AppHeader, {
    global: {
      plugins: [pinia, router]
    }
  })
}

describe('cabecera', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('muestra acceso y registro sin sesión', async () => {
    const wrapper = await montarCabecera()
    expect(wrapper.text()).toContain('Iniciar sesión')
    expect(wrapper.text()).toContain('Crear cuenta')
    expect(wrapper.text()).not.toContain('Publicar anuncio')
    expect(wrapper.text()).not.toContain('Favoritos')
  })

  it('muestra acciones privadas y creación con sesión', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: rutas
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('Hola, Ana')
    expect(wrapper.text()).toContain('Publicar anuncio')
    expect(wrapper.text()).toContain('Favoritos')
    expect(wrapper.text()).toContain('Perfil')
    expect(wrapper.text()).not.toContain('Iniciar sesión')
  })

  it('refleja el nombre actualizado de la sesión', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const session = useSessionStore()
    session.establecerSesion('token', { id: 1, nombre: 'Ana' })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: rutas
    })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router]
      }
    })

    session.actualizarUsuario({ nombre: 'Ana Editada' })
    await nextTick()

    expect(wrapper.text()).toContain('Hola, Ana Editada')
  })
})
