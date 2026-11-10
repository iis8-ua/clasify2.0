import { http } from './http'

export const usuariosService = {
  async perfil() {
    const respuesta = await http.get('/usuarios/me', { auth: true })
    return respuesta.datos.usuario
  },
  async actualizarPerfil(cambios) {
    const respuesta = await http.patch('/usuarios/me', cambios, { auth: true })
    return respuesta.datos.usuario
  },
  async cambiarContrasena({ passwordActual, passwordNueva }) {
    const respuesta = await http.patch(
      '/usuarios/me',
      {
        password: passwordNueva,
        password_actual: passwordActual
      },
      { auth: true }
    )
    return respuesta.datos.usuario
  },
  async listarAnuncios({ pagina = 1, limite = 20 } = {}) {
    return http.get(`/usuarios/me/anuncios?pagina=${pagina}&limite=${limite}`, { auth: true })
  }
}
