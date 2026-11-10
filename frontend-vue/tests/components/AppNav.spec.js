import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNav from '../../src/components/layout/AppNav.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a><slot /></a>'
}

describe('navegación principal', () => {
  it('renderiza las entradas recibidas', () => {
    const wrapper = mount(AppNav, {
      props: {
        items: [
          { label: 'Anuncios', routeName: 'anuncios' },
          { label: 'Favoritos', routeName: 'favoritos' }
        ]
      },
      global: {
        stubs: { RouterLink: RouterLinkStub }
      }
    })
    const enlaces = wrapper.findAll('a')
    expect(enlaces).toHaveLength(2)
    expect(enlaces[0].text()).toBe('Anuncios')
    expect(enlaces[1].text()).toBe('Favoritos')
  })

  it('tiene una etiqueta de navegación accesible', () => {
    const wrapper = mount(AppNav, {
      props: { items: [] },
      global: {
        stubs: { RouterLink: RouterLinkStub }
      }
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Navegación principal')
  })
})
