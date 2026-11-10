<script setup>
defineProps({
  pagina: {
    type: Number,
    required: true
  },
  paginas: {
    type: Number,
    required: true
  },
  ariaLabel: {
    type: String,
    default: 'Paginación de anuncios'
  }
})

const emit = defineEmits(['cambiar'])
</script>

<template>
  <nav class="catalog-pagination" :aria-label="ariaLabel">
    <button
      class="button button--secondary"
      type="button"
      :disabled="pagina <= 1"
      @click="emit('cambiar', 1)"
    >
      Primera
    </button>
    <button
      class="button button--secondary"
      type="button"
      :disabled="pagina <= 1"
      @click="emit('cambiar', pagina - 1)"
    >
      Anterior
    </button>
    <span class="catalog-pagination__status">
      Página {{ pagina }} de {{ Math.max(paginas, 1) }}
    </span>
    <button
      class="button button--secondary"
      type="button"
      :disabled="pagina >= paginas"
      @click="emit('cambiar', pagina + 1)"
    >
      Siguiente
    </button>
    <button
      class="button button--secondary"
      type="button"
      :disabled="pagina >= paginas"
      @click="emit('cambiar', paginas)"
    >
      Última
    </button>
  </nav>
</template>
