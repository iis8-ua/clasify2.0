import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import CambioContrasenaForm from '../../src/components/perfil/CambioContrasenaForm.vue'
import PerfilDatos from '../../src/components/perfil/PerfilDatos.vue'
import PerfilForm from '../../src/components/perfil/PerfilForm.vue'

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() })
}))

const perfil = {
  id: 1,
  email: 'ana@example.com',
  nombre: 'Ana Ruiz',
  biografia: 'Perfil de prueba',
  fecha_alta: '2026-11-10T09:00:00.000Z',
  valoracion_media: null,
  num_valoraciones: 0
}

async function montarPassword() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/perfil', name: 'perfil', component: CambioContrasenaForm }]
  })
  await router.push('/perfil')
  await router.isReady()
  return mount(CambioContrasenaForm, {
    global: { plugins: [pinia, router] }
  })
}

describe('accesibilidad del perfil', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('muestra el email como dato informativo no editable', () => {
    const wrapper = mount(PerfilDatos, { props: { perfil } })

    expect(wrapper.text()).toContain('ana@example.com')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.get('h2').text()).toBe('Datos del perfil')
    expect(wrapper.text()).toContain('Sin valoraciones')
  })

  it('asocia etiquetas y errores a los campos de datos', async () => {
    const wrapper = mount(PerfilForm, { props: { perfil } })

    expect(wrapper.get('label[for="perfil-nombre"]').text()).toBe('Nombre')
    expect(wrapper.get('label[for="perfil-biografia"]').text()).toBe('Biografía')
    expect(wrapper.get('#perfil-nombre').attributes('required')).toBeDefined()
    expect(wrapper.get('#perfil-nombre').attributes('aria-required')).toBe('true')

    await wrapper.get('#perfil-nombre').setValue('')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('#perfil-nombre').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#perfil-nombre').attributes('aria-describedby')).toBe('perfil-nombre-error')
    expect(wrapper.get('#perfil-nombre-error').attributes('role')).toBe('alert')
    expect(wrapper.get('#perfil-nombre-error').text()).toContain('obligatorio')
  })

  it('asocia etiquetas y errores al cambio de contraseña', async () => {
    const wrapper = await montarPassword()

    expect(wrapper.get('label[for="perfil-password-actual"]').text()).toBe('Contraseña actual')
    expect(wrapper.get('label[for="perfil-password-nueva"]').text()).toBe('Contraseña nueva')
    expect(wrapper.get('#perfil-password-actual').attributes('required')).toBeDefined()
    expect(wrapper.get('#perfil-password-nueva').attributes('aria-required')).toBe('true')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('#perfil-password-actual').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#perfil-password-nueva').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#perfil-password-actual-error').attributes('role')).toBe('alert')
    expect(wrapper.get('#perfil-password-nueva-error').attributes('role')).toBe('alert')
    expect(wrapper.get('#perfil-password-actual-error').text()).toContain('obligatoria')
    expect(wrapper.get('#perfil-password-nueva-error').text()).toContain('al menos 8')
  })

  it('identifica la sección de anuncios con un encabezado', () => {
    const wrapper = mount(PerfilDatos, { props: { perfil } })
    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('perfil-datos-title')
  })
})
