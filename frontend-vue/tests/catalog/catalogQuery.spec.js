import { describe, expect, it } from 'vitest'
import {
  conFiltro,
  conPagina,
  escribirQuery,
  leerQuery,
  FILTROS_POR_DEFECTO
} from '../../src/router/catalogQuery'

describe('query del catálogo', () => {
  it('lee los valores por defecto', () => {
    expect(leerQuery({})).toEqual(FILTROS_POR_DEFECTO)
  })

  it('normaliza valores inválidos', () => {
    expect(
      leerQuery({ texto: '  mesa  ', categoria: '3', estado: 'raro', orden: 'raro', pagina: '0' })
    ).toEqual({
      texto: 'mesa',
      categoria: 3,
      estado: 'disponible',
      orden: 'fecha_desc',
      pagina: 1
    })
  })

  it('conserva el texto largo para que la vista lo valide', () => {
    const texto = 'a'.repeat(151)
    expect(leerQuery({ texto }).texto).toHaveLength(151)
  })

  it('serializa solo los valores no por defecto', () => {
    expect(
      escribirQuery({
        texto: 'mesa',
        categoria: 3,
        estado: 'vendido',
        orden: 'precio_asc',
        pagina: 2
      })
    ).toEqual({
      texto: 'mesa',
      categoria: '3',
      estado: 'vendido',
      orden: 'precio_asc',
      pagina: '2'
    })
  })

  it('vuelve a página 1 al cambiar un filtro', () => {
    expect(conFiltro({ ...FILTROS_POR_DEFECTO, pagina: 3 }, { categoria: 2 })).toEqual({
      ...FILTROS_POR_DEFECTO,
      categoria: 2,
      pagina: 1
    })
  })

  it('conserva filtros al cambiar de página', () => {
    expect(conPagina({ ...FILTROS_POR_DEFECTO, texto: 'mesa' }, 2)).toEqual({
      ...FILTROS_POR_DEFECTO,
      texto: 'mesa',
      pagina: 2
    })
  })
})
