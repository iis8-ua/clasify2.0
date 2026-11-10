import PlaceholderView from '../views/PlaceholderView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

export const routes = [
  {
    path: '/',
    name: 'anuncios',
    component: PlaceholderView,
    meta: { title: 'Anuncios', publica: true, placeholder: true }
  },
  {
    path: '/anuncios/nuevo',
    name: 'anuncio-crear',
    component: PlaceholderView,
    meta: { title: 'Publicar anuncio', requiereSesion: true, placeholder: true }
  },
  {
    path: '/anuncios/:id/editar',
    name: 'anuncio-editar',
    component: PlaceholderView,
    meta: { title: 'Editar anuncio', requiereSesion: true, placeholder: true }
  },
  {
    path: '/anuncios/:id',
    name: 'anuncio-detalle',
    component: PlaceholderView,
    meta: { title: 'Detalle del anuncio', publica: true, placeholder: true }
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
    component: PlaceholderView,
    meta: { title: 'Favoritos', requiereSesion: true, placeholder: true }
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
