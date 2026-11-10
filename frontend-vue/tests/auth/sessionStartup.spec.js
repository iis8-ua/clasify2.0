import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../../src/App.vue'
import { useSessionStore } from '../../src/stores/session'

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div>Contenido</div>' } },
  { path: '/perfil', name: 'perfil', component: { template: '<div>Perfil</div>' } }
]

describe('arranque de la sesión', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('muestra el estado de comprobación sin renderizar la vista privada', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const session = useSessionStore()
    session.estado = 'comprobando'
    const router = createRouter({ history: createMemoryHistory(), routes: rutas })
    await router.push('/perfil')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
        stubs: {
          AppShell: { template: '<div><slot /></div>' },
          Toast: true
        }
      }
    })

    expect(wrapper.text()).toContain('Comprobando sesión…')
    expect(wrapper.text()).not.toContain('Perfil')
  })
})
