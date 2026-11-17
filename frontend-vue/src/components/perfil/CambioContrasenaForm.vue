<script setup>
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { esErrorDeContrasenaActual, esErrorDeSesion } from '../../services/errors'
import { useNotificaciones } from '../../services/notifications'
import { usePerfilStore } from '../../stores/perfil'

const perfil = usePerfilStore()
const router = useRouter()
const route = useRoute()
const notificaciones = useNotificaciones()

const passwordActual = ref('')
const passwordNueva = ref('')
const errores = ref({})
const errorGeneral = ref('')
const enviando = ref(false)
const actualInput = ref(null)
const nuevaInput = ref(null)

function validar() {
  const nuevos = {}

  if (passwordActual.value === '') {
    nuevos.passwordActual = 'La contraseña actual es obligatoria'
  }

  if (passwordNueva.value.length < 8) {
    nuevos.passwordNueva = 'La contraseña nueva debe tener al menos 8 caracteres'
  }

  return nuevos
}

function enfocarPrimerError() {
  if (errores.value.passwordActual) {
    nextTick(() => actualInput.value?.focus())
  } else if (errores.value.passwordNueva) {
    nextTick(() => nuevaInput.value?.focus())
  }
}

async function enviar() {
  errores.value = validar()
  errorGeneral.value = ''

  if (Object.keys(errores.value).length > 0 || enviando.value) {
    enfocarPrimerError()
    return
  }

  enviando.value = true

  try {
    await perfil.cambiarContrasena({
      passwordActual: passwordActual.value,
      passwordNueva: passwordNueva.value
    })
    passwordActual.value = ''
    passwordNueva.value = ''
    errores.value = {}
    notificaciones.exito('Contraseña actualizada')
  } catch (error) {
    if (esErrorDeContrasenaActual(error)) {
      errores.value = {
        passwordActual: error.mensaje ?? 'La contraseña actual no es correcta'
      }
      enfocarPrimerError()
      return
    }

    if (error.estado === 401 || esErrorDeSesion(error.codigo)) {
      await router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }

    if (error.campo === 'password') {
      errores.value = { passwordNueva: error.mensaje }
    } else if (error.campo === 'password_actual') {
      errores.value = { passwordActual: error.mensaje }
    } else {
      errorGeneral.value = error.mensaje ?? 'No se pudo cambiar la contraseña'
    }
    enfocarPrimerError()
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="perfil-card" aria-labelledby="perfil-password-title">
    <h2 id="perfil-password-title" class="perfil-section__title">Cambiar contraseña</h2>
    <form class="perfil-form" novalidate @submit.prevent="enviar">
      <p v-if="errorGeneral" class="form-error" role="alert">{{ errorGeneral }}</p>

      <div class="form-field">
        <label for="perfil-password-actual">Contraseña actual</label>
        <input
          id="perfil-password-actual"
          ref="actualInput"
          v-model="passwordActual"
          name="password_actual"
          type="password"
          autocomplete="current-password"
          required
          aria-required="true"
          :aria-invalid="Boolean(errores.passwordActual)"
          :aria-describedby="errores.passwordActual ? 'perfil-password-actual-error' : 'perfil-password-actual-help'"
        />
        <p id="perfil-password-actual-help" class="form-field__help">Obligatoria.</p>
        <p
          v-if="errores.passwordActual"
          id="perfil-password-actual-error"
          class="form-field__error"
          role="alert"
        >
          {{ errores.passwordActual }}
        </p>
      </div>

      <div class="form-field">
        <label for="perfil-password-nueva">Contraseña nueva</label>
        <input
          id="perfil-password-nueva"
          ref="nuevaInput"
          v-model="passwordNueva"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          aria-required="true"
          :aria-invalid="Boolean(errores.passwordNueva)"
          :aria-describedby="errores.passwordNueva ? 'perfil-password-nueva-error' : 'perfil-password-nueva-help'"
        />
        <p id="perfil-password-nueva-help" class="form-field__help">
          Obligatoria. Mínimo 8 caracteres.
        </p>
        <p
          v-if="errores.passwordNueva"
          id="perfil-password-nueva-error"
          class="form-field__error"
          role="alert"
        >
          {{ errores.passwordNueva }}
        </p>
      </div>

      <div class="perfil-form__actions">
        <button class="button" type="submit" :disabled="enviando">
          {{ enviando ? 'Cambiando…' : 'Cambiar contraseña' }}
        </button>
      </div>
    </form>
  </section>
</template>
