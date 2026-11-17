<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'loading',
    validator: (value) => ['loading', 'empty', 'error', 'validation', 'permission', 'success'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  retryable: {
    type: Boolean,
    default: false
  },
  actionLabel: {
    type: String,
    default: ''
  },
  fieldErrors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['retry', 'action'])
const rol = computed(() => (props.type === 'error' || props.type === 'permission' ? 'alert' : 'status'))
const errores = computed(() => Object.entries(props.fieldErrors ?? {}))
</script>

<template>
  <section class="state-panel" :class="`state-panel--${type}`" :role="rol" aria-live="polite">
    <h2 v-if="title" class="state-panel__title">{{ title }}</h2>
    <p class="state-panel__message">{{ message }}</p>
    <ul v-if="errores.length > 0" class="state-panel__errors">
      <li v-for="[campo, mensaje] in errores" :key="campo">
        <strong>{{ campo }}:</strong> {{ mensaje }}
      </li>
    </ul>
    <div v-if="retryable || actionLabel" class="state-panel__actions">
      <button v-if="retryable" type="button" class="button" @click="emit('retry')">
        Reintentar
      </button>
      <button v-if="actionLabel" type="button" class="button button--secondary" @click="emit('action')">
        {{ actionLabel }}
      </button>
    </div>
  </section>
</template>
