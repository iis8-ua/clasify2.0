import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../../src/App.jsx'
import { authService } from '../../../shared/api/authService.js'
import { anunciosService } from '../../../shared/api/anunciosService.js'
import { configurarHttp } from '../../../shared/api/http.js'

const ejecutar = process.env.VALIDACION_BACKEND === '1'
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/clasify_api'
let token = null
let idTemporal = null

describe.skipIf(!ejecutar)('validación real del frontend React', () => {
  beforeAll(async () => {
    configurarHttp({
      baseUrl: API,
      getToken: () => token,
      onUnauthorized: () => {}
    })

    const sesion = await authService.iniciarSesion({
      email: 'ana@example.com',
      password: 'Clasify123!'
    })
    token = sesion.token
    const anuncio = await anunciosService.crear({
      titulo: 'Anuncio temporal React',
      descripcion: 'Anuncio para validar el frontend alternativo',
      precio: '10',
      categoria: 1
    })
    idTemporal = anuncio.id
  })

  afterAll(async () => {
    if (token && idTemporal) {
      try {
        await anunciosService.eliminar(idTemporal)
      } catch {
        idTemporal = null
      }
    }
  })

  it('lista el anuncio temporal y lo elimina con confirmación', async () => {
    window.sessionStorage.setItem('clasify.react.token', token)

    render(<App />)

    expect(await screen.findByText('Anuncio temporal React')).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar Anuncio temporal React' })
    )
    const dialogo = await screen.findByRole('dialog')
    fireEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText('Anuncio eliminado correctamente.')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Anuncio temporal React')).not.toBeInTheDocument()
    })
  })
})
