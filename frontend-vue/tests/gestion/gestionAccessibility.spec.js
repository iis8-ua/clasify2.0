import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AnuncioForm from '../../src/components/anuncios/AnuncioForm.vue'

const categorias = [{ id: 8, nombre: 'Bicicletas' }]

describe('accesibilidad de gestión', () => {
  it('asocia etiquetas a los campos', () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    expect(wrapper.get('label[for="anuncio-titulo"]').text()).toBe('Título')
    expect(wrapper.get('label[for="anuncio-descripcion"]').text()).toBe('Descripción')
    expect(wrapper.get('label[for="anuncio-precio"]').text()).toBe('Precio (€)')
    expect(wrapper.get('label[for="anuncio-categoria"]').text()).toBe('Categoría')
    expect(wrapper.get('label[for="anuncio-imagen"]').text()).toBe('Imagen')
  })

  it('asocia errores a los campos tras un envío inválido', async () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('#anuncio-titulo').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#anuncio-titulo').attributes('aria-describedby')).toBe('anuncio-titulo-error')
    expect(wrapper.get('#anuncio-titulo-error').text()).toContain('obligatorio')
  })

  it('marca la imagen como opcional y accesible', () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    expect(wrapper.get('#anuncio-imagen').attributes('type')).toBe('file')
    expect(wrapper.get('#anuncio-imagen-help').text()).toContain('opcional')
  })
})
