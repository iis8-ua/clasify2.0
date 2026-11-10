import PlaceholderView from '../views/PlaceholderView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AnunciosListView from '../views/AnunciosListView.vue'
import AnuncioDetalleView from '../views/AnuncioDetalleView.vue'
import AnuncioCrearView from '../views/AnuncioCrearView.vue'
import AnuncioEditarView from '../views/AnuncioEditarView.vue'
import FavoritosView from '../views/FavoritosView.vue'

export const routes = [
  {
    path: '/',
    name: 'anuncios',
    component: AnunciosListView,
    meta: { title: 'Anuncios', publica: true }
  },
  {
    path: '/anuncios/nuevo',
    name: 'anuncio-crear',
    component: AnuncioCrearView,
    meta: { title: 'Publicar anuncio', requiereSesion: true }
  },
  {
    path: '/anuncios/:id/editar',
    name: 'anuncio-editar',
    component: AnuncioEditarView,
    meta: { title: 'Editar anuncio', requiereSesion: true }
  },
  {
    path: '/anuncios/:id',
    name: 'anuncio-detalle',
    component: AnuncioDetalleView,
    meta: { title: 'Detalle del anuncio', publica: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Iniciar sesión', publica: true, soloVisitantes: true }
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegisterView,
    meta: { title: 'Crear cuenta', publica: true, soloVisitantes: true }
  },
  {
    path: '/favoritos',
    name: 'favoritos',
    component: FavoritosView,
    meta: { title: 'Favoritos', requiereSesion: true }
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: PlaceholderView,
    meta: { title: 'Mi perfil', requiereSesion: true, placeholder: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrado',
    component: NotFoundView,
    meta: { title: 'Página no encontrada', publica: true }
  }
]
