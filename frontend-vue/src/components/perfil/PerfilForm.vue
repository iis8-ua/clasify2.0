<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  perfil: {
    type: Object,
    required: true
  },
  guardando: {
    type: Boolean,
    default: false
  },
  erroresServidor: {
    type: Object,
    default: () => ({})
  },
  errorGeneral: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'dirty-change', 'discard'])
const valores = ref({
  nombre: props.perfil.nombre ?? '',
  biografia: props.perfil.biografia ?? ''
})
const errores = ref({})
const nombreInput = ref(null)
const biografiaInput = ref(null)

const original = computed(() => ({
  nombre: props.perfil.nombre ?? '',
  biografia: props.perfil.biografia ?? ''
}))
const erroresVisibles = computed(() => ({ ...errores.value, ...props.erroresServidor }))
const cambios = computed(() => {
  const resultado = {}
  const nombre = valores.value.nombre.trim()
  const biografia = valores.value.biografia.trim()

  if (nombre !== original.value.nombre) {
    resultado.nombre = nombre
  }
  if (biografia !== original.value.biografia) {
    resultado.biografia = biografia
  }
  return resultado
})
const sinCambios = computed(() => Object.keys(cambios.value).length === 0)

watch(sinCambios, (valor) => emit('dirty-change', !valor))

watch(
  () => props.erroresServidor,
  (errores) => {
    if (errores?.nombre) {
      nextTick(() => nombreInput.value?.focus())
    } else if (errores?.biografia) {
      nextTick(() => biografiaInput.value?.focus())
    }
  },
  { deep: true }
)

watch(
  () => [props.perfil.nombre, props.perfil.biografia],
  () => {
    if (sinCambios.value) {
      valores.value = {
        nombre: props.perfil.nombre ?? '',
        biografia: props.perfil.biografia ?? ''
      }
    }
  }
)

function validar() {
  const nuevos = {}
  const nombre = valores.value.nombre.trim()
  const biografia = valores.value.biografia.trim()

  if (nombre === '') {
    nuevos.nombre = 'El nombre es obligatorio'
  } else if (nombre.length > 100) {
    nuevos.nombre = 'El nombre no puede superar los 100 caracteres'
  }

  if (biografia.length > 500) {
    nuevos.biografia = 'La biografía no puede superar los 500 caracteres'
  }

  return nuevos
}

function enviar() {
  errores.value = validar()

  if (Object.keys(errores.value).length > 0 || props.guardando || sinCambios.value) {
    if (errores.value.nombre) {
      nextTick(() => nombreInput.value?.focus())
    } else if (errores.value.biografia) {
      nextTick(() => biografiaInput.value?.focus())
    }
    return
  }

  emit('submit', cambios.value)
}

function descartar() {
  valores.value = {
    nombre: original.value.nombre,
    biografia: original.value.biografia
  }
  errores.value = {}
  emit('discard')
}
</script>

<template>
  <section class="perfil-card" aria-labelledby="perfil-edicion-title">
    <h2 id="perfil-edicion-title" class="perfil-section__title">Editar datos</h2>
    <form class="perfil-form" novalidate @submit.prevent="enviar">
      <p v-if="errorGeneral" class="form-error" role="alert">{{ errorGeneral }}</p>

      <div class="form-field">
        <label for="perfil-nombre">Nombre</label>
        <input
          id="perfil-nombre"
          ref="nombreInput"
          v-model="valores.nombre"
          name="nombre"
          type="text"
          autocomplete="name"
          maxlength="100"
          required
          aria-required="true"
          :aria-invalid="Boolean(erroresVisibles.nombre)"
          :aria-describedby="erroresVisibles.nombre ? 'perfil-nombre-error' : 'perfil-nombre-help'"
        />
        <p id="perfil-nombre-help" class="form-field__help">
          Obligatorio. Máximo 100 caracteres.
        </p>
        <p v-if="erroresVisibles.nombre" id="perfil-nombre-error" class="form-field__error" role="alert">
          {{ erroresVisibles.nombre }}
        </p>
      </div>

      <div class="form-field">
        <label for="perfil-biografia">Biografía</label>
        <textarea
          id="perfil-biografia"
          ref="biografiaInput"
          v-model="valores.biografia"
          name="biografia"
          rows="5"
          maxlength="500"
          :aria-invalid="Boolean(erroresVisibles.biografia)"
          :aria-describedby="erroresVisibles.biografia ? 'perfil-biografia-error' : 'perfil-biografia-help'"
        ></textarea>
        <p id="perfil-biografia-help" class="form-field__help">Máximo 500 caracteres.</p>
        <p v-if="erroresVisibles.biografia" id="perfil-biografia-error" class="form-field__error" role="alert">
          {{ erroresVisibles.biografia }}
        </p>
      </div>

      <div class="perfil-form__actions">
        <button class="button" type="submit" :disabled="guardando || sinCambios">
          {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
        </button>
        <button
          class="button button--secondary"
          type="button"
          :disabled="guardando || sinCambios"
          @click="descartar"
        >
          Descartar cambios
        </button>
      </div>
    </form>
  </section>
</template>
