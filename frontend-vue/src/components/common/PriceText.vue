<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number],
    default: null
  }
})

const formateado = computed(() => {
  if (props.value === null || props.value === '') {
    return '—'
  }
  const numero = Number(props.value)
  if (!Number.isFinite(numero)) {
    return '—'
  }
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(numero)
})
</script>

<template>
  <span class="price">{{ formateado }}</span>
</template>
