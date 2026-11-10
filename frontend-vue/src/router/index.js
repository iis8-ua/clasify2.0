import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { registrarGuardas } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

registrarGuardas(router)

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} | Clasify` : 'Clasify'
  nextTick(() => {
    document.getElementById('contenido')?.focus()
  })
})

export default router
