<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../../stores/session'

const session = useSessionStore()
const router = useRouter()

const email = ref('')
const nombre = ref('')
const password = ref('')
const errors = ref({})
const generalError = ref('')
const submitting = ref(false)

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validar() {
  const nuevos = {}
  const correo = email.value.trim()
  const nombreLimpio = nombre.value.trim()

  if (correo === '') {
    nuevos.email = 'El email es obligatorio'
  } else if (!formatoEmail.test(correo)) {
    nuevos.email = 'El email no tiene un formato válido'
  } else if (correo.length > 255) {
    nuevos.email = 'El email no puede superar los 255 caracteres'
  }

  if (nombreLimpio === '') {
    nuevos.nombre = 'El nombre es obligatorio'
  } else if (nombreLimpio.length > 100) {
    nuevos.nombre = 'El nombre no puede superar los 100 caracteres'
  }

  if (password.value.length < 8) {
    nuevos.password = 'La contraseña debe tener al menos 8 caracteres'
  }

  return nuevos
}

async function enviar() {
  errors.value = validar()
  generalError.value = ''

  if (Object.keys(errors.value).length > 0 || submitting.value) {
    return
  }

  submitting.value = true

  try {
    await session.registrar({
      email: email.value.trim(),
      nombre: nombre.value.trim(),
      password: password.value
    })
    password.value = ''
    await router.push({ name: 'anuncios' })
  } catch (error) {
    password.value = ''
    if (error.campo) {
      errors.value = { ...errors.value, [error.campo]: error.mensaje }
    } else {
      generalError.value = error.mensaje ?? 'No se pudo crear la cuenta'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="auth-form" novalidate @submit.prevent="enviar">
    <p v-if="generalError" class="form-error" role="alert">{{ generalError }}</p>

    <div class="form-field">
      <label for="register-email">Email</label>
      <input
        id="register-email"
        v-model="email"
        name="email"
        type="email"
        autocomplete="email"
        maxlength="255"
        :aria-invalid="Boolean(errors.email)"
        :aria-describedby="errors.email ? 'register-email-error' : undefined"
      />
      <p v-if="errors.email" id="register-email-error" class="form-field__error">
        {{ errors.email }}
      </p>
    </div>

    <div class="form-field">
      <label for="register-name">Nombre</label>
      <input
        id="register-name"
        v-model="nombre"
        name="nombre"
        type="text"
        autocomplete="name"
        maxlength="100"
        :aria-invalid="Boolean(errors.nombre)"
        :aria-describedby="errors.nombre ? 'register-name-error' : undefined"
      />
      <p v-if="errors.nombre" id="register-name-error" class="form-field__error">
        {{ errors.nombre }}
      </p>
    </div>

    <div class="form-field">
      <label for="register-password">Contraseña</label>
      <input
        id="register-password"
        v-model="password"
        name="password"
        type="password"
        autocomplete="new-password"
        :aria-invalid="Boolean(errors.password)"
        :aria-describedby="errors.password ? 'register-password-error' : undefined"
      />
      <p v-if="errors.password" id="register-password-error" class="form-field__error">
        {{ errors.password }}
      </p>
    </div>

    <button class="button auth-form__submit" type="submit" :disabled="submitting">
      {{ submitting ? 'Creando cuenta…' : 'Crear cuenta' }}
    </button>
  </form>
</template>
