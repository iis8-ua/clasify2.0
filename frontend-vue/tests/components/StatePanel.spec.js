import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatePanel from '../../src/components/states/StatePanel.vue'

describe('panel de estados', () => {
  it('muestra un error y emite reintento', async () => {
    const wrapper = mount(StatePanel, {
      props: {
        type: 'error',
        title: 'No se pudo cargar',
        message: 'Revisa la conexión',
        retryable: true
      }
    })
    expect(wrapper.get('section').attributes('role')).toBe('alert')
    expect(wrapper.text()).toContain('No se pudo cargar')
    expect(wrapper.text()).toContain('Revisa la conexión')
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('distingue vacío de error', () => {
    const wrapper = mount(StatePanel, {
      props: {
        type: 'empty',
        message: 'No hay resultados'
      }
    })
    expect(wrapper.get('section').classes()).toContain('state-panel--empty')
    expect(wrapper.get('section').attributes('role')).toBe('status')
  })

  it('asocia errores de validación a campos', () => {
    const wrapper = mount(StatePanel, {
      props: {
        type: 'validation',
        message: 'Revisa los campos',
        fieldErrors: { email: 'Email inválido', titulo: 'Título obligatorio' }
      }
    })
    expect(wrapper.text()).toContain('email:')
    expect(wrapper.text()).toContain('Email inválido')
    expect(wrapper.text()).toContain('titulo:')
    expect(wrapper.text()).toContain('Título obligatorio')
  })

  it('muestra una acción adicional', async () => {
    const wrapper = mount(StatePanel, {
      props: {
        type: 'success',
        message: 'Operación completada',
        actionLabel: 'Continuar'
      }
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('action')).toHaveLength(1)
  })
})
