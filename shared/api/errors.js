export class ApiError extends Error {
  constructor({ estado = 0, codigo = 'ERROR', mensaje = 'Se ha producido un error', campo = null, tipo = 'http' } = {}) {
    super(mensaje)
    this.name = 'ApiError'
    this.estado = estado
    this.codigo = codigo
    this.mensaje = mensaje
    this.campo = campo
    this.tipo = tipo
  }
}

const CODIGOS_SESION = new Set([
  'SIN_TOKEN',
  'TOKEN_INVALIDO',
  'TOKEN_CADUCADO',
  'USUARIO_NO_EXISTE'
])

export function esErrorDeSesion(codigo) {
  return CODIGOS_SESION.has(codigo)
}

export function esErrorDeCredenciales(codigo) {
  return codigo === 'CREDENCIALES_INVALIDAS'
}

export function esErrorDeContrasenaActual(error) {
  return error?.codigo === 'CREDENCIALES_INVALIDAS'
}

export function mensajePorEstado(estado) {
  const mensajes = {
    400: 'Los datos enviados no son válidos',
    401: 'La sesión no es válida',
    403: 'No tienes permisos para realizar esta acción',
    404: 'No se ha encontrado el recurso solicitado',
    409: 'La operación entra en conflicto con los datos actuales',
    413: 'La información enviada es demasiado grande',
    500: 'Se ha producido un error en el servidor'
  }
  return mensajes[estado] ?? 'Se ha producido un error'
}

export function normalizarErrorHttp(estado, payload) {
  const error = payload?.error ?? {}
  return new ApiError({
    estado,
    codigo: error.codigo ?? `HTTP_${estado}`,
    mensaje: error.mensaje ?? mensajePorEstado(estado),
    campo: error.campo ?? null,
    tipo: 'http'
  })
}

export function normalizarErrorConexion() {
  return new ApiError({
    estado: 0,
    codigo: 'ERROR_CONEXION',
    mensaje: 'No se ha podido conectar con el servidor',
    tipo: 'conexion'
  })
}

export function normalizarError(error) {
  if (error instanceof ApiError) {
    return error
  }
  return new ApiError({
    codigo: 'ERROR_INTERNO',
    mensaje: 'Se ha producido un error inesperado',
    tipo: 'interno'
  })
}
