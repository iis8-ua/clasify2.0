import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AnuncioForm from '../../src/components/anuncios/AnuncioForm.vue'

const categorias = [{ id: 8, nombre: 'Bicicletas' }]

describe('cancelación de edición', () => {
  it('emite cancelación y no envía el formulario', async () => {
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
