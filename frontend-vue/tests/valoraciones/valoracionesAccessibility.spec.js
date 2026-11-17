import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import FormularioValoracion from '../../src/components/valoraciones/FormularioValoracion.vue'
import ListaValoraciones from '../../src/components/valoraciones/ListaValoraciones.vue'

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add: vi.fn() }) }))

const rutas = [{ path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }]

async function montar(componente, props) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/usuarios/2')
  await router.isReady()
  return mount(componente, { props, global: { plugins: [pinia, router] } })
}

describe('accesibilidad de valoraciones', () => {
  it('etiqueta el formulario y asocia errores', async () => {
    const wrapper = await montar(FormularioValoracion, { usuarioId: 2, nombre: 'Carlos' })
    expect(wrapper.get('label[for="rating-score"]').text()).toBe('Puntuación')
    expect(wrapper.get('#rating-score').attributes('required')).toBeDefined()
    expect(wrapper.get('label[for="rating-comment"]').text()).toContain('Comentario')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.get('#rating-score-error').attributes('role')).toBe('alert')
  })

  it('usa encabezado y lista en el listado', async () => {
    const wrapper = await montar(ListaValoraciones, {
      titulo: 'Valoraciones recibidas',
      estado: 'success',
      items: [{ id: 1, puntuacion: 4, comentario: 'Bien', fecha: '2026-11-11T10:00:00.000Z', autor: { id: 2, nombre: 'Carlos' } }]
    })
    expect(wrapper.get('h2').text()).toBe('Valoraciones recibidas')
    expect(wrapper.find('ul.rating-list').exists()).toBe(true)
  })
})
