import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FiltrosCatalogo from '../../src/components/catalog/FiltrosCatalogo.vue'
import { FILTROS_POR_DEFECTO } from '../../src/router/catalogQuery'

const categorias = [
  { id: 1, nombre: 'Electrónica' },
  { id: 8, nombre: 'Bicicletas' }
]

describe('filtros del catálogo', () => {
  it('emite la búsqueda al enviar', async () => {
    const wrapper = mount(FiltrosCatalogo, {
      props: { filtros: { ...FILTROS_POR_DEFECTO }, categorias }
    })
    await wrapper.get('#filtro-texto').setValue('mesa')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('buscar')[0]).toEqual(['mesa'])
  })

  it('rechaza un texto de búsqueda de más de 150 caracteres', async () => {
    const wrapper = mount(FiltrosCatalogo, {
      props: { filtros: { ...FILTROS_POR_DEFECTO }, categorias }
    })
    await wrapper.get('#filtro-texto').setValue('a'.repeat(151))
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('no puede superar los 150 caracteres')
    expect(wrapper.get('#filtro-texto').attributes('aria-invalid')).toBe('true')
    expect(wrapper.emitted('buscar')).toBeUndefined()
  })

  it('emite cambio de categoría y vuelve a página 1 desde la vista', async () => {
    const wrapper = mount(FiltrosCatalogo, {
      props: { filtros: { ...FILTROS_POR_DEFECTO }, categorias }
    })
    await wrapper.get('#filtro-categoria').setValue('8')
    expect(wrapper.emitted('cambiar')[0]).toEqual(['categoria', 8])
  })

  it('emite cambio de estado y orden', async () => {
    const wrapper = mount(FiltrosCatalogo, {
      props: { filtros: { ...FILTROS_POR_DEFECTO }, categorias }
    })
    await wrapper.get('#filtro-estado').setValue('vendido')
    await wrapper.get('#filtro-orden').setValue('precio_asc')
    expect(wrapper.emitted('cambiar')).toEqual([
      ['estado', 'vendido'],
      ['orden', 'precio_asc']
    ])
  })

  it('muestra y emite limpiar filtros', async () => {
    const wrapper = mount(FiltrosCatalogo, {
      props: {
        filtros: { ...FILTROS_POR_DEFECTO, texto: 'mesa', categoria: 8 },
        categorias
      }
    })
    const limpiar = wrapper.findAll('button').find((boton) => boton.text() === 'Limpiar filtros')
    await limpiar.trigger('click')
    expect(wrapper.emitted('limpiar')).toHaveLength(1)
  })
})
