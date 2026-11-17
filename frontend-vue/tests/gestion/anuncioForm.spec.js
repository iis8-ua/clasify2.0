import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AnuncioForm from '../../src/components/anuncios/AnuncioForm.vue'

const categorias = [
  { id: 1, nombre: 'Electrónica' },
  { id: 8, nombre: 'Bicicletas' }
]

describe('formulario de anuncio', () => {
  it('valida los campos obligatorios', async () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('El título es obligatorio')
    expect(wrapper.text()).toContain('La descripción es obligatoria')
    expect(wrapper.text()).toContain('El precio es obligatorio')
    expect(wrapper.text()).toContain('La categoría es obligatoria')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emite los valores de creación válidos', async () => {
    const wrapper = mount(AnuncioForm, {
      props: { categorias }
    })

    await wrapper.get('#anuncio-titulo').setValue('Bicicleta')
    await wrapper.get('#anuncio-descripcion').setValue('Bicicleta de montaña')
    await wrapper.get('#anuncio-precio').setValue('250.00')
    await wrapper.get('#anuncio-categoria').setValue('8')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0].valores).toEqual({
      titulo: 'Bicicleta',
      descripcion: 'Bicicleta de montaña',
      precio: '250.00',
      categoria: 8
    })
  })

  it('no permite guardar una edición sin cambios', () => {
    const wrapper = mount(AnuncioForm, {
      props: {
        modo: 'editar',
        categorias,
        valoresIniciales: {
          titulo: 'Bicicleta',
          descripcion: 'Descripción',
          precio: '250.00',
          categoria: 8
        }
      }
    })

    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('emite los campos modificados en edición', async () => {
    const wrapper = mount(AnuncioForm, {
      props: {
        modo: 'editar',
        categorias,
        valoresIniciales: {
          titulo: 'Bicicleta',
          descripcion: 'Descripción',
          precio: '250.00',
          categoria: 8
        }
      }
    })

    await wrapper.get('#anuncio-precio').setValue('230.00')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0].valores).toEqual({ precio: '230.00' })
  })

  it('emite cancelación sin enviar', async () => {
    const wrapper = mount(AnuncioForm, {
      props: {
        modo: 'editar',
        categorias,
        valoresIniciales: {
          titulo: 'Bicicleta',
          descripcion: 'Descripción',
          precio: '250.00',
          categoria: 8
        }
      }
    })

    await wrapper.findAll('button').find((boton) => boton.text() === 'Cancelar').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})
