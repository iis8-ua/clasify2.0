<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: ''
  },
  loading: {
    type: String,
    default: 'lazy'
  }
})

const fallo = ref(false)
const mostrarImagen = computed(() => Boolean(props.src) && !fallo.value)

watch(
  () => props.src,
  () => {
    fallo.value = false
  }
)
</script>

<template>
  <img
    v-if="mostrarImagen"
    :src="src"
    :alt="alt"
    :loading="loading"
    @error="fallo = true"
  />
  <div
    v-else
    class="image-fallback"
    role="img"
    :aria-label="alt || 'Imagen no disponible'"
  >
    <span class="image-fallback__icon" aria-hidden="true">◌</span>
    <span>{{ alt || 'Imagen no disponible' }}</span>
  </div>
</template>
