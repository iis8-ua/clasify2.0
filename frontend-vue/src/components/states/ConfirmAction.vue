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
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])
const cancelarBoton = ref(null)

function cancelar() {
  emit('cancel')
  emit('close')
}

function confirmar() {
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
      await nextTick()
      cancelarBoton.value?.focus()
    }
  }
)
</script>

<template>
  <div
    v-if="open"
    class="confirm-overlay"
    @click.self="cancelar"
    @keydown="alPulsarTecla"
  >
    <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <h2 id="confirm-title" class="confirm-dialog__title">{{ title }}</h2>
      <p class="confirm-dialog__message">{{ message }}</p>
      <div class="confirm-dialog__actions">
        <button ref="cancelarBoton" type="button" class="button button--secondary" @click="cancelar">
          {{ cancelLabel }}
        </button>
        <button type="button" class="button button--danger" @click="confirmar">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
