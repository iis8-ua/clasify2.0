import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmAction from '../../src/components/states/ConfirmAction.vue'

describe('confirmaciones de gestión', () => {
  it('elimina solo al confirmar el diálogo', async () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        title: 'Eliminar anuncio',
        message: 'Esta acción es definitiva',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar'
      }
    })

    await wrapper.findAll('button').find((boton) => boton.text() === 'Eliminar').trigger('click')

    expect(wrapper.emitted('confirm')).toHaveLength(1)
  })

  it('cancela sin ejecutar la acción', async () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        title: 'Marcar como vendido',
        message: 'Dejará de aparecer en el catálogo',
        confirmLabel: 'Marcar vendido',
        cancelLabel: 'Cancelar'
      }
    })

    await wrapper.findAll('button').find((boton) => boton.text() === 'Cancelar').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})
