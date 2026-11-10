import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import { useSessionStore } from './stores/session'
import { useFavoritosStore } from './stores/favoritos'
import { usePerfilStore } from './stores/perfil'
import { configurarHttp } from './services/http'
import { ClasifyPreset } from './styles/primevue-theme'
import './styles/tokens.css'
import './styles/base.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  setActivePinia(pinia)

  app.use(pinia)

  const session = useSessionStore(pinia)
  const favoritos = useFavoritosStore(pinia)
  const perfil = usePerfilStore(pinia)
  favoritos.sincronizarSesion(session.sessionVersion)
  perfil.sincronizarSesion(session.sessionVersion)
  session.$subscribe((_mutacion, estado) => {
    favoritos.sincronizarSesion(estado.sessionVersion)
    perfil.sincronizarSesion(estado.sessionVersion)
  })

  configurarHttp({
    getToken: () => session.token,
    onUnauthorized: (error) => session.manejarNoAutorizado(error)
  })

  await session.restaurarSesion()

  app.use(router)
  app.use(PrimeVue, {
    theme: {
      preset: ClasifyPreset,
      options: {
        darkModeSelector: false
      }
    }
  })
  app.use(ToastService)

  app.mount('#app')
}

bootstrap()
