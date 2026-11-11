export const FILTROS_POR_DEFECTO = {
  texto: '',
  categoria: null,
  estado: 'disponible',
  orden: 'fecha_desc',
  pagina: 1,
  limite: 20
}

export const ORDENES = ['fecha_desc', 'fecha_asc', 'precio_desc', 'precio_asc']
export const ESTADOS = ['disponible', 'vendido', 'todos']
export const TAMANOS_PAGINA = [10, 20, 50]

function enteroPositivo(valor, porDefecto) {
  const numero = Number(valor)
  return Number.isInteger(numero) && numero >= 1 ? numero : porDefecto
}

function tamanoPagina(valor) {
  const numero = Number(valor)
  return TAMANOS_PAGINA.includes(numero) ? numero : FILTROS_POR_DEFECTO.limite
}

export function leerQuery(query = {}) {
  const texto = typeof query.texto === 'string' ? query.texto.trim() : ''
  const categoria = query.categoria === undefined || query.categoria === ''
    ? null
    : enteroPositivo(query.categoria, null)
  const estado = ESTADOS.includes(query.estado) ? query.estado : FILTROS_POR_DEFECTO.estado
  const orden = ORDENES.includes(query.orden) ? query.orden : FILTROS_POR_DEFECTO.orden
  const pagina = enteroPositivo(query.pagina, FILTROS_POR_DEFECTO.pagina)
  const limite = tamanoPagina(query.limite)

  return { texto, categoria, estado, orden, pagina, limite }
}

export function escribirQuery(filtros) {
  const query = {}
  if (filtros.texto) {
    query.texto = filtros.texto
  }
  if (filtros.categoria) {
    query.categoria = String(filtros.categoria)
  }
  if (filtros.estado !== FILTROS_POR_DEFECTO.estado) {
    query.estado = filtros.estado
  }
  if (filtros.orden !== FILTROS_POR_DEFECTO.orden) {
    query.orden = filtros.orden
  }
  if (filtros.pagina > 1) {
    query.pagina = String(filtros.pagina)
  }
  if (filtros.limite !== FILTROS_POR_DEFECTO.limite) {
    query.limite = String(filtros.limite)
  }
  return query
}

export function conPagina(filtros, pagina) {
  return { ...filtros, pagina }
}

export function conFiltro(filtros, cambios) {
  return { ...filtros, ...cambios, pagina: 1 }
}

export function conTamano(filtros, limite) {
  return { ...filtros, limite: tamanoPagina(limite), pagina: 1 }
}
