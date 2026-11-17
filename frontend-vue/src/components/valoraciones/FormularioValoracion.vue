<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmAction from '../states/ConfirmAction.vue'
import { useValoracionesStore } from '../../stores/valoraciones'
import { esErrorDeSesion } from '../../services/errors'
import { useNotificaciones } from '../../services/notifications'

const props = defineProps({
  usuarioId: {
    type: Number,
    required: true
  },
  valoracion: {
    type: Object,
    default: null
  },
  nombre: {
    type: String,
    default: 'este usuario'
  }
})

const emit = defineEmits(['guardado', 'eliminado'])
const valoraciones = useValoracionesStore()
const router = useRouter()
const route = useRoute()
const notificaciones = useNotificaciones()
const puntuacion = ref(props.valoracion?.puntuacion ?? 0)
const comentario = ref(props.valoracion?.comentario ?? '')
const errores = ref({})
const errorGeneral = ref('')
const confirmando = ref(false)
const selectPuntuacion = ref(null)
const areaComentario = ref(null)

const tieneValoracion = computed(() => Boolean(props.valoracion))

watch(
  () => props.valoracion,
  (valoracion) => {
    puntuacion.value = valoracion?.puntuacion ?? 0
    comentario.value = valoracion?.comentario ?? ''
  }
)

function validar() {
  const nuevos = {}
  if (!Number.isInteger(puntuacion.value) || puntuacion.value < 1 || puntuacion.value > 5) {
    nuevos.puntuacion = 'La puntuación debe ser un entero entre 1 y 5'
  }
  if (comentario.value.length > 500) {
    nuevos.comentario = 'El comentario no puede superar los 500 caracteres'
  }
  return nuevos
}

function enfocarPrimerError() {
  if (errores.value.puntuacion) {
    nextTick(() => selectPuntuacion.value?.focus())
  } else if (errores.value.comentario) {
    nextTick(() => areaComentario.value?.focus())
  }
}

async function enviar() {
  errores.value = validar()
  errorGeneral.value = ''
  if (Object.keys(errores.value).length > 0 || valoraciones.guardando) {
    enfocarPrimerError()
    return
  }

  try {
    await valoraciones.guardar(props.usuarioId, {
      puntuacion: puntuacion.value,
      comentario: comentario.value.trim() || null
    })
    notificaciones.exito('Valoración guardada')
    emit('guardado')
  } catch (fallo) {
    if (fallo.estado === 401 || esErrorDeSesion(fallo.codigo)) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    if (fallo.campo) {
      errores.value = { [fallo.campo]: fallo.mensaje }
      enfocarPrimerError()
    } else {
      errorGeneral.value = fallo.mensaje ?? 'No se pudo guardar la valoración'
    }
  }
}

async function eliminar() {
  if (valoraciones.eliminando) {
    return
  }
  try {
    await valoraciones.eliminar(props.usuarioId)
    notificaciones.exito('Valoración eliminada')
    confirmando.value = false
    emit('eliminado')
  } catch (fallo) {
    if (fallo.estado === 404) {
      notificaciones.exito('Valoración eliminada')
      confirmando.value = false
      emit('eliminado')
      return
    }
    if (fallo.estado === 401 || esErrorDeSesion(fallo.codigo)) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    confirmando.value = false
    errorGeneral.value = fallo.mensaje ?? 'No se pudo eliminar la valoración'
  }
}
</script>

<template>
  <section class="perfil-card" aria-labelledby="rating-form-title">
    <h2 id="rating-form-title" class="perfil-section__title">
      {{ tieneValoracion ? 'Tu valoración' : 'Valorar a ' + nombre }}
    </h2>
    <p v-if="errorGeneral" class="form-error" role="alert">{{ errorGeneral }}</p>

    <form class="perfil-form" novalidate @submit.prevent="enviar">
      <div class="form-field">
        <label for="rating-score">Puntuación</label>
        <select
          id="rating-score"
          ref="selectPuntuacion"
          v-model.number="puntuacion"
          required
          aria-required="true"
          :aria-invalid="Boolean(errores.puntuacion)"
          :aria-describedby="errores.puntuacion ? 'rating-score-error' : undefined"
        >
          <option :value="0">Selecciona una puntuación</option>
          <option v-for="valor in [1, 2, 3, 4, 5]" :key="valor" :value="valor">{{ valor }}</option>
        </select>
        <p v-if="errores.puntuacion" id="rating-score-error" class="form-field__error" role="alert">{{ errores.puntuacion }}</p>
      </div>

      <div class="form-field">
        <label for="rating-comment">Comentario (opcional)</label>
        <textarea
          id="rating-comment"
          ref="areaComentario"
          v-model="comentario"
          rows="4"
          maxlength="500"
          :aria-invalid="Boolean(errores.comentario)"
          :aria-describedby="errores.comentario ? 'rating-comment-error' : 'rating-comment-help'"
        ></textarea>
        <p id="rating-comment-help" class="form-field__help">Máximo 500 caracteres.</p>
        <p v-if="errores.comentario" id="rating-comment-error" class="form-field__error" role="alert">{{ errores.comentario }}</p>
      </div>

      <div class="perfil-form__actions">
        <button class="button" type="submit" :disabled="valoraciones.guardando">
          {{ valoraciones.guardando ? 'Guardando…' : 'Guardar valoración' }}
        </button>
        <button
          v-if="tieneValoracion"
          class="button button--danger"
          type="button"
          :disabled="valoraciones.eliminando"
          @click="confirmando = true"
        >
          Eliminar valoración
        </button>
      </div>
    </form>

    <ConfirmAction
      :open="confirmando"
      title="Eliminar valoración"
      message="¿Quieres eliminar tu valoración?"
      confirm-label="Eliminar"
      cancel-label="Cancelar"
      :loading="valoraciones.eliminando"
      loading-label="Eliminando…"
      @confirm="eliminar"
      @cancel="confirmando = false"
      @close="confirmando = false"
    />
  </section>
</template>
