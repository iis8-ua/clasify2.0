import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PriceText from '../../src/components/common/PriceText.vue'
import DateText from '../../src/components/common/DateText.vue'
import ImageWithFallback from '../../src/components/common/ImageWithFallback.vue'

describe('formatos comunes', () => {
  it('formatea el precio en euros', () => {
    const wrapper = mount(PriceText, { props: { value: '12.5' } })
    expect(wrapper.text()).toContain('12,50')
    expect(wrapper.text()).toContain('€')
  })

  it('muestra un marcador para un precio ausente', () => {
    const wrapper = mount(PriceText, { props: { value: null } })
    expect(wrapper.text()).toBe('—')
  })

  it('formatea una fecha en español', () => {
    const wrapper = mount(DateText, { props: { value: '2026-11-10T00:00:00.000Z' } })
    expect(wrapper.text()).toContain('2026')
  })

  it('muestra una imagen cuando existe', () => {
    const wrapper = mount(ImageWithFallback, {
      props: { src: '/imagen.jpg', alt: 'Bicicleta' }
    })
    expect(wrapper.get('img').attributes('alt')).toBe('Bicicleta')
  })

  it('muestra un marcador accesible cuando no hay imagen', () => {
    const wrapper = mount(ImageWithFallback, {
      props: { src: null, alt: 'Bicicleta sin imagen' }
    })
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Bicicleta sin imagen')
  })
})
