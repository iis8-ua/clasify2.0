<script setup>
import { nextTick, ref } from 'vue'
import { useMensajesStore } from '../../stores/mensajes'
import { esErrorDeSesion } from '../../services/errors'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  conversacionId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['enviado'])
const mensajes = useMensajesStore()
const router = useRouter()
const route = useRoute()
const texto = ref('')
const error = ref('')
const areaTexto = ref(null)
const enviando = ref(false)

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
    await nextTick()
    areaTexto.value?.focus()
    return
  }

  enviando.value = true
  try {
    const mensaje = await mensajes.enviar(props.conversacionId, texto.value.trim())
    texto.value = ''
    emit('enviado', mensaje)
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
  <form class="message-form" novalidate @submit.prevent="enviar">
    <div class="form-field">
      <label for="message-text">Mensaje</label>
      <textarea
        id="message-text"
        ref="areaTexto"
        v-model="texto"
        rows="3"
        maxlength="1000"
        required
        aria-required="true"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? 'message-text-error' : undefined"
      ></textarea>
      <p v-if="error" id="message-text-error" class="form-field__error" role="alert">{{ error }}</p>
    </div>
    <button class="button" type="submit" :disabled="enviando">
      {{ enviando ? 'Enviando…' : 'Enviar' }}
    </button>
  </form>
</template>
