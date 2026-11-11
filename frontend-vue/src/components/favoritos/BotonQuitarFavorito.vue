<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmAction from '../states/ConfirmAction.vue'
import { useFavoritosStore } from '../../stores/favoritos'
import { esErrorDeSesion } from '../../services/errors'
import { useNotificaciones } from '../../services/notifications'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['quitar'])
const favoritos = useFavoritosStore()
const router = useRouter()
const route = useRoute()
const notificaciones = useNotificaciones()
const confirmando = ref(false)
const procesando = ref(false)
const error = ref('')

function abrir() {
  error.value = ''
  confirmando.value = true
}

function cancelar() {
  if (!procesando.value) {
    confirmando.value = false
  }
}

async function confirmar() {
  if (procesando.value) {
    return
  }

  procesando.value = true
  error.value = ''

  try {
    await favoritos.quitar(props.anuncio.id)
    notificaciones.exito('Anuncio quitado de favoritos')
    confirmando.value = false
    emit('quitar', props.anuncio.id)
  } catch (fallo) {
    if (fallo.estado === 404) {
      notificaciones.exito('Anuncio quitado de favoritos')
      confirmando.value = false
      emit('quitar', props.anuncio.id)
      return
    }
    if (fallo.estado === 401 || esErrorDeSesion(fallo.codigo)) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    error.value = fallo.mensaje ?? 'No se pudo quitar el favorito'
  } finally {
    procesando.value = false
  }
}
</script>

<template>
  <div class="favorite-remove">
    <button
      type="button"
      class="button button--secondary"
      :aria-label="`Quitar ${anuncio.titulo} de favoritos`"
      :disabled="procesando"
      @click="abrir"
    >
      Quitar
    </button>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>

    <ConfirmAction
      :open="confirmando"
      title="Quitar de favoritos"
      :message="`¿Quieres quitar «${anuncio.titulo}» de tus favoritos?`"
      confirm-label="Quitar"
      cancel-label="Cancelar"
      :loading="procesando"
      loading-label="Quitando…"
      @confirm="confirmar"
      @cancel="cancelar"
      @close="cancelar"
    />
  </div>
</template>
