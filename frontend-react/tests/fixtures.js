export const anuncioPropio = {
  id: 25,
  titulo: 'Bicicleta de montaña',
  precio: '250.00',
  estado: 'disponible',
  imagen: null,
  fecha_creacion: '2026-11-10T10:00:00.000Z',
  id_categoria: 1,
  id_autor: 1
}

export const anuncioAjeno = {
  id: 26,
  titulo: 'Mesa de madera',
  precio: '45.00',
  estado: 'vendido',
  imagen: 'mesa.webp',
  fecha_creacion: '2026-11-09T10:00:00.000Z',
  id_categoria: 2,
  id_autor: 2
}

export const paginacionUnaPagina = {
  pagina: 1,
  limite: 20,
  total: 1,
  paginas: 1
}

export const paginacionDosPaginas = {
  pagina: 1,
  limite: 20,
  total: 21,
  paginas: 2
}

export const categorias = [
  { id: 1, nombre: 'Electrónica' },
  { id: 2, nombre: 'Hogar' }
]
