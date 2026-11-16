import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../src/App.jsx'
import { anunciosService } from '../../shared/api/anunciosService.js'
import { authService } from '../../shared/api/authService.js'
import { categoriasService } from '../../shared/api/categoriasService.js'
import {
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

describe('listado de anuncios', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: categorias,
      paginacion: { pagina: 1, limite: 100, total: 2, paginas: 1 }
    })
  })

  it('muestra título, precio, categoría y estado', async () => {
    anunciosService.listar.mockResolvedValue({
      datos: [anuncioPropio],
      paginacion: paginacionUnaPagina
    })

    render(<App />)

    expect(await screen.findByText('Bicicleta de montaña')).toBeInTheDocument()
    expect(screen.getByText(/250/)).toBeInTheDocument()
    expect(screen.getByText('Electrónica')).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(anunciosService.listar).toHaveBeenCalledWith({ pagina: 1, limite: 20 })
  })

  it('distingue un listado vacío de un error', async () => {
    anunciosService.listar.mockResolvedValue({
      datos: [],
      paginacion: { pagina: 1, limite: 20, total: 0, paginas: 0 }
    })

    render(<App />)

    expect(await screen.findByText('No hay anuncios disponibles.')).toBeInTheDocument()
  })

  it('muestra un error comprensible y permite reintentar', async () => {
    anunciosService.listar
      .mockRejectedValueOnce({ mensaje: 'No se pudieron cargar los anuncios.' })
      .mockResolvedValueOnce({
        datos: [anuncioPropio],
        paginacion: paginacionUnaPagina
      })

    render(<App />)

    expect(await screen.findByText('No se pudieron cargar los anuncios.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Bicicleta de montaña')).toBeInTheDocument()
    expect(anunciosService.listar).toHaveBeenCalledTimes(2)
  })
})
