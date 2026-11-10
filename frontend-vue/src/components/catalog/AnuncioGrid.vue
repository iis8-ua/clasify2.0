<script setup>
import AnuncioCard from './AnuncioCard.vue'

defineProps({
  anuncios: {
    type: Array,
    default: () => []
  },
  categoriasPorId: {
    type: Object,
    default: () => ({})
  }
})
</script>

<template>
  <div class="anuncio-grid">
    <AnuncioCard
      v-for="anuncio in anuncios"
      :key="anuncio.id"
      :anuncio="anuncio"
      :nombre-categoria="categoriasPorId[anuncio.id_categoria] ?? 'Categoría no disponible'"
    />
  </div>
</template>
