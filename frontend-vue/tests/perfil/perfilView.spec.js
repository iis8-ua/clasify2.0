import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import PerfilView from '../../src/views/PerfilView.vue'
import { useSessionStore } from '../../src/stores/session'
import { usuariosService } from '../../src/services/usuariosService'
import { categoriasService } from '../../src/services/categoriasService'
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

vi.mock('../../src/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn()
  }
}))

const perfil = {
  id: 1,
  email: 'ana@example.com',
  nombre: 'Ana Ruiz',
  biografia: 'Perfil de prueba',
  fecha_alta: '2026-11-10T09:00:00.000Z',
  valoracion_media: 4.5,
  num_valoraciones: 2
}

async function montar(ruta = '/perfil') {
  const pinia = createPinia()
  setActivePinia(pinia)
  const session = useSessionStore()
  session.establecerSesion('token', { id: 1, nombre: 'Ana Ruiz' })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'anuncios', component: { template: '<div>Inicio</div>' } },
      { path: '/login', name: 'login', component: { template: '<div>Acceso</div>' } },
      { path: '/perfil', name: 'perfil', component: PerfilView },
      { path: '/anuncios/nuevo', name: 'anuncio-crear', component: { template: '<div />' } },
      { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
    ]
  })
  await router.push(ruta)
  await router.isReady()
  const wrapper = mount(
    { template: '<RouterView />' },
    { global: { plugins: [pinia, router] } }
  )
  await flushPromises()
  await flushPromises()
  return { wrapper, router, session }
}

describe('vista de perfil', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.clearAllMocks()
    usuariosService.perfil.mockResolvedValue(perfil)
    usuariosService.actualizarPerfil.mockResolvedValue(perfil)
    usuariosService.listarAnuncios.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })
    categoriasService.listar.mockResolvedValue({
      datos: [{ id: 8, nombre: 'Bicicletas' }],
      paginacion: { pagina: 1, limite: 100, total: 1, paginas: 1 }
    })
  })

  it('muestra nombre, email, biografía, fecha y valoraciones', async () => {
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('Ana Ruiz')
    expect(wrapper.text()).toContain('ana@example.com')
    expect(wrapper.text()).toContain('Perfil de prueba')
    expect(wrapper.text()).toContain('4.5 de 5 (2 valoraciones)')
    expect(wrapper.text()).toContain('10/11/2026')
    expect(wrapper.find('input[type="email"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Sin anuncios publicados')
  })

  it('muestra un error de carga y permite reintentar', async () => {
    usuariosService.perfil.mockRejectedValueOnce(
      new ApiError({ estado: 500, codigo: 'ERROR', mensaje: 'Fallo del servidor' })
    )
    const { wrapper } = await montar()

    expect(wrapper.text()).toContain('No se pudo cargar el perfil')
    expect(wrapper.text()).toContain('Fallo del servidor')

    await wrapper.findAll('button').find((boton) => boton.text() === 'Reintentar').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Ana Ruiz')
  })

  it('guarda los datos y actualiza la sesión', async () => {
    usuariosService.actualizarPerfil.mockResolvedValue({
      ...perfil,
      nombre: 'Ana Editada',
      biografia: 'Nueva biografía'
    })
    const { wrapper, session } = await montar()

    await wrapper.get('#perfil-nombre').setValue('Ana Editada')
    await wrapper.get('#perfil-biografia').setValue('Nueva biografía')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(usuariosService.actualizarPerfil).toHaveBeenCalledWith({
      nombre: 'Ana Editada',
      biografia: 'Nueva biografía'
    })
    expect(session.usuario.nombre).toBe('Ana Editada')
    expect(wrapper.text()).toContain('Ana Editada')
  })

  it('solicita acceso si la sesión ha caducado al cargar', async () => {
    usuariosService.perfil.mockRejectedValueOnce(
      new ApiError({ estado: 401, codigo: 'TOKEN_CADUCADO', mensaje: 'Sesión caducada' })
    )
    const { router } = await montar()

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/perfil')
  })

  it('advierte antes de salir con cambios sin guardar', async () => {
    const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { wrapper, router } = await montar()

    await wrapper.get('#perfil-nombre').setValue('Nombre sin guardar')
    await flushPromises()
    await router.push('/')
    await flushPromises()

    expect(confirmar).toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('perfil')

    confirmar.mockRestore()
  })
})
