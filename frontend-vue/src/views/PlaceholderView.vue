<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title ?? 'Vista')
</script>

<template>
  <section class="placeholder" aria-labelledby="placeholder-title">
    <p class="placeholder__eyebrow">Próximamente</p>
    <h1 id="placeholder-title" class="page-title">{{ title }}</h1>
    <p class="placeholder__message">
      Esta sección se implementará en una especificación posterior.
    </p>
    <RouterLink class="button" :to="{ name: 'anuncios' }">Volver al inicio</RouterLink>
  </section>
</template>
