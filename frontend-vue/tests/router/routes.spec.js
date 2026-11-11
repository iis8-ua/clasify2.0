import { describe, expect, it } from 'vitest'
import { routes } from '../../src/router/routes'

describe('rutas de la aplicación', () => {
  it('define las rutas principales', () => {
    const nombres = routes.map((route) => route.name)
    expect(nombres).toEqual([
      'anuncios',
      'anuncio-crear',
      'anuncio-editar',
      'anuncio-detalle',
      'login',
      'registro',
      'favoritos',
      'perfil',
      'perfil-publico',
      'mensajes',
      'conversacion',
      'no-encontrado'
    ])
  })

  it('declara la creación antes del detalle dinámico', () => {
    const crear = routes.findIndex((route) => route.path === '/anuncios/nuevo')
    const detalle = routes.findIndex((route) => route.path === '/anuncios/:id')
    expect(crear).toBeLessThan(detalle)
  })

  it('deja la ruta catch-all al final', () => {
    const ultima = routes[routes.length - 1]
    expect(ultima.name).toBe('no-encontrado')
  })

  it('marca las rutas protegidas', () => {
    const protegidas = routes
      .filter((route) => route.meta.requiereSesion)
      .map((route) => route.name)
    expect(protegidas).toEqual(['anuncio-crear', 'anuncio-editar', 'favoritos', 'perfil', 'mensajes', 'conversacion'])
  })
})
