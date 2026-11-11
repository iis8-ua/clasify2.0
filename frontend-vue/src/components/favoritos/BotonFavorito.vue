<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../../stores/session'
import { useFavoritosStore } from '../../stores/favoritos'
import { esErrorDeSesion } from '../../services/errors'
import { useNotificaciones } from '../../services/notifications'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cambio'])
const session = useSessionStore()
const favoritos = useFavoritosStore()
const router = useRouter()
const route = useRoute()
const notificaciones = useNotificaciones()
const error = ref('')
const enCurso = ref(false)

const esAutor = computed(
  () => session.usuario?.id === (props.anuncio.id_autor ?? props.anuncio.autor?.id)
)
const guardado = computed(() => Boolean(props.anuncio.es_favorito))
const procesando = computed(() => favoritos.estaProcesando(props.anuncio.id))
const enProceso = computed(() => procesando.value || enCurso.value)
const etiqueta = computed(() => (guardado.value ? 'Quitar de favoritos' : 'Añadir a favoritos'))
const textoAccion = computed(() => {
  if (!enProceso.value) {
    return etiqueta.value
  }
  return guardado.value ? 'Quitando…' : 'Añadiendo…'
})

async function alternar() {
  if (enCurso.value) {
    return
  }

  error.value = ''

  if (!session.estaAutenticado) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  enCurso.value = true

  try {
    if (guardado.value) {
      await favoritos.quitar(props.anuncio.id)
      emit('cambio', {
        esFavorito: false,
        numFavoritos: Math.max(0, props.anuncio.num_favoritos - 1)
      })
      notificaciones.exito('Anuncio quitado de favoritos')
    } else {
      const { nuevo } = await favoritos.anadir(props.anuncio.id)
      emit('cambio', {
        esFavorito: true,
        numFavoritos: props.anuncio.num_favoritos + (nuevo ? 1 : 0)
      })
      notificaciones.exito('Anuncio guardado en favoritos')
    }
  } catch (fallo) {
    if (guardado.value && fallo.estado === 404) {
      emit('cambio', {
        esFavorito: false,
        numFavoritos: Math.max(0, props.anuncio.num_favoritos - 1)
      })
      notificaciones.exito('Anuncio quitado de favoritos')
      return
    }

    if (fallo.estado === 401 || esErrorDeSesion(fallo.codigo)) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }

    error.value = fallo.mensaje ?? 'No se pudo actualizar el favorito'
  } finally {
    enCurso.value = false
  }
}
</script>

<template>
  <div v-if="!esAutor" class="favorito-control">
    <button
      class="button button--secondary"
      type="button"
      :aria-pressed="guardado"
      :aria-label="etiqueta"
      :aria-busy="enProceso"
      :disabled="enProceso"
      @click="alternar"
    >
      <span aria-hidden="true">{{ guardado ? '★' : '☆' }}</span>
      {{ textoAccion }}
    </button>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
  </div>
</template>
