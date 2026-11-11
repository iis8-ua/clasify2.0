<script setup>
import StatePanel from '../states/StatePanel.vue'
import ValoracionItem from './ValoracionItem.vue'

defineProps({
  items: { type: Array, default: () => [] },
  estado: { type: String, default: 'idle' },
  error: { type: Object, default: null },
  modo: { type: String, default: 'recibida' },
  titulo: { type: String, required: true }
})
const emit = defineEmits(['retry', 'editar', 'eliminar'])
</script>

<template>
  <section class="perfil-card" aria-labelledby="ratings-list-title">
    <h2 id="ratings-list-title" class="perfil-section__title">{{ titulo }}</h2>

    <StatePanel v-if="estado === 'loading'" type="loading" message="Cargando valoraciones…" />
    <StatePanel
      v-else-if="estado === 'error'"
      type="error"
      title="No se pudieron cargar las valoraciones"
      :message="error?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="emit('retry')"
    />
    <StatePanel v-else-if="estado === 'empty'" type="empty" title="Sin valoraciones" message="No hay valoraciones que mostrar" />
    <ul v-else-if="estado === 'success'" class="rating-list">
      <ValoracionItem
        v-for="valoracion in items"
        :key="valoracion.id"
        :valoracion="valoracion"
        :modo="modo"
      />
    </ul>
    <div v-if="modo === 'escrita' && estado === 'success'" class="rating-actions">
      <button
        v-for="valoracion in items"
        :key="`editar-${valoracion.id}`"
        type="button"
        class="button button--secondary"
        @click="emit('editar', valoracion)"
      >
        Editar {{ valoracion.para?.nombre }}
      </button>
      <button
        v-for="valoracion in items"
        :key="`eliminar-${valoracion.id}`"
        type="button"
        class="button button--danger"
        @click="emit('eliminar', valoracion)"
      >
        Eliminar {{ valoracion.para?.nombre }}
      </button>
    </div>
  </section>
</template>
