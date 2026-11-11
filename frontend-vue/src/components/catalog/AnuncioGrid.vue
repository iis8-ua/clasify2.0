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
  },
  nivelTitulo: {
    type: Number,
    default: 3,
    validator: (value) => [2, 3, 4].includes(value)
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
      :nivel-titulo="nivelTitulo"
    />
  </div>
</template>
