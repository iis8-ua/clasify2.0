<script setup>
import AnuncioGrid from '../catalog/AnuncioGrid.vue'
import StatePanel from '../states/StatePanel.vue'

defineProps({
  anuncios: { type: Array, default: () => [] },
  categoriasPorId: { type: Object, default: () => ({}) },
  estado: { type: String, default: 'idle' },
  error: { type: Object, default: null }
})
const emit = defineEmits(['retry'])
</script>

<template>
  <section class="perfil-card" aria-labelledby="public-ads-title">
    <h2 id="public-ads-title" class="perfil-section__title">Anuncios publicados</h2>

    <StatePanel v-if="estado === 'loading'" type="loading" message="Cargando anuncios…" />
    <StatePanel
      v-else-if="estado === 'error'"
      type="error"
      title="No se pudieron cargar los anuncios"
      :message="error?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="emit('retry')"
    />
    <StatePanel v-else-if="estado === 'empty'" type="empty" title="Sin anuncios" message="Este usuario no tiene anuncios publicados" />
    <AnuncioGrid
      v-else-if="estado === 'success'"
      :anuncios="anuncios"
      :categorias-por-id="categoriasPorId"
      :nivel-titulo="3"
    />
  </section>
</template>
