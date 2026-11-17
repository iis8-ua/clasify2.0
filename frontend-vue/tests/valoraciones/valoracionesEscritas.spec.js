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

describe('lista de valoraciones escritas', () => {
  it('muestra destinatario y acciones', async () => {
    const wrapper = await montar({
      titulo: 'Valoraciones escritas',
      modo: 'escrita',
      estado: 'success',
      items: [{ id: 1, puntuacion: 4, comentario: 'Bien', fecha: '2026-11-11T10:00:00.000Z', para: { id: 2, nombre: 'Carlos' } }]
    })
    expect(wrapper.text()).toContain('Carlos')
    expect(wrapper.text()).toContain('Editar Carlos')
    expect(wrapper.text()).toContain('Eliminar Carlos')
  })

  it('emite eliminar', async () => {
    const valoracion = { id: 1, puntuacion: 4, comentario: '', fecha: '2026-11-11T10:00:00.000Z', para: { id: 2, nombre: 'Carlos' } }
    const wrapper = await montar({ titulo: 'Valoraciones escritas', modo: 'escrita', estado: 'success', items: [valoracion] })
    await wrapper.findAll('button').find((b) => b.text() === 'Eliminar Carlos').trigger('click')
    expect(wrapper.emitted('eliminar')[0]).toEqual([valoracion])
  })
})
