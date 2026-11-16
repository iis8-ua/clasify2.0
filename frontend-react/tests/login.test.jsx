import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../src/App.jsx'
import { authService } from '../../shared/api/authService.js'
import { anunciosService } from '../../shared/api/anunciosService.js'
import { categoriasService } from '../../shared/api/categoriasService.js'
import { categorias, paginacionUnaPagina, anuncioPropio } from './fixtures'

vi.mock('../../shared/api/anunciosService.js', () => ({
  anunciosService: { listar: vi.fn(), eliminar: vi.fn() }
}))

vi.mock('../../shared/api/authService.js', () => ({
  authService: { iniciarSesion: vi.fn(), obtenerUsuarioActual: vi.fn() }
}))

vi.mock('../../shared/api/categoriasService.js', () => ({
  categoriasService: { listar: vi.fn() }
}))

function prepararListado() {
  anunciosService.listar.mockResolvedValue({
    datos: [anuncioPropio],
    paginacion: paginacionUnaPagina
  })
  categoriasService.listar.mockResolvedValue({
    datos: categorias,
    paginacion: { pagina: 1, limite: 100, total: 2, paginas: 1 }
  })
}

async function acceder() {
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'ana@example.com' }
  })
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'Clasify123!' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('sesión del frontend React', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    prepararListado()
  })

  it('inicia sesión y guarda el token', async () => {
    authService.iniciarSesion.mockResolvedValue({
      token: 'token-react',
      usuario: { id: 1, nombre: 'Ana Ruiz' }
    })
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })

    render(<App />)
    await screen.findByText('Bicicleta de montaña')
    await acceder()

    expect(await screen.findByText('Hola, Ana Ruiz')).toBeInTheDocument()
    expect(window.sessionStorage.getItem('clasify.react.token')).toBe('token-react')
  })

  it('muestra un error comprensible con credenciales incorrectas', async () => {
    authService.iniciarSesion.mockRejectedValue({
      mensaje: 'El email o la contraseña no son correctos'
    })

    render(<App />)
    await screen.findByText('Bicicleta de montaña')
    await acceder()

    expect(
      await screen.findByText('El email o la contraseña no son correctos')
    ).toBeInTheDocument()
    expect(screen.queryByText(/Hola,/)).not.toBeInTheDocument()
  })

  it('recupera la sesión al recargar', async () => {
    window.sessionStorage.setItem('clasify.react.token', 'token-guardado')
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })

    render(<App />)

    expect(await screen.findByText('Hola, Ana Ruiz')).toBeInTheDocument()
  })

  it('cierra sesión y elimina el token', async () => {
    authService.iniciarSesion.mockResolvedValue({
      token: 'token-react',
      usuario: { id: 1, nombre: 'Ana Ruiz' }
    })
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })

    render(<App />)
    await screen.findByText('Bicicleta de montaña')
    await acceder()
    await screen.findByText('Hola, Ana Ruiz')

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(await screen.findByText('Estás como visitante')).toBeInTheDocument()
    expect(window.sessionStorage.getItem('clasify.react.token')).toBeNull()
  })
})
