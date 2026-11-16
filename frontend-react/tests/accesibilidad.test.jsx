import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

describe('accesibilidad del frontend React', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    window.sessionStorage.setItem('clasify.react.token', 'token-react')
    authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })
    anunciosService.listar.mockResolvedValue({
      datos: [anuncioPropio],
      paginacion: paginacionUnaPagina
    })
    categoriasService.listar.mockResolvedValue({
      datos: categorias,
      paginacion: { pagina: 1, limite: 100, total: 2, paginas: 1 }
    })
  })

  it('tiene etiquetas, encabezados y campos accesibles', async () => {
    window.sessionStorage.clear()
    authService.obtenerUsuarioActual.mockReset()

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Anuncios' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
  })

  it('mueve el foco a la confirmación y permite cancelar', async () => {
    render(<App />)

    fireEvent.click(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    )
    const dialogo = await screen.findByRole('dialog', { name: 'Eliminar anuncio' })
    const cancelar = within(dialogo).getByRole('button', { name: 'Cancelar' })

    await waitFor(() => {
      expect(cancelar).toHaveFocus()
    })

    fireEvent.click(cancelar)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
