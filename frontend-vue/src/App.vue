<script setup>
import Toast from 'primevue/toast'
import AppShell from './components/layout/AppShell.vue'
import StatePanel from './components/states/StatePanel.vue'
import { useSessionStore } from './stores/session'

const session = useSessionStore()
</script>

<template>
  <AppShell>
    <StatePanel
      v-if="session.estaComprobando"
      type="loading"
      message="Comprobando sesión…"
    />
    <RouterView v-else />
  </AppShell>
  <Toast position="bottom-right" />
</template>
