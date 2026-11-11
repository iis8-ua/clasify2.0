import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import LoginForm from '../../src/components/auth/LoginForm.vue'
import RegisterForm from '../../src/components/auth/RegisterForm.vue'
import { authService } from '../../src/services/authService'
import { ApiError } from '../../src/services/errors'
import { useSessionStore } from '../../src/stores/session'

vi.mock('../../src/services/authService', () => ({
  authService: {
    registrar: vi.fn(),
    iniciarSesion: vi.fn(),
    obtenerUsuarioActual: vi.fn()
  }
}))

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
  const wrapper = mount(componente, {
    global: {
      plugins: [pinia, router]
    },
    attachTo: document.body
  })
  return { wrapper, router, pinia }
}

describe('formularios de autenticación', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('valida el acceso antes de enviar', async () => {
    const { wrapper } = await montar(LoginForm, '/login')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('El email es obligatorio')
    expect(wrapper.text()).toContain('La contraseña es obligatoria')
    expect(authService.iniciarSesion).not.toHaveBeenCalled()
  })

  it('inicia sesión con datos válidos y redirige', async () => {
    authService.iniciarSesion.mockResolvedValue({
      token: 'token',
      usuario: { id: 1, nombre: 'Ana' }
    })
    const { wrapper, router } = await montar(LoginForm, '/login')

    await wrapper.get('#login-email').setValue('ana@example.com')
    await wrapper.get('#login-password').setValue('Clasify123!')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(authService.iniciarSesion).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'Clasify123!'
    })
    expect(router.currentRoute.value.name).toBe('anuncios')
  })

  it('muestra error general con credenciales incorrectas', async () => {
    authService.iniciarSesion.mockRejectedValue(
      new ApiError({
        estado: 401,
        codigo: 'CREDENCIALES_INVALIDAS',
        mensaje: 'Email o contraseña incorrectos'
      })
    )
    const { wrapper } = await montar(LoginForm, '/login')

    await wrapper.get('#login-email').setValue('ana@example.com')
    await wrapper.get('#login-password').setValue('incorrecta')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Email o contraseña incorrectos')
    expect(wrapper.get('#login-password').element.value).toBe('')
    expect(wrapper.get('#login-email').element.value).toBe('ana@example.com')
  })

  it('muestra el aviso de sesión caducada al volver al acceso', async () => {
    const { wrapper } = await montar(LoginForm, '/login')
    const session = useSessionStore()
    session.motivoSesion = 'Tu sesión ha caducado. Inicia sesión de nuevo.'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Tu sesión ha caducado')
  })

  it('valida la contraseña mínima del registro', async () => {
    const { wrapper } = await montar(RegisterForm, '/registro')

    await wrapper.get('#register-email').setValue('nueva@example.com')
    await wrapper.get('#register-name').setValue('Nueva')
    await wrapper.get('#register-password').setValue('corta')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('La contraseña debe tener al menos 8 caracteres')
    expect(authService.registrar).not.toHaveBeenCalled()
  })

  it('muestra el email duplicado en su campo', async () => {
    authService.registrar.mockRejectedValue(
      new ApiError({
        estado: 409,
        codigo: 'EMAIL_DUPLICADO',
        mensaje: 'Ya existe un usuario con ese email',
        campo: 'email'
      })
    )
    const { wrapper } = await montar(RegisterForm, '/registro')

    await wrapper.get('#register-email').setValue('ana@example.com')
    await wrapper.get('#register-name').setValue('Ana')
    await wrapper.get('#register-password').setValue('Clasify123!')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Ya existe un usuario con ese email')
    expect(wrapper.get('#register-password').element.value).toBe('')
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('#register-email').element)
  })
})
