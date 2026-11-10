<script setup>
defineProps({
  estado: {
    type: String,
    required: true
  }
})
</script>

<template>
  <span class="estado-badge" :class="`estado-badge--${estado}`">
    {{ estado === 'vendido' ? 'Vendido' : 'Disponible' }}
  </span>
</template>
