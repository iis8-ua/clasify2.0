import { describe, expect, it } from 'vitest'
import {
  esErrorDeCredenciales,
  esErrorDeSesion,
  normalizarErrorConexion,
  normalizarErrorHttp
} from '../../src/services/errors'

describe('errores HTTP', () => {
  it('normaliza un error de validación con campo', () => {
    const error = normalizarErrorHttp(400, {
      error: { codigo: 'VALIDACION', mensaje: 'Título obligatorio', campo: 'titulo' }
    })
    expect(error.estado).toBe(400)
    expect(error.codigo).toBe('VALIDACION')
    expect(error.mensaje).toBe('Título obligatorio')
    expect(error.campo).toBe('titulo')
    expect(error.tipo).toBe('http')
  })

  it('normaliza un error de conexión', () => {
    const error = normalizarErrorConexion()
    expect(error.estado).toBe(0)
    expect(error.codigo).toBe('ERROR_CONEXION')
    expect(error.tipo).toBe('conexion')
  })

  it('clasifica códigos de sesión', () => {
    expect(esErrorDeSesion('TOKEN_CADUCADO')).toBe(true)
    expect(esErrorDeSesion('CREDENCIALES_INVALIDAS')).toBe(false)
    expect(esErrorDeCredenciales('CREDENCIALES_INVALIDAS')).toBe(true)
  })
})
