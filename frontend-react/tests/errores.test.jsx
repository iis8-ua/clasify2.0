import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.jsx'
import { authService } from '../../shared/api/authService.js'
import { anunciosService } from '../../shared/api/anunciosService.js'
import { categoriasService } from '../../shared/api/categoriasService.js'
import { anuncioPropio, categorias, paginacionUnaPagina } from './fixtures'

vi.mock('../../shared/api/anunciosService.js', () => ({
  anunciosService: { listar: vi.fn(), eliminar: vi.fn() }
}))

vi.mock('../../shared/api/authService.js', () => ({
  authService: { iniciarSesion: vi.fn(), obtenerUsuarioActual: vi.fn() }
}))

vi.mock('../../shared/api/categoriasService.js', () => ({
  categoriasService: { listar: vi.fn() }
}))

function preparar(opciones = {}) {
  anunciosService.listar.mockResolvedValue({
    datos: [anuncioPropio],
    paginacion: paginacionUnaPagina
  })

  if (opciones.categoriasFallan) {
    categoriasService.listar.mockRejectedValue(new Error('sin categorías'))
  } else {
    categoriasService.listar.mockResolvedValue({
      datos: categorias,
      paginacion: { pagina: 1, limite: 100, total: 2, paginas: 1 }
    })
  }
}

describe('errores y fallos del frontend React', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    window.sessionStorage.clear()
  })

  it('limpia la sesión ante un evento de sesión caducada', async () => {
    window.sessionStorage.setItem('clasify.react.token', 'token-react')
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })
    preparar()

    render(<App />)
    expect(await screen.findByText('Hola, Ana Ruiz')).toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new Event('clasify:unauthorized'))
    })

    expect(await screen.findByText('Estás como visitante')).toBeInTheDocument()
    expect(screen.getByText('Tu sesión ha caducado. Inicia sesión de nuevo.')).toBeInTheDocument()
    expect(window.sessionStorage.getItem('clasify.react.token')).toBeNull()
  })

  it('mantiene el listado si fallan las categorías', async () => {
    preparar({ categoriasFallan: true })

    render(<App />)

    expect(await screen.findByText('Bicicleta de montaña')).toBeInTheDocument()
    expect(screen.getByText('Categoría no disponible')).toBeInTheDocument()
  })

  it('muestra el formulario de acceso sin sesión', async () => {
    preparar()

    render(<App />)

    expect(await screen.findByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument()
  })

  it('mantiene el diálogo y el anuncio si el backend falla por conexión', async () => {
    window.sessionStorage.setItem('clasify.react.token', 'token-react')
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })
    preparar()
    anunciosService.eliminar.mockRejectedValue({
      estado: 0,
      mensaje: 'No se ha podido conectar con el servidor'
    })

    render(<App />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar' })
    )

    expect(
      await screen.findByText('No se ha podido conectar con el servidor')
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
