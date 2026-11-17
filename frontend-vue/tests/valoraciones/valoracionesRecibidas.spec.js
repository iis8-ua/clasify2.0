import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import ListaValoraciones from '../../src/components/valoraciones/ListaValoraciones.vue'

const rutas = [{ path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }]
async function montar(props) {
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/usuarios/1')
  await router.isReady()
  return mount(ListaValoraciones, { props, global: { plugins: [router] } })
}

describe('lista de valoraciones recibidas', () => {
  it('muestra recibidas y estados', async () => {
    const wrapper = await montar({
      titulo: 'Valoraciones recibidas',
      estado: 'success',
      items: [{ id: 1, puntuacion: 5, comentario: 'Bien', fecha: '2026-11-11T10:00:00.000Z', autor: { id: 2, nombre: 'Carlos' } }]
    })
    expect(wrapper.text()).toContain('5 de 5')
    expect(wrapper.text()).toContain('Carlos')
  })

  it('muestra vacío, error y reintento', async () => {
    const vacio = await montar({ titulo: 'Valoraciones recibidas', estado: 'empty', items: [] })
    expect(vacio.text()).toContain('Sin valoraciones')
    const error = await montar({ titulo: 'Valoraciones recibidas', estado: 'error', items: [], error: { mensaje: 'Fallo' } })
    expect(error.text()).toContain('No se pudieron cargar las valoraciones')
    expect(error.text()).toContain('Reintentar')
  })
})
