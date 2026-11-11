<script setup>
import { computed } from 'vue'
import DateText from '../common/DateText.vue'

const props = defineProps({
  valoracion: {
    type: Object,
    required: true
  },
  modo: {
    type: String,
    default: 'recibida',
    validator: (value) => ['recibida', 'escrita'].includes(value)
  }
})

const persona = computed(() =>
  props.modo === 'recibida' ? props.valoracion.autor : props.valoracion.para
)
</script>

<template>
  <li class="rating-item">
    <p class="rating-item__score">{{ valoracion.puntuacion }} de 5</p>
    <p class="rating-item__comment">{{ valoracion.comentario || 'Sin comentario' }}</p>
    <p class="rating-item__meta">
      <RouterLink
        v-if="persona"
        :to="{ name: 'perfil-publico', params: { id: persona.id } }"
      >
        {{ persona.nombre }}
      </RouterLink>
      · <DateText :value="valoracion.fecha" />
    </p>
  </li>
</template>
