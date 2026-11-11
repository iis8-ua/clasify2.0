import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import UltimosMensajes from '../../src/components/mensajeria/UltimosMensajes.vue'

const rutas = [
  { path: '/conversaciones/:id', name: 'conversacion', component: { template: '<div />' } },
  { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } }
]

async function montar(props) {
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/conversaciones/4')
  await router.isReady()
  return mount(UltimosMensajes, { props, global: { plugins: [router] } })
}

describe('últimos mensajes del detalle', () => {
  it('enlaza a la contraparte de la conversación', async () => {
    const wrapper = await montar({
      detalle: {
        conversacion: { id: 4 },
        ultimos_mensajes: [{ id: 1, texto: 'Hola', fecha: '2026-11-11T10:00:00.000Z' }],
        num_mensajes: 1
      },
      conversacion: { id: 4, contraparte: { id: 2, nombre: 'Carlos' } }
    })

    expect(wrapper.text()).toContain('Con')
    expect(wrapper.get('a[href="/usuarios/2"]').text()).toBe('Carlos')
  })
})
