import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../src/App.jsx'
import { authService } from '../../shared/api/authService.js'
import { anunciosService } from '../../shared/api/anunciosService.js'
import { categoriasService } from '../../shared/api/categoriasService.js'
import {
  anuncioAjeno,
  anuncioPropio,
  categorias,
  paginacionUnaPagina
} from './fixtures'

vi.mock('../../shared/api/anunciosService.js', () => ({
  anunciosService: { listar: vi.fn(), eliminar: vi.fn() }
}))

vi.mock('../../shared/api/authService.js', () => ({
  authService: { iniciarSesion: vi.fn(), obtenerUsuarioActual: vi.fn() }
}))

vi.mock('../../shared/api/categoriasService.js', () => ({
  categoriasService: { listar: vi.fn() }
}))

function prepararSesionYListado(opciones = {}) {
  window.sessionStorage.setItem('clasify.react.token', 'token-react')
  authService.obtenerUsuarioActual.mockResolvedValue({ id: 1, nombre: 'Ana Ruiz' })
  categoriasService.listar.mockResolvedValue({
    datos: categorias,
    paginacion: { pagina: 1, limite: 100, total: 2, paginas: 1 }
  })

  const respuestaInicial = {
    datos: [anuncioPropio, anuncioAjeno],
    paginacion: paginacionUnaPagina
  }
  const respuestaFinal = opciones.respuestaFinal ?? {
    datos: [],
    paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
  }

  anunciosService.listar
    .mockResolvedValueOnce(respuestaInicial)
    .mockResolvedValueOnce(respuestaFinal)
}

describe('borrado de anuncios propios', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('solo muestra eliminar en anuncios propios', async () => {
    prepararSesionYListado()

    render(<App />)

    expect(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Eliminar Mesa de madera' })
    ).not.toBeInTheDocument()
  })

  it('cancela el borrado sin llamar al backend', async () => {
    prepararSesionYListado()

    render(<App />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    )

    const dialogo = await screen.findByRole('dialog')
    await waitFor(() => {
      expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus()
    })
    fireEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(anunciosService.eliminar).not.toHaveBeenCalled()
  })

  it('confirma el borrado y actualiza el listado', async () => {
    prepararSesionYListado()
    anunciosService.eliminar.mockResolvedValue(undefined)

    render(<App />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    )
    const dialogo = await screen.findByRole('dialog')
    fireEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText('Anuncio eliminado correctamente.')).toBeInTheDocument()
    expect(anunciosService.eliminar).toHaveBeenCalledWith(25)
    expect(await screen.findByText('No hay anuncios disponibles.')).toBeInTheDocument()
  })

  it('mantiene el anuncio y muestra permisos si el backend rechaza', async () => {
    prepararSesionYListado()
    anunciosService.eliminar.mockRejectedValue({
      estado: 403,
      mensaje: 'No tienes permisos para realizar esta acción.'
    })

    render(<App />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    )
    const dialogo = await screen.findByRole('dialog')
    fireEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }))

    expect(
      await screen.findByText('No tienes permisos para realizar esta acción.')
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bicicleta de montaña' })).toBeInTheDocument()
  })

  it('converge cuando el anuncio ya no existe', async () => {
    prepararSesionYListado()
    anunciosService.eliminar.mockRejectedValue({
      estado: 404,
      mensaje: 'No existe el anuncio 25'
    })

    render(<App />)
    fireEvent.click(
      await screen.findByRole('button', { name: 'Eliminar Bicicleta de montaña' })
    )
    const dialogo = await screen.findByRole('dialog')
    fireEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText('El anuncio ya no existe.')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
