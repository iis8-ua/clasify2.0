import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginacionCatalogo from '../../src/components/catalog/PaginacionCatalogo.vue'

describe('paginación del catálogo', () => {
  it('deshabilita los controles en la primera página', () => {
    const wrapper = mount(PaginacionCatalogo, {
      props: { pagina: 1, paginas: 2 }
    })
    const botones = wrapper.findAll('button')
    expect(botones[0].attributes('disabled')).toBeDefined()
    expect(botones[1].attributes('disabled')).toBeDefined()
    expect(botones[2].attributes('disabled')).toBeUndefined()
  })

  it('deshabilita los controles en la última página', () => {
    const wrapper = mount(PaginacionCatalogo, {
      props: { pagina: 2, paginas: 2 }
    })
    const botones = wrapper.findAll('button')
    expect(botones[2].attributes('disabled')).toBeDefined()
    expect(botones[3].attributes('disabled')).toBeDefined()
  })

  it('emite el cambio de página', async () => {
    const wrapper = mount(PaginacionCatalogo, {
      props: { pagina: 1, paginas: 3 }
    })
    await wrapper.findAll('button')[2].trigger('click')
    expect(wrapper.emitted('cambiar')[0]).toEqual([2])
  })
})
