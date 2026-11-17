<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import CampoImagen from './CampoImagen.vue'

const props = defineProps({
  modo: {
    type: String,
    default: 'crear',
    validator: (value) => ['crear', 'editar'].includes(value)
  },
  valoresIniciales: {
    type: Object,
    default: () => ({ titulo: '', descripcion: '', precio: '', categoria: null })
  },
  imagenActual: {
    type: String,
    default: null
  },
  categorias: {
    type: Array,
    default: () => []
  },
  enviando: {
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

const emit = defineEmits(['submit', 'cancel', 'dirty-change'])

const valores = ref({
  titulo: props.valoresIniciales.titulo ?? '',
  descripcion: props.valoresIniciales.descripcion ?? '',
  precio: props.valoresIniciales.precio !== undefined ? String(props.valoresIniciales.precio) : '',
  categoria: props.valoresIniciales.categoria ?? null
})
const imagen = ref(null)
const errores = ref({})
const imagenError = ref('')
const tituloInput = ref(null)
const descripcionInput = ref(null)
const precioInput = ref(null)
const categoriaInput = ref(null)
const formatoPrecio = /^\d{1,8}(\.\d{1,2})?$/
const precioMaximo = 99999999.99

const erroresVisibles = computed(() => ({ ...errores.value, ...props.erroresServidor }))

const cambios = computed(() => {
  const resultado = {}
  if (valores.value.titulo !== (props.valoresIniciales.titulo ?? '')) {
    resultado.titulo = valores.value.titulo
  }
  if (valores.value.descripcion !== (props.valoresIniciales.descripcion ?? '')) {
    resultado.descripcion = valores.value.descripcion
  }
  if (String(valores.value.precio) !== String(props.valoresIniciales.precio ?? '')) {
    resultado.precio = valores.value.precio
  }
  if (valores.value.categoria !== (props.valoresIniciales.categoria ?? null)) {
    resultado.categoria = valores.value.categoria
  }
  return resultado
})

const sinCambios = computed(
  () => props.modo === 'editar' && Object.keys(cambios.value).length === 0 && !imagen.value
)

const sucio = computed(() => Object.keys(cambios.value).length > 0 || Boolean(imagen.value))

watch(sucio, (valor) => emit('dirty-change', valor))

watch(
  () => props.erroresServidor,
  () => enfocarPrimerError(),
  { deep: true }
)

function validar() {
  const nuevos = {}
  const titulo = valores.value.titulo.trim()
  const descripcion = valores.value.descripcion.trim()
  const precio = valores.value.precio.trim()

  if (titulo === '') {
    nuevos.titulo = 'El título es obligatorio'
  } else if (titulo.length > 150) {
    nuevos.titulo = 'El título no puede superar los 150 caracteres'
  }

  if (descripcion === '') {
    nuevos.descripcion = 'La descripción es obligatoria'
  } else if (descripcion.length > 5000) {
    nuevos.descripcion = 'La descripción no puede superar los 5000 caracteres'
  }

  if (precio === '') {
    nuevos.precio = 'El precio es obligatorio'
  } else if (!formatoPrecio.test(precio) || Number(precio) > precioMaximo) {
    nuevos.precio = 'El precio debe ser un número no negativo con hasta 2 decimales'
  }

  if (!valores.value.categoria) {
    nuevos.categoria = 'La categoría es obligatoria'
  }

  return nuevos
}

function enfocarPrimerError() {
  if (erroresVisibles.value.titulo) {
    nextTick(() => tituloInput.value?.focus())
  } else if (erroresVisibles.value.descripcion) {
    nextTick(() => descripcionInput.value?.focus())
  } else if (erroresVisibles.value.precio) {
    nextTick(() => precioInput.value?.focus())
  } else if (erroresVisibles.value.categoria) {
    nextTick(() => categoriaInput.value?.focus())
  }
}

function enviar() {
  errores.value = validar()

  if (Object.keys(errores.value).length > 0 || props.enviando || sinCambios.value) {
    if (Object.keys(errores.value).length > 0) {
      enfocarPrimerError()
    }
    return
  }

  emit('submit', {
    valores: props.modo === 'editar' ? cambios.value : {
      titulo: valores.value.titulo.trim(),
      descripcion: valores.value.descripcion.trim(),
      precio: valores.value.precio.trim(),
      categoria: valores.value.categoria
    },
    imagen: imagen.value,
    sinCambios: sinCambios.value
  })
}

function cancelar() {
  emit('cancel')
}
</script>

<template>
  <form class="anuncio-form" novalidate @submit.prevent="enviar">
    <p v-if="errorGeneral" class="form-error" role="alert">{{ errorGeneral }}</p>

    <div class="form-field">
      <label for="anuncio-titulo">Título</label>
      <input
        id="anuncio-titulo"
        ref="tituloInput"
        v-model="valores.titulo"
        type="text"
        maxlength="150"
        required
        aria-required="true"
        :aria-invalid="Boolean(erroresVisibles.titulo)"
        :aria-describedby="erroresVisibles.titulo ? 'anuncio-titulo-help anuncio-titulo-error' : 'anuncio-titulo-help'"
      />
      <p id="anuncio-titulo-help" class="form-field__help">Obligatorio. Máximo 150 caracteres.</p>
      <p v-if="erroresVisibles.titulo" id="anuncio-titulo-error" class="form-field__error" role="alert">
        {{ erroresVisibles.titulo }}
      </p>
    </div>

    <div class="form-field">
      <label for="anuncio-descripcion">Descripción</label>
      <textarea
        id="anuncio-descripcion"
        ref="descripcionInput"
        v-model="valores.descripcion"
        rows="6"
        maxlength="5000"
        required
        aria-required="true"
        :aria-invalid="Boolean(erroresVisibles.descripcion)"
        :aria-describedby="erroresVisibles.descripcion ? 'anuncio-descripcion-help anuncio-descripcion-error' : 'anuncio-descripcion-help'"
      ></textarea>
      <p id="anuncio-descripcion-help" class="form-field__help">Obligatoria. Máximo 5000 caracteres.</p>
      <p v-if="erroresVisibles.descripcion" id="anuncio-descripcion-error" class="form-field__error" role="alert">
        {{ erroresVisibles.descripcion }}
      </p>
    </div>

    <div class="anuncio-form__row">
      <div class="form-field">
        <label for="anuncio-precio">Precio (€)</label>
        <input
          id="anuncio-precio"
          ref="precioInput"
          v-model="valores.precio"
          type="text"
          inputmode="decimal"
          required
          aria-required="true"
          :aria-invalid="Boolean(erroresVisibles.precio)"
          :aria-describedby="erroresVisibles.precio ? 'anuncio-precio-help anuncio-precio-error' : 'anuncio-precio-help'"
        />
        <p id="anuncio-precio-help" class="form-field__help">Obligatorio. Hasta 2 decimales.</p>
        <p v-if="erroresVisibles.precio" id="anuncio-precio-error" class="form-field__error" role="alert">
          {{ erroresVisibles.precio }}
        </p>
      </div>

      <div class="form-field">
        <label for="anuncio-categoria">Categoría</label>
        <select
          id="anuncio-categoria"
          ref="categoriaInput"
          :value="valores.categoria ?? ''"
          required
          aria-required="true"
          :aria-invalid="Boolean(erroresVisibles.categoria)"
          :aria-describedby="erroresVisibles.categoria ? 'anuncio-categoria-help anuncio-categoria-error' : 'anuncio-categoria-help'"
          @change="valores.categoria = $event.target.value ? Number($event.target.value) : null"
        >
          <option value="">Selecciona una categoría</option>
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.nombre }}
          </option>
        </select>
        <p id="anuncio-categoria-help" class="form-field__help">Obligatoria.</p>
        <p v-if="erroresVisibles.categoria" id="anuncio-categoria-error" class="form-field__error" role="alert">
          {{ erroresVisibles.categoria }}
        </p>
      </div>
    </div>

    <CampoImagen
      :file="imagen"
      :imagen-actual="imagenActual"
      :error="imagenError || erroresVisibles.imagen"
      @update:file="imagen = $event"
      @error="imagenError = $event"
    />

    <div class="anuncio-form__actions">
      <button class="button" type="submit" :disabled="enviando || sinCambios">
        {{ enviando ? 'Guardando…' : modo === 'editar' ? 'Guardar cambios' : 'Publicar anuncio' }}
      </button>
      <button class="button button--secondary" type="button" @click="cancelar">
        Cancelar
      </button>
    </div>
  </form>
</template>
