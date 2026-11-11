<script setup>
import DateText from '../common/DateText.vue'

defineProps({
  detalle: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <section
    v-if="detalle.conversacion && detalle.ultimos_mensajes?.length"
    class="last-messages"
    aria-labelledby="last-messages-title"
  >
    <h2 id="last-messages-title" class="anuncio-detalle__section-title">Últimos mensajes</h2>
    <ul class="last-messages__list">
      <li v-for="mensaje in detalle.ultimos_mensajes" :key="mensaje.id" class="last-messages__item">
        <span>{{ mensaje.texto }}</span>
        <DateText :value="mensaje.fecha" />
      </li>
    </ul>
    <RouterLink
      class="button button--secondary"
      :to="{ name: 'conversacion', params: { id: detalle.conversacion.id } }"
    >
      Ver conversación completa ({{ detalle.num_mensajes ?? detalle.ultimos_mensajes.length }})
    </RouterLink>
  </section>
</template>
