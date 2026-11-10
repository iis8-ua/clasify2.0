import { http } from './http'

const LIMITE = 20

function crearFormData(valores, imagen) {
  const datos = new FormData()
  Object.entries(valores).forEach(([campo, valor]) => {
    if (valor !== undefined && valor !== null) {
      datos.append(campo, String(valor))
    }
  })
  if (imagen) {
    datos.append('imagen', imagen)
  }
  return datos
}

function normalizarAnuncio(anuncio) {
  if (!anuncio) {
    return anuncio
  }

  return {
    ...anuncio,
    id_autor: anuncio.id_autor ?? anuncio.autor?.id ?? null,
    id_categoria: anuncio.id_categoria ?? anuncio.categoria?.id ?? null
  }
}

export const anunciosService = {
  async listar(filtros = {}) {
    const parametros = new URLSearchParams()
    parametros.set('estado', filtros.estado ?? 'disponible')
    parametros.set('orden', filtros.orden ?? 'fecha_desc')
    parametros.set('pagina', String(filtros.pagina ?? 1))
    parametros.set('limite', String(LIMITE))

    if (filtros.texto) {
      parametros.set('texto', filtros.texto)
    }
    if (filtros.categoria) {
      parametros.set('categoria', String(filtros.categoria))
    }

    return http.get(`/anuncios?${parametros.toString()}`)
  },
  async detalle(id) {
    const respuesta = await http.get(`/anuncios/${id}`, { auth: true })
    return normalizarAnuncio(respuesta.datos.anuncio)
  },
  async crear(valores, imagen) {
    const cuerpo = imagen ? crearFormData(valores, imagen) : valores
    const respuesta = await http.post('/anuncios', cuerpo, { auth: true })
    return normalizarAnuncio(respuesta.datos.anuncio)
  },
  async actualizar(id, valores, imagen) {
    const cuerpo = imagen ? crearFormData(valores, imagen) : valores
    const respuesta = await http.patch(`/anuncios/${id}`, cuerpo, { auth: true })
    return normalizarAnuncio(respuesta.datos.anuncio)
  },
  async cambiarEstado(id, estado) {
    const respuesta = await http.patch(`/anuncios/${id}/estado`, { estado }, { auth: true })
    return normalizarAnuncio(respuesta.datos.anuncio)
  },
  async eliminar(id) {
    await http.delete(`/anuncios/${id}`, { auth: true })
  }
}
