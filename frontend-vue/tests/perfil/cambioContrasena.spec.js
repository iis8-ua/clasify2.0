import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import CambioContrasenaForm from '../../src/components/perfil/CambioContrasenaForm.vue'
import { useSessionStore } from '../../src/stores/session'
import { usuariosService } from '../../src/services/usuariosService'
import { ApiError } from '../../src/services/errors'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

vi.mock('../../src/services/usuariosService', () => ({
  usuariosService: {
    perfil: vi.fn(),
    actualizarPerfil: vi.fn(),
    cambiarContrasena: vi.fn(),
    listarAnuncios: vi.fn()
  }
}))

const rutas = [
  { path: '/perfil', name: 'perfil', component: CambioContrasenaForm },
  { path: '/login', name: 'login', component: { template: '<div />' } }
]

async function montar() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  session.establecerSesion('token', { id: 1, nombre: 'Ana' })
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/perfil')
  await router.isReady()
  const wrapper = mount(CambioContrasenaForm, {
    global: { plugins: [pinia, router] }
  })
  return { wrapper, router, session }
}

describe('formulario de cambio de contraseña', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('exige la contraseña actual y una nueva de al menos 8 caracteres', async () => {
    const { wrapper } = await montar()

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('La contraseña actual es obligatoria')
    expect(wrapper.text()).toContain('La contraseña nueva debe tener al menos 8 caracteres')
    expect(usuariosService.cambiarContrasena).not.toHaveBeenCalled()
  })

  it('rechaza una contraseña nueva demasiado corta', async () => {
    const { wrapper } = await montar()

    await wrapper.get('#perfil-password-actual').setValue('Clasify123!')
    await wrapper.get('#perfil-password-nueva').setValue('corta')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('La contraseña nueva debe tener al menos 8 caracteres')
    expect(usuariosService.cambiarContrasena).not.toHaveBeenCalled()
  })

  it('cambia la contraseña, limpia los campos y conserva la sesión', async () => {
    usuariosService.cambiarContrasena.mockResolvedValue({ id: 1 })
    const { wrapper, session } = await montar()

    await wrapper.get('#perfil-password-actual').setValue('Clasify123!')
    await wrapper.get('#perfil-password-nueva').setValue('NuevaClave123!')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(usuariosService.cambiarContrasena).toHaveBeenCalledWith({
      passwordActual: 'Clasify123!',
      passwordNueva: 'NuevaClave123!'
    })
    expect(wrapper.get('#perfil-password-actual').element.value).toBe('')
    expect(wrapper.get('#perfil-password-nueva').element.value).toBe('')
    expect(session.estaAutenticado).toBe(true)
  })

  it('muestra la contraseña actual incorrecta sin cerrar la sesión', async () => {
    usuariosService.cambiarContrasena.mockRejectedValue(
      new ApiError({
        estado: 401,
        codigo: 'CREDENCIALES_INVALIDAS',
        mensaje: 'La contraseña actual no es correcta'
      })
    )
    const { wrapper, router, session } = await montar()

    await wrapper.get('#perfil-password-actual').setValue('incorrecta')
    await wrapper.get('#perfil-password-nueva').setValue('NuevaClave123!')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('La contraseña actual no es correcta')
    expect(session.estaAutenticado).toBe(true)
    expect(router.currentRoute.value.name).toBe('perfil')
  })

  it('solicita acceso si la sesión ha caducado', async () => {
    usuariosService.cambiarContrasena.mockRejectedValue(
      new ApiError({ estado: 401, codigo: 'TOKEN_CADUCADO', mensaje: 'Sesión caducada' })
    )
    const { wrapper, router } = await montar()

    await wrapper.get('#perfil-password-actual').setValue('Clasify123!')
    await wrapper.get('#perfil-password-nueva').setValue('NuevaClave123!')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/perfil')
  })
})
