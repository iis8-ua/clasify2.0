<script setup>
import { computed } from 'vue'
import { useTemaStore } from '../../stores/tema'

const tema = useTemaStore()
const etiqueta = computed(() =>
  tema.esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
)
</script>

<template>
  <button
    type="button"
    class="button button--secondary theme-toggle"
    :aria-label="etiqueta"
    :aria-pressed="tema.esOscuro"
    :title="etiqueta"
    @click="tema.alternar()"
  >
    <span aria-hidden="true">{{ tema.esOscuro ? '☀' : '☾' }}</span>
    <span class="theme-toggle__label">{{ tema.etiqueta }}</span>
  </button>
</template>
