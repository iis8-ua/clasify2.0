<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { urlImagen } from '../../services/media'

const props = defineProps({
  file: {
    type: Object,
    default: null
  },
  imagenActual: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:file', 'error'])
const input = ref(null)
const preview = ref(null)
const urlActual = computed(() => urlImagen(props.imagenActual))
const urlVisible = computed(() => preview.value ?? urlActual.value)

function revocarPreview() {
  if (preview.value) {
    URL.revokeObjectURL(preview.value)
    preview.value = null
  }
}

watch(
  () => props.file,
  (file) => {
    revocarPreview()
    if (file && typeof URL.createObjectURL === 'function') {
      preview.value = URL.createObjectURL(file)
    }
  }
)

onBeforeUnmount(revocarPreview)

function seleccionar(event) {
  const file = event.target.files?.[0]
  emit('error', '')

  if (!file) {
    emit('update:file', null)
    return
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    emit('error', 'La imagen debe estar en formato JPEG, PNG o WebP')
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    emit('error', 'La imagen no puede superar los 5 MB')
    event.target.value = ''
    return
  }

  emit('update:file', file)
}

function quitarSeleccion() {
  emit('update:file', null)
  if (input.value) {
    input.value.value = ''
  }
}
</script>

<template>
  <div class="form-field">
    <label for="anuncio-imagen">Imagen</label>
    <input
      id="anuncio-imagen"
      ref="input"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? 'anuncio-imagen-error' : 'anuncio-imagen-help'"
      @change="seleccionar"
    />
    <p id="anuncio-imagen-help" class="form-field__help">
      JPEG, PNG o WebP. Máximo 5 MB. La imagen es opcional.
    </p>
    <p v-if="error" id="anuncio-imagen-error" class="form-field__error" role="alert">{{ error }}</p>

    <div v-if="urlVisible" class="campo-imagen__preview">
      <img :src="urlVisible" alt="Previsualización de la imagen del anuncio" />
    </div>

    <button
      v-if="file"
      class="button button--secondary"
      type="button"
      @click="quitarSeleccion"
    >
      Quitar selección
    </button>
  </div>
</template>
