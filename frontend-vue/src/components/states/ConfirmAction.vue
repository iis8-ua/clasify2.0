<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmar acción'
  },
  message: {
    type: String,
    required: true
  },
  confirmLabel: {
    type: String,
    default: 'Confirmar'
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingLabel: {
    type: String,
    default: 'Procesando…'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])
const cancelarBoton = ref(null)
const origenFoco = ref(null)

function restaurarFoco() {
  const elemento = origenFoco.value
  origenFoco.value = null
  if (elemento && typeof elemento.focus === 'function') {
    elemento.focus()
  }
}

function cancelar() {
  if (props.loading) {
    return
  }
  emit('cancel')
  emit('close')
}

function confirmar() {
  if (props.loading) {
    return
  }
  emit('confirm')
}

function alPulsarTecla(event) {
  if (event.key === 'Escape') {
    cancelar()
  }
}

watch(
  () => props.open,
  async (abierto) => {
    if (abierto) {
      origenFoco.value = document.activeElement
      await nextTick()
      cancelarBoton.value?.focus()
    } else {
      restaurarFoco()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-if="open"
    class="confirm-overlay"
    @click.self="cancelar"
    @keydown="alPulsarTecla"
  >
    <div
      class="confirm-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      :aria-busy="loading"
    >
      <h2 id="confirm-title" class="confirm-dialog__title">{{ title }}</h2>
      <p class="confirm-dialog__message">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button
          ref="cancelarBoton"
          type="button"
          class="button button--secondary"
          :disabled="loading"
          @click="cancelar"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="button button--danger"
          :disabled="loading"
          @click="confirmar"
        >
          {{ loading ? loadingLabel : confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
