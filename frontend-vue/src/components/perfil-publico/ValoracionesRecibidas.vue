<script setup>
import DateText from '../common/DateText.vue'
import StatePanel from '../states/StatePanel.vue'

defineProps({
  valoraciones: { type: Array, default: () => [] },
  estado: { type: String, default: 'idle' },
  error: { type: Object, default: null }
})
const emit = defineEmits(['retry'])
</script>

<template>
  <section class="perfil-card" aria-labelledby="public-ratings-title">
    <h2 id="public-ratings-title" class="perfil-section__title">Valoraciones recibidas</h2>

    <StatePanel v-if="estado === 'loading'" type="loading" message="Cargando valoraciones…" />
    <StatePanel
      v-else-if="estado === 'error'"
      type="error"
      title="No se pudieron cargar las valoraciones"
      :message="error?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="emit('retry')"
    />
    <StatePanel v-else-if="estado === 'empty'" type="empty" title="Sin valoraciones" message="Este usuario todavía no tiene valoraciones" />
    <ul v-else-if="estado === 'success'" class="rating-list">
      <li v-for="valoracion in valoraciones" :key="valoracion.id" class="rating-item">
        <p class="rating-item__score">{{ valoracion.puntuacion }} de 5</p>
        <p class="rating-item__comment">{{ valoracion.comentario || 'Sin comentario' }}</p>
        <p class="rating-item__meta">
          <RouterLink :to="{ name: 'perfil-publico', params: { id: valoracion.autor.id } }">
            {{ valoracion.autor.nombre }}
          </RouterLink>
          · <DateText :value="valoracion.fecha" />
        </p>
      </li>
    </ul>
  </section>
</template>
