<script setup>
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../../stores/session'

const session = useSessionStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errors = ref({})
const generalError = ref('')
const submitting = ref(false)
const emailInput = ref(null)
const passwordInput = ref(null)

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar() {
  const nuevos = {}
  const correo = email.value.trim()

  if (correo === '') {
    nuevos.email = 'El email es obligatorio'
  } else if (!formatoEmail.test(correo)) {
    nuevos.email = 'El email no tiene un formato válido'
  }

  if (password.value === '') {
    nuevos.password = 'La contraseña es obligatoria'
  }

  return nuevos
}

function enfocarPrimerError() {
  if (errors.value.email) {
    nextTick(() => emailInput.value?.focus())
  } else if (errors.value.password) {
    nextTick(() => passwordInput.value?.focus())
  }
}

async function enviar() {
  errors.value = validar()
  generalError.value = ''

  if (Object.keys(errors.value).length > 0 || submitting.value) {
    enfocarPrimerError()
    return
  }

  submitting.value = true

  try {
    await session.iniciarSesion({
      email: email.value.trim(),
      password: password.value
    })
    password.value = ''

    const destino =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : null

    await router.push(destino ?? { name: 'anuncios' })
  } catch (error) {
    password.value = ''
    if (error.campo) {
      errors.value = { ...errors.value, [error.campo]: error.mensaje }
      enfocarPrimerError()
    } else {
      generalError.value = error.mensaje ?? 'No se pudo iniciar sesión'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="auth-form" novalidate @submit.prevent="enviar">
    <p v-if="session.motivoSesion && !generalError" class="form-error" role="alert">
      {{ session.motivoSesion }}
    </p>
    <p v-if="generalError" class="form-error" role="alert">{{ generalError }}</p>

    <div class="form-field">
      <label for="login-email">Email</label>
      <input
        id="login-email"
        ref="emailInput"
        v-model="email"
        name="email"
        type="email"
        autocomplete="email"
        maxlength="255"
        required
        aria-required="true"
        :aria-invalid="Boolean(errors.email)"
        :aria-describedby="errors.email ? 'login-email-help login-email-error' : 'login-email-help'"
      />
      <p id="login-email-help" class="form-field__help">Obligatorio.</p>
      <p v-if="errors.email" id="login-email-error" class="form-field__error" role="alert">
        {{ errors.email }}
      </p>
    </div>

    <div class="form-field">
      <label for="login-password">Contraseña</label>
      <input
        id="login-password"
        ref="passwordInput"
        v-model="password"
        name="password"
        type="password"
        autocomplete="current-password"
        required
        aria-required="true"
        :aria-invalid="Boolean(errors.password)"
        :aria-describedby="errors.password ? 'login-password-help login-password-error' : 'login-password-help'"
      />
      <p id="login-password-help" class="form-field__help">Obligatoria.</p>
      <p v-if="errors.password" id="login-password-error" class="form-field__error" role="alert">
        {{ errors.password }}
      </p>
    </div>

    <button class="button auth-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? 'Entrando…' : 'Iniciar sesión' }}
    </button>
  </form>
</template>
