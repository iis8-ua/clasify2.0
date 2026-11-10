import { normalizarErrorConexion, normalizarErrorHttp } from './errors'

const configuracion = {
  baseUrl: import.meta.env.VITE_API_URL ?? '',
  getToken: () => null,
  onUnauthorized: () => {}
}

export function configurarHttp(opciones = {}) {
  Object.assign(configuracion, opciones)
}

function construirUrl(path) {
  return `${configuracion.baseUrl.replace(/\/$/, '')}${path}`
}

async function solicitar(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const cabeceras = { ...headers }
  let cuerpo

  if (body instanceof FormData) {
    cuerpo = body
  } else if (body !== undefined) {
    cabeceras['Content-Type'] = 'application/json'
    cuerpo = JSON.stringify(body)
  }

  if (auth) {
    const token = configuracion.getToken()
    if (token) {
      cabeceras.Authorization = `Bearer ${token}`
    }
  }

  let respuesta
  try {
    respuesta = await fetch(construirUrl(path), {
      method,
      headers: cabeceras,
      body: cuerpo
    })
  } catch {
    const error = normalizarErrorConexion()
    configuracion.onUnauthorized(error)
    throw error
  }

  if (respuesta.status === 204) {
    return null
  }

  const tipo = respuesta.headers.get('content-type') ?? ''
  const datos = tipo.includes('application/json') ? await respuesta.json() : null

  if (!respuesta.ok) {
    const error = normalizarErrorHttp(respuesta.status, datos)
    if (respuesta.status === 401) {
      configuracion.onUnauthorized(error)
    }
    throw error
  }

  return datos
}

export const http = {
  get(path, options = {}) {
    return solicitar(path, { ...options, method: 'GET' })
  },
  post(path, body, options = {}) {
    return solicitar(path, { ...options, method: 'POST', body })
  },
  patch(path, body, options = {}) {
    return solicitar(path, { ...options, method: 'PATCH', body })
  },
  delete(path, options = {}) {
    return solicitar(path, { ...options, method: 'DELETE' })
  }
}
