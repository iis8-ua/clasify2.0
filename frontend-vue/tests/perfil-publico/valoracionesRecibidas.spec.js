import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ValoracionesRecibidas from '../../src/components/perfil-publico/ValoracionesRecibidas.vue'

const rutas = [{ path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }]

async function montar(props) {
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/usuarios/1')
  await router.isReady()
  return mount(ValoracionesRecibidas, { props, global: { plugins: [router] } })
}

describe('valoraciones recibidas', () => {
  it('muestra autor, puntuación, comentario y fecha', async () => {
    const wrapper = await montar({
      estado: 'success',
      valoraciones: [{ id: 1, puntuacion: 5, comentario: 'Muy bien', fecha: '2026-11-11T10:00:00.000Z', autor: { id: 2, nombre: 'Carlos' } }]
    })
    expect(wrapper.text()).toContain('5 de 5')
    expect(wrapper.text()).toContain('Muy bien')
    expect(wrapper.text()).toContain('Carlos')
    expect(wrapper.get('a[href="/usuarios/2"]').text()).toBe('Carlos')
    expect(wrapper.text()).not.toContain('Eliminar')
  })

  it('muestra vacío y error', async () => {
    const vacio = await montar({ estado: 'empty', valoraciones: [] })
    expect(vacio.text()).toContain('Sin valoraciones')
    const error = await montar({ estado: 'error', valoraciones: [], error: { mensaje: 'Fallo' } })
    expect(error.text()).toContain('No se pudieron cargar las valoraciones')
    expect(error.text()).toContain('Reintentar')
  })
})
