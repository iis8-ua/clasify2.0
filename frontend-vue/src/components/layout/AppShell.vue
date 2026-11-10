<script setup>
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <AppHeader />
    <main id="contenido" class="app-main" tabindex="-1">
      <slot />
    </main>
  </div>
</template>
