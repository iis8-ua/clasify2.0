import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import TarjetaConversacion from '../../src/components/mensajeria/TarjetaConversacion.vue'

const rutas = [
  { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } },
  { path: '/conversaciones/:id', name: 'conversacion', component: { template: '<div />' } }
]

describe('enlaces al perfil público', () => {
  it('enlaza la contraparte de una conversación', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: rutas })
    await router.push('/conversaciones/4')
    await router.isReady()
    const wrapper = mount(TarjetaConversacion, {
      props: {
        conversacion: {
          id: 4,
          anuncio: { id: 25, titulo: 'Bicicleta', precio: '250.00', imagen: null },
          contraparte: { id: 2, nombre: 'Carlos' },
          ultimo_mensaje: { texto: 'Hola', fecha: '2026-11-11T10:00:00.000Z' },
          no_leidos: 0
        }
      },
      global: { plugins: [router] }
    })

    expect(wrapper.get('a[href="/usuarios/2"]').text()).toBe('Carlos')
  })
})
