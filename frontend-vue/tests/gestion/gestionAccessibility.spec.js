import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import AnuncioForm from '../../src/components/anuncios/AnuncioForm.vue'

const categorias = [{ id: 8, nombre: 'Bicicletas' }]

describe('accesibilidad de gestión', () => {
  it('asocia etiquetas y obligatoriedad a los campos', () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    expect(wrapper.get('label[for="anuncio-titulo"]').text()).toBe('Título')
    expect(wrapper.get('label[for="anuncio-descripcion"]').text()).toBe('Descripción')
    expect(wrapper.get('label[for="anuncio-precio"]').text()).toBe('Precio (€)')
    expect(wrapper.get('label[for="anuncio-categoria"]').text()).toBe('Categoría')
    expect(wrapper.get('label[for="anuncio-imagen"]').text()).toBe('Imagen')
    expect(wrapper.get('#anuncio-titulo').attributes('required')).toBeDefined()
    expect(wrapper.get('#anuncio-titulo').attributes('aria-required')).toBe('true')
    expect(wrapper.get('#anuncio-descripcion').attributes('required')).toBeDefined()
    expect(wrapper.get('#anuncio-precio').attributes('aria-required')).toBe('true')
    expect(wrapper.get('#anuncio-categoria').attributes('required')).toBeDefined()
    expect(wrapper.get('#anuncio-titulo-help').text()).toContain('Obligatorio')
  })

  it('asocia errores a los campos tras un envío inválido', async () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias },
      attachTo: document.body
    })

    await wrapper.get('form').trigger('submit')
    await nextTick()

    expect(wrapper.get('#anuncio-titulo').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#anuncio-titulo').attributes('aria-describedby')).toBe(
      'anuncio-titulo-help anuncio-titulo-error'
    )
    expect(wrapper.get('#anuncio-titulo-error').attributes('role')).toBe('alert')
    expect(wrapper.get('#anuncio-titulo-error').text()).toContain('obligatorio')
    expect(document.activeElement).toBe(wrapper.get('#anuncio-titulo').element)
  })

  it('mueve el foco al primer campo con error del servidor', async () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias },
      attachTo: document.body
    })

    await wrapper.setProps({ erroresServidor: { precio: 'El precio no es válido' } })
    await nextTick()

    expect(document.activeElement).toBe(wrapper.get('#anuncio-precio').element)
  })

  it('marca la imagen como opcional y accesible', () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    expect(wrapper.get('#anuncio-imagen').attributes('type')).toBe('file')
    expect(wrapper.get('#anuncio-imagen-help').text()).toContain('opcional')
  })
})
