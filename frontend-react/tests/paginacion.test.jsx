import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../src/App.jsx'
import { anunciosService } from '../../shared/api/anunciosService.js'
import { categoriasService } from '../../shared/api/categoriasService.js'
import {
  anuncioAjeno,
  anuncioPropio,
  categorias
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

describe('paginación del listado', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    categoriasService.listar.mockResolvedValue({
      datos: categorias,
      paginacion: { pagina: 1, limite: 100, total: 2, paginas: 1 }
    })
  })

  it('carga la página siguiente y actualiza los controles', async () => {
    anunciosService.listar
      .mockResolvedValueOnce({
        datos: [anuncioPropio],
        paginacion: { pagina: 1, limite: 20, total: 21, paginas: 2 }
      })
      .mockResolvedValueOnce({
        datos: [anuncioAjeno],
        paginacion: { pagina: 2, limite: 20, total: 21, paginas: 2 }
      })

    render(<App />)

    expect(await screen.findByText('Página 1 de 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(await screen.findByText('Página 2 de 2')).toBeInTheDocument()
    expect(anunciosService.listar).toHaveBeenLastCalledWith({ pagina: 2, limite: 20 })
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  })
})
