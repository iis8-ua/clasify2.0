import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SelectorTamanoPagina from '../../src/components/catalog/SelectorTamanoPagina.vue'
import ListaValoraciones from '../../src/components/valoraciones/ListaValoraciones.vue'

describe('identificadores accesibles', () => {
  it('genera ids únicos y sin espacios para selectores y listas repetidas', () => {
    const wrapper = mount({
      components: { SelectorTamanoPagina, ListaValoraciones },
      template: `
        <div>
          <SelectorTamanoPagina />
          <SelectorTamanoPagina />
          <ListaValoraciones titulo="Recibidas" estado="empty" />
          <ListaValoraciones titulo="Escritas" estado="empty" />
        </div>
      `
    })

    const ids = wrapper.findAll('[id]').map((elemento) => elemento.attributes('id'))
    expect(ids).toHaveLength(4)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => !/\s/.test(id))).toBe(true)
  })
})
