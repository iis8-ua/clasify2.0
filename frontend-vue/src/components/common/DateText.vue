<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Date, Number],
    default: null
  }
})

const formateado = computed(() => {
  if (props.value === null || props.value === '') {
    return '—'
  }
  const fecha = new Date(props.value)
  if (Number.isNaN(fecha.getTime())) {
    return '—'
  }
  return new Intl.DateTimeFormat('es-ES').format(fecha)
})
</script>

<template>
  <span class="date">{{ formateado }}</span>
</template>
