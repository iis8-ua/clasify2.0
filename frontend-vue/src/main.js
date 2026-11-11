import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import { useSessionStore } from './stores/session'
import { useAnunciosStore } from './stores/anuncios'
import { useFavoritosStore } from './stores/favoritos'
import { usePerfilStore } from './stores/perfil'
import { configurarHttp } from './services/http'
import { esErrorDeSesion } from './services/errors'
import { ClasifyPreset } from './styles/primevue-theme'
import './styles/tokens.css'
import './styles/base.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  setActivePinia(pinia)

  app.use(pinia)

  const session = useSessionStore(pinia)
  const anuncios = useAnunciosStore(pinia)
  const favoritos = useFavoritosStore(pinia)
  const perfil = usePerfilStore(pinia)
  anuncios.sincronizarSesion(session.sessionVersion)
  favoritos.sincronizarSesion(session.sessionVersion)
  perfil.sincronizarSesion(session.sessionVersion)
  session.$subscribe((_mutacion, estado) => {
    anuncios.sincronizarSesion(estado.sessionVersion)
    favoritos.sincronizarSesion(estado.sessionVersion)
    perfil.sincronizarSesion(estado.sessionVersion)
  })

  const apiUrl = import.meta.env.VITE_API_URL
  if (!apiUrl) {
    throw new Error('Falta VITE_API_URL. Copia frontend-vue/.env.example a frontend-vue/.env')
  }
  if (!apiUrl.includes('/clasify_api')) {
    throw new Error('VITE_API_URL debe incluir la ruta /clasify_api')
  }

  configurarHttp({
    baseUrl: apiUrl,
    getToken: () => session.token,
    onUnauthorized: (error) => {
      const estabaComprobando = session.estaComprobando
      const ruta = router.currentRoute.value
      const eraSesion = esErrorDeSesion(error.codigo)
      session.manejarNoAutorizado(error)

      if (eraSesion && !estabaComprobando) {
        const redirect =
          ruta.name && ruta.name !== 'login' ? { redirect: ruta.fullPath } : {}
        router.push({ name: 'login', query: redirect })
      }
    }
  })

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

  await router.isReady()
  await session.restaurarSesion()

  const ruta = router.currentRoute.value
  if (session.estaAutenticado && ruta.meta.soloVisitantes) {
    await router.replace({ name: 'anuncios' })
  } else if (session.estado === 'visitante' && ruta.meta.requiereSesion) {
    await router.replace({ name: 'login', query: { redirect: ruta.fullPath } })
  }
}

bootstrap()
