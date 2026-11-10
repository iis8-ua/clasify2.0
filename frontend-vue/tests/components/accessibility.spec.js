import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ImageWithFallback from '../../src/components/common/ImageWithFallback.vue'
import AppNav from '../../src/components/layout/AppNav.vue'
import StatePanel from '../../src/components/states/StatePanel.vue'

const RouterLinkStub = {
  props: ['to'],
  template: '<a><slot /></a>'
}

describe('accesibilidad básica', () => {
  it('etiqueta la navegación y sus enlaces', () => {
    const wrapper = mount(AppNav, {
      props: {
        items: [{ label: 'Anuncios', routeName: 'anuncios' }]
      },
      global: {
        stubs: { RouterLink: RouterLinkStub }
      }
    })
    expect(wrapper.get('nav').attributes('aria-label')).toBe('Navegación principal')
    expect(wrapper.get('a').text()).toBe('Anuncios')
  })

  it('ofrece texto alternativo para imágenes', () => {
    const wrapper = mount(ImageWithFallback, {
      props: { src: null, alt: 'Imagen de prueba' }
    })
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Imagen de prueba')
  })

  it('anuncia estados con roles accesibles', () => {
    const wrapper = mount(StatePanel, {
      props: { type: 'loading', message: 'Cargando' }
    })
    expect(wrapper.get('section').attributes('role')).toBe('status')
    expect(wrapper.get('section').attributes('aria-live')).toBe('polite')
  })
})
