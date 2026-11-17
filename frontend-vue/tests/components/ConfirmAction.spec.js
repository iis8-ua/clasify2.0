import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfirmAction from '../../src/components/states/ConfirmAction.vue'

describe('confirmación de acciones', () => {
  it('muestra un diálogo accesible', () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        title: 'Eliminar anuncio',
        message: 'Esta acción es definitiva',
        confirmLabel: 'Eliminar',
        cancelLabel: 'Cancelar'
      }
    })
    const dialogo = wrapper.get('[role="dialog"]')
    expect(dialogo.attributes('aria-modal')).toBe('true')
    expect(wrapper.text()).toContain('Eliminar anuncio')
    expect(wrapper.text()).toContain('Esta acción es definitiva')
  })

  it('emite cancelación sin ejecutar la acción', async () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        message: 'Esta acción es definitiva'
      }
    })
    await wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('emite confirmación solo al confirmar', async () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        message: 'Esta acción es definitiva'
      }
    })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toBeUndefined()
  })

  it('se cierra con Escape sin confirmar', async () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        message: 'Esta acción es definitiva'
      }
    })
    await wrapper.get('.confirm-overlay').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toHaveLength(1)
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })

  it('restaura el foco al elemento que abrió el diálogo', async () => {
    const disparador = document.createElement('button')
    document.body.appendChild(disparador)
    disparador.focus()

    const wrapper = mount(ConfirmAction, {
      props: { open: false, message: 'Esta acción es definitiva' },
      attachTo: document.body
    })

    await wrapper.setProps({ open: true })
    await nextTick()
    expect(document.activeElement).toBe(wrapper.findAll('button')[0].element)

    await wrapper.setProps({ open: false })
    await nextTick()
    expect(document.activeElement).toBe(disparador)

    wrapper.unmount()
    disparador.remove()
  })

  it('bloquea los botones y muestra carga durante la operación', async () => {
    const wrapper = mount(ConfirmAction, {
      props: {
        open: true,
        message: 'Esta acción es definitiva',
        loading: true,
        loadingLabel: 'Eliminando…'
      }
    })

    expect(wrapper.text()).toContain('Eliminando…')
    expect(wrapper.findAll('button').every((boton) => boton.attributes('disabled') !== undefined)).toBe(true)
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('confirm')).toBeUndefined()
  })
})
