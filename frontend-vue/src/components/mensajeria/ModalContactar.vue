<script setup>
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMensajesStore } from '../../stores/mensajes'
import { esErrorDeSesion } from '../../services/errors'
import { useNotificaciones } from '../../services/notifications'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'enviado'])
const mensajes = useMensajesStore()
const router = useRouter()
const route = useRoute()
const notificaciones = useNotificaciones()
const texto = ref('')
const error = ref('')
const enviando = ref(false)
const areaTexto = ref(null)

watch(
  () => props.open,
  async (abierto) => {
    if (!abierto) {
      return
    }
    error.value = ''
    await nextTick()
    areaTexto.value?.focus()
  }
)

function cerrar() {
  if (!enviando.value) {
    emit('close')
  }
}

function validar() {
  const limpio = texto.value.trim()
  if (limpio === '') {
    return 'El mensaje es obligatorio'
  }
  if (limpio.length > 1000) {
    return 'El mensaje no puede superar los 1000 caracteres'
  }
  return ''
}

async function enviar() {
  if (enviando.value) {
    return
  }

  error.value = validar()
  if (error.value) {
    return
  }

  enviando.value = true
  try {
    const { conversacion } = await mensajes.iniciar(props.anuncio.id, texto.value.trim())
    texto.value = ''
    notificaciones.exito('Mensaje enviado')
    emit('enviado', conversacion.id)
    emit('close')
  } catch (fallo) {
    if (fallo.estado === 401 || esErrorDeSesion(fallo.codigo)) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    error.value = fallo.mensaje ?? 'No se pudo enviar el mensaje'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div v-if="open" class="confirm-overlay" @click.self="cerrar" @keydown.esc="cerrar">
    <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <h2 id="contact-title" class="confirm-dialog__title">Contactar con el vendedor</h2>
      <p class="confirm-dialog__message">Escribe el primer mensaje sobre «{{ anuncio.titulo }}».</p>

      <form class="contact-form" novalidate @submit.prevent="enviar">
        <div class="form-field">
          <label for="contact-message">Mensaje</label>
          <textarea
            id="contact-message"
            ref="areaTexto"
            v-model="texto"
            rows="4"
            maxlength="1000"
            required
            aria-required="true"
            :aria-invalid="Boolean(error)"
            :aria-describedby="error ? 'contact-message-error' : undefined"
          ></textarea>
          <p v-if="error" id="contact-message-error" class="form-field__error" role="alert">
            {{ error }}
          </p>
        </div>

        <div class="confirm-dialog__actions">
          <button type="button" class="button button--secondary" :disabled="enviando" @click="cerrar">
            Cancelar
          </button>
          <button type="submit" class="button" :disabled="enviando">
            {{ enviando ? 'Enviando…' : 'Enviar mensaje' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
