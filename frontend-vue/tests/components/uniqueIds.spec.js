import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ListaValoraciones from '../../src/components/valoraciones/ListaValoraciones.vue'

describe('identificadores accesibles', () => {
  it('genera ids únicos y sin espacios para listas repetidas', () => {
    const wrapper = mount({
      components: { ListaValoraciones },
      template: `
        <div>
          <ListaValoraciones titulo="Recibidas" estado="empty" />
          <ListaValoraciones titulo="Escritas" estado="empty" />
        </div>
      `
    })

    const ids = wrapper.findAll('[id]').map((elemento) => elemento.attributes('id'))
    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => !/\s/.test(id))).toBe(true)
  })
})
