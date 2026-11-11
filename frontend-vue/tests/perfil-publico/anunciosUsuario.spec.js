import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AnunciosUsuario from '../../src/components/perfil-publico/AnunciosUsuario.vue'

const rutas = [{ path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }]

async function montar(props) {
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/anuncios/1')
  await router.isReady()
  return mount(AnunciosUsuario, { props, global: { plugins: [router] } })
}

const anuncio = { id: 1, titulo: 'Bicicleta', precio: '250.00', estado: 'disponible', imagen: null, fecha_creacion: '2026-11-08T10:00:00.000Z', id_categoria: 8, id_autor: 1 }

describe('anuncios del perfil', () => {
  it('muestra disponibles y vendidos', async () => {
    const wrapper = await montar({
      estado: 'success',
      anuncios: [anuncio, { ...anuncio, id: 2, titulo: 'Mesa', estado: 'vendido' }],
      categoriasPorId: { 8: 'Bicicletas' }
    })
    expect(wrapper.text()).toContain('Bicicleta')
    expect(wrapper.text()).toContain('Mesa')
    expect(wrapper.text()).toContain('Vendido')
    expect(wrapper.findAll('.anuncio-card')).toHaveLength(2)
  })

  it('muestra vacío y error', async () => {
    const vacio = await montar({ estado: 'empty', anuncios: [] })
    expect(vacio.text()).toContain('Sin anuncios')
    const error = await montar({ estado: 'error', anuncios: [], error: { mensaje: 'Fallo' } })
    expect(error.text()).toContain('No se pudieron cargar los anuncios')
    expect(error.text()).toContain('Reintentar')
  })
})
