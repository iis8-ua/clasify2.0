<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificaciones } from '../../services/notifications'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const notificaciones = useNotificaciones()
const error = ref('')

const url = computed(() => {
  const destino = router.resolve({
    name: 'anuncio-detalle',
    params: { id: props.anuncio.id }
  }).href
  return new URL(destino, window.location.origin).toString()
})

async function copiarEnlace() {
  try {
    await navigator.clipboard.writeText(url.value)
    notificaciones.exito('Enlace copiado')
  } catch {
    error.value = 'No se pudo copiar el enlace'
  }
}

async function compartir() {
  error.value = ''
  const datos = {
    title: props.anuncio.titulo,
    text: props.anuncio.titulo,
    url: url.value
  }

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share(datos)
      return
    } catch (fallo) {
      if (fallo?.name === 'AbortError') {
        return
      }
    }
  }

  await copiarEnlace()
}
</script>

<template>
  <div class="share-control">
    <button type="button" class="button button--secondary" @click="compartir">
      Compartir anuncio
    </button>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
  </div>
</template>
