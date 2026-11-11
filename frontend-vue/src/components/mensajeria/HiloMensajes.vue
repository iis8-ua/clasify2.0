<script setup>
import DateText from '../common/DateText.vue'
import { useSessionStore } from '../../stores/session'

defineProps({
  mensajes: {
    type: Array,
    default: () => []
  }
})

const session = useSessionStore()
</script>

<template>
  <div class="message-thread" role="list" aria-label="Mensajes de la conversación">
    <article
      v-for="mensaje in mensajes"
      :key="mensaje.id"
      class="message-thread__item"
      :class="{ 'message-thread__item--own': mensaje.id_emisor === session.usuario?.id }"
      role="listitem"
    >
      <p class="message-thread__text">{{ mensaje.texto }}</p>
      <p class="message-thread__meta">
        <span>{{ mensaje.id_emisor === session.usuario?.id ? 'Tú' : 'Interlocutor' }}</span>
        <DateText :value="mensaje.fecha" />
      </p>
    </article>
  </div>
</template>
