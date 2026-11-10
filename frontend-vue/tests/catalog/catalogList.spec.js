import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AnuncioCard from '../../src/components/catalog/AnuncioCard.vue'
import AnuncioGrid from '../../src/components/catalog/AnuncioGrid.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :aria-label="$attrs[\'aria-label\']"><slot /></a>'
}

const anuncio = {
  id: 1,
  titulo: 'Bicicleta de montaña',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1
}

describe('listado de anuncios', () => {
  it('muestra los datos de la tarjeta', () => {
    const wrapper = mount(AnuncioCard, {
      props: { anuncio, nombreCategoria: 'Bicicletas' },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper.text()).toContain('Bicicleta de montaña')
    expect(wrapper.text()).toContain('250,00')
    expect(wrapper.text()).toContain('Bicicletas')
    expect(wrapper.text()).toContain('Disponible')
    expect(wrapper.text()).not.toContain('Ana')
  })

  it('muestra el estado vendido', () => {
    const wrapper = mount(AnuncioCard, {
      props: { anuncio: { ...anuncio, estado: 'vendido' }, nombreCategoria: 'Bicicletas' },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper.text()).toContain('Vendido')
  })

  it('renderiza una cuadrícula con categorías resueltas', () => {
    const wrapper = mount(AnuncioGrid, {
      props: {
        anuncios: [anuncio],
        categoriasPorId: { 8: 'Bicicletas' }
      },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper.findAll('.anuncio-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('Bicicletas')
  })
})
