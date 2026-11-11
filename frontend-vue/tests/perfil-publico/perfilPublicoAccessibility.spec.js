import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PerfilPublicoDatos from '../../src/components/perfil-publico/PerfilPublicoDatos.vue'
import ValoracionesRecibidas from '../../src/components/perfil-publico/ValoracionesRecibidas.vue'
import AnunciosUsuario from '../../src/components/perfil-publico/AnunciosUsuario.vue'

const rutas = [
  { path: '/usuarios/:id', name: 'perfil-publico', component: { template: '<div />' } },
  { path: '/anuncios/:id', name: 'anuncio-detalle', component: { template: '<div />' } }
]

async function conRouter(componente, props) {
  const router = createRouter({ history: createMemoryHistory(), routes: rutas })
  await router.push('/usuarios/1')
  await router.isReady()
  return mount(componente, { props, global: { plugins: [router] } })
}

describe('accesibilidad del perfil público', () => {
  it('usa encabezados y listas accesibles', async () => {
    const datos = await conRouter(PerfilPublicoDatos, {
      perfil: { id: 1, nombre: 'Ana', biografia: '', fecha_alta: '2026-11-10T09:00:00.000Z', valoracion_media: null, num_valoraciones: 0 }
    })
    expect(datos.get('h2').text()).toBe('Datos públicos')
    expect(datos.text()).toContain('Sin biografía')

    const valoraciones = await conRouter(ValoracionesRecibidas, { estado: 'empty', valoraciones: [] })
    expect(valoraciones.get('h2').text()).toBe('Valoraciones recibidas')

    const anuncios = await conRouter(AnunciosUsuario, { estado: 'empty', anuncios: [] })
    expect(anuncios.get('h2').text()).toBe('Anuncios publicados')
  })
})
