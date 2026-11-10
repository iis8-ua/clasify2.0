<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../../stores/session'
import { navigationItems, itemsVisibles } from './navigation'
import AppNav from './AppNav.vue'

const session = useSessionStore()
const router = useRouter()
const visibles = computed(() => itemsVisibles(navigationItems, session.estaAutenticado))

function cerrarSesion() {
  session.cerrarSesion()
  router.push({ name: 'anuncios' })
}

function reintentarSesion() {
  session.reintentarRestauracion()
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink class="brand" :to="{ name: 'anuncios' }" aria-label="Clasify, ir al inicio">
        <span class="brand__mark" aria-hidden="true">C</span>
        <span>Clasify</span>
      </RouterLink>

      <AppNav :items="visibles" />

      <div class="header-actions">
        <div v-if="session.estado === 'error'" class="session-alert" role="alert">
          <span>No se pudo comprobar la sesión</span>
          <button type="button" class="button button--secondary" @click="reintentarSesion">
            Reintentar
          </button>
        </div>

        <span v-if="session.estaComprobando" class="header-actions__user">
          Comprobando sesión…
        </span>

        <template v-else-if="session.estaAutenticado">
          <span class="header-actions__user">Hola, {{ session.nombreVisible }}</span>
          <RouterLink v-if="session.puedeCrear" class="button" :to="{ name: 'anuncio-crear' }">
            Publicar anuncio
          </RouterLink>
          <button type="button" class="button button--secondary" @click="cerrarSesion">
            Cerrar sesión
          </button>
        </template>

        <template v-else-if="session.estado !== 'error'">
          <RouterLink class="button button--secondary" :to="{ name: 'login' }">
            Iniciar sesión
          </RouterLink>
          <RouterLink class="button" :to="{ name: 'registro' }">Crear cuenta</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
