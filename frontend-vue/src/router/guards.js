import { useSessionStore } from '../stores/session'

export function resolverAcceso(to, session) {
  if (to.meta.requiereSesion && !session.estaAutenticado) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.soloVisitantes && session.estaAutenticado) {
    return { name: 'anuncios' }
  }

  return true
}

export function registrarGuardas(router) {
  router.beforeEach((to) => {
    const session = useSessionStore()
    return resolverAcceso(to, session)
  })
}
