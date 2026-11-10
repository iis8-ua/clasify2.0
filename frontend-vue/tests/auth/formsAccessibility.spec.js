import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import LoginForm from '../../src/components/auth/LoginForm.vue'
import RegisterForm from '../../src/components/auth/RegisterForm.vue'

const rutas = [
  { path: '/', name: 'anuncios', component: { template: '<div />' } },
  { path: '/login', name: 'login', component: LoginForm },
  { path: '/registro', name: 'registro', component: RegisterForm }
]

async function montar(componente, ruta) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push(ruta)
  await router.isReady()
  return mount(componente, {
    global: {
      plugins: [pinia, router]
    }
  })
}

describe('accesibilidad de formularios de autenticación', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it('asocia etiquetas a los campos de acceso', async () => {
    const wrapper = await montar(LoginForm, '/login')
    expect(wrapper.get('label[for="login-email"]').text()).toBe('Email')
    expect(wrapper.get('#login-email').attributes('type')).toBe('email')
    expect(wrapper.get('label[for="login-password"]').text()).toBe('Contraseña')
    expect(wrapper.get('#login-password').attributes('type')).toBe('password')
  })

  it('muestra errores accesibles tras un envío inválido', async () => {
    const wrapper = await montar(LoginForm, '/login')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('#login-email').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#login-email').attributes('aria-describedby')).toBe('login-email-error')
    expect(wrapper.get('#login-email-error').text()).toContain('obligatorio')
  })

  it('asocia etiquetas a los campos de registro', async () => {
    const wrapper = await montar(RegisterForm, '/registro')
    expect(wrapper.get('label[for="register-email"]').text()).toBe('Email')
    expect(wrapper.get('label[for="register-name"]').text()).toBe('Nombre')
    expect(wrapper.get('label[for="register-password"]').text()).toBe('Contraseña')
  })
})
