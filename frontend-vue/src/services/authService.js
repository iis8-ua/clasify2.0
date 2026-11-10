import { http } from './http'

export const authService = {
  async registrar(datos) {
    const respuesta = await http.post('/auth/register', datos)
    return respuesta.datos
  },
  async iniciarSesion(credenciales) {
    const respuesta = await http.post('/auth/login', credenciales)
    return respuesta.datos
  },
  async obtenerUsuarioActual() {
    const respuesta = await http.get('/auth/yo', { auth: true })
    return respuesta.datos.usuario
  }
}
