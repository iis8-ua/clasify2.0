<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmAction from '../states/ConfirmAction.vue'
import { useSessionStore } from '../../stores/session'
import { useAnunciosStore } from '../../stores/anuncios'
import { useNotificaciones } from '../../services/notifications'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  }
})

const session = useSessionStore()
const anuncios = useAnunciosStore()
const router = useRouter()
const notificaciones = useNotificaciones()

const confirmacion = ref(null)
const enCurso = ref(false)
const error = ref('')

const esAutor = computed(() => session.usuario?.id === props.anuncio.id_autor)
const tituloConfirmacion = computed(() =>
  confirmacion.value?.tipo === 'eliminar' ? 'Eliminar anuncio' : 'Marcar como vendido'
)
const mensajeConfirmacion = computed(() =>
  confirmacion.value?.tipo === 'eliminar'
    ? `¿Seguro que quieres eliminar "${props.anuncio.titulo}"? Esta acción es definitiva.`
    : `"${props.anuncio.titulo}" dejará de aparecer en el listado público por defecto.`
)
const etiquetaConfirmacion = computed(() =>
  confirmacion.value?.tipo === 'eliminar' ? 'Eliminar' : 'Marcar vendido'
)

function editar() {
  router.push({ name: 'anuncio-editar', params: { id: props.anuncio.id } })
}

function abrirConfirmacion(tipo) {
  error.value = ''
  confirmacion.value = { tipo }
}

function cancelar() {
  if (!enCurso.value) {
    confirmacion.value = null
  }
}

async function confirmar() {
  if (!confirmacion.value || enCurso.value) {
    return
  }

  const tipo = confirmacion.value.tipo
  enCurso.value = true
  error.value = ''

  try {
    if (tipo === 'eliminar') {
      await anuncios.eliminar(props.anuncio.id)
      notificaciones.exito('Anuncio eliminado')
      confirmacion.value = null
      await router.push({ name: 'anuncios' })
    } else {
      await anuncios.cambiarEstado(props.anuncio.id, 'vendido')
      notificaciones.exito('Anuncio marcado como vendido')
      confirmacion.value = null
    }
  } catch (fallo) {
    error.value = fallo.mensaje ?? 'No se pudo completar la operación'
    confirmacion.value = null
  } finally {
    enCurso.value = false
  }
}

async function marcarDisponible() {
  if (enCurso.value) {
    return
  }

  enCurso.value = true
  error.value = ''

  try {
    await anuncios.cambiarEstado(props.anuncio.id, 'disponible')
    notificaciones.exito('Anuncio marcado como disponible')
  } catch (fallo) {
    error.value = fallo.mensaje ?? 'No se pudo completar la operación'
  } finally {
    enCurso.value = false
  }
}
</script>

<template>
  <section v-if="esAutor" class="anuncio-actions" aria-labelledby="actions-title">
    <h2 id="actions-title" class="anuncio-detalle__section-title">Gestionar anuncio</h2>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <div class="anuncio-actions__buttons">
      <button class="button button--secondary" type="button" :disabled="enCurso" @click="editar">
        Editar
      </button>
      <button
        v-if="anuncio.estado === 'disponible'"
        class="button button--secondary"
        type="button"
        :disabled="enCurso"
        @click="abrirConfirmacion('vender')"
      >
        Marcar como vendido
      </button>
      <button
        v-else
        class="button button--secondary"
        type="button"
        :disabled="enCurso"
        @click="marcarDisponible"
      >
        Volver a disponible
      </button>
      <button class="button button--danger" type="button" :disabled="enCurso" @click="abrirConfirmacion('eliminar')">
        Eliminar
      </button>
    </div>

    <ConfirmAction
      :open="Boolean(confirmacion)"
      :title="tituloConfirmacion"
      :message="mensajeConfirmacion"
      :confirm-label="etiquetaConfirmacion"
      cancel-label="Cancelar"
      @confirm="confirmar"
      @cancel="cancelar"
      @close="cancelar"
    />
  </section>
</template>
