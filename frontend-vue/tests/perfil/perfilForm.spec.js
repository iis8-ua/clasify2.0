import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PerfilForm from '../../src/components/perfil/PerfilForm.vue'

const perfil = {
  nombre: 'Ana Ruiz',
  biografia: 'Perfil de prueba'
}

function montar(extra = {}) {
  return mount(PerfilForm, {
    props: {
      perfil,
      ...extra
    }
  })
}

describe('formulario de datos del perfil', () => {
  it('precarga los valores actuales sin incluir el email', () => {
    const wrapper = montar()

    expect(wrapper.get('#perfil-nombre').element.value).toBe('Ana Ruiz')
    expect(wrapper.get('#perfil-biografia').element.value).toBe('Perfil de prueba')
    expect(wrapper.find('input[type="email"]').exists()).toBe(false)
  })

  it('valida el nombre obligatorio y la biografía máxima', async () => {
    const wrapper = montar()

    await wrapper.get('#perfil-nombre').setValue('')
    await wrapper.get('#perfil-biografia').setValue('a'.repeat(501))
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('El nombre es obligatorio')
    expect(wrapper.text()).toContain('La biografía no puede superar los 500 caracteres')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('valida el nombre máximo', async () => {
    const wrapper = montar()

    await wrapper.get('#perfil-nombre').setValue('a'.repeat(101))
    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('El nombre no puede superar los 100 caracteres')
  })

  it('emite solo los campos modificados', async () => {
    const wrapper = montar()

    await wrapper.get('#perfil-biografia').setValue('Nueva biografía')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')[0][0]).toEqual({ biografia: 'Nueva biografía' })
  })

  it('no envía una edición sin cambios', async () => {
    const wrapper = montar()

    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('descarta los cambios y vuelve a los valores originales', async () => {
    const wrapper = montar()

    await wrapper.get('#perfil-nombre').setValue('Otro nombre')
    await wrapper.findAll('button').find((boton) => boton.text() === 'Descartar cambios').trigger('click')

    expect(wrapper.get('#perfil-nombre').element.value).toBe('Ana Ruiz')
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('muestra los errores del servidor asociados al campo', () => {
    const wrapper = montar({ erroresServidor: { nombre: 'El nombre ya está en uso' } })

    expect(wrapper.text()).toContain('El nombre ya está en uso')
    expect(wrapper.get('#perfil-nombre').attributes('aria-invalid')).toBe('true')
  })
})
