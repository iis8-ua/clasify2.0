import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AnuncioCard from '../../src/components/catalog/AnuncioCard.vue'
import FiltrosCatalogo from '../../src/components/catalog/FiltrosCatalogo.vue'
import PaginacionCatalogo from '../../src/components/catalog/PaginacionCatalogo.vue'
import { FILTROS_POR_DEFECTO } from '../../src/router/catalogQuery'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :aria-label="$attrs[\'aria-label\']"><slot /></a>'
}

const anuncio = {
  id: 1,
  titulo: 'Bicicleta',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-08T10:00:00.000Z',
  id_categoria: 8,
  id_autor: 1
}

describe('accesibilidad del catálogo', () => {
  it('etiqueta el enlace de la tarjeta', () => {
    const wrapper = mount(AnuncioCard, {
      props: { anuncio, nombreCategoria: 'Bicicletas' },
      global: { stubs: { RouterLink: RouterLinkStub } }
    })
    expect(wrapper.get('a').attributes('aria-label')).toContain('Bicicleta')
  })

  it('etiqueta la búsqueda y los filtros', () => {
    const wrapper = mount(FiltrosCatalogo, {
      props: { filtros: { ...FILTROS_POR_DEFECTO }, categorias: [] }
    })
    expect(wrapper.get('#filtro-texto').exists()).toBe(true)
    expect(wrapper.get('label[for="filtro-texto"]').text()).toBe('Buscar')
    expect(wrapper.get('label[for="filtro-estado"]').text()).toBe('Estado')
    expect(wrapper.get('label[for="filtro-orden"]').text()).toBe('Orden')
  })

  it('etiqueta la paginación', () => {
    const wrapper = mount(PaginacionCatalogo, {
      props: { pagina: 1, paginas: 2 }
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Paginación de anuncios')
    expect(wrapper.text()).toContain('Página 1 de 2')
  })
})
