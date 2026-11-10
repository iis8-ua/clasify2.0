<script setup>
import { computed, ref, watch } from 'vue'
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

function enviar() {
  errores.value = validar()

  if (Object.keys(errores.value).length > 0 || props.enviando || sinCambios.value) {
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
        v-model="valores.titulo"
        type="text"
        maxlength="150"
        :aria-invalid="Boolean(erroresVisibles.titulo)"
        :aria-describedby="erroresVisibles.titulo ? 'anuncio-titulo-error' : undefined"
      />
      <p v-if="erroresVisibles.titulo" id="anuncio-titulo-error" class="form-field__error">
        {{ erroresVisibles.titulo }}
      </p>
    </div>

    <div class="form-field">
      <label for="anuncio-descripcion">Descripción</label>
      <textarea
        id="anuncio-descripcion"
        v-model="valores.descripcion"
        rows="6"
        maxlength="5000"
        :aria-invalid="Boolean(erroresVisibles.descripcion)"
        :aria-describedby="erroresVisibles.descripcion ? 'anuncio-descripcion-error' : undefined"
      ></textarea>
      <p v-if="erroresVisibles.descripcion" id="anuncio-descripcion-error" class="form-field__error">
        {{ erroresVisibles.descripcion }}
      </p>
    </div>

    <div class="anuncio-form__row">
      <div class="form-field">
        <label for="anuncio-precio">Precio (€)</label>
        <input
          id="anuncio-precio"
          v-model="valores.precio"
          type="text"
          inputmode="decimal"
          :aria-invalid="Boolean(erroresVisibles.precio)"
          :aria-describedby="erroresVisibles.precio ? 'anuncio-precio-error' : undefined"
        />
        <p v-if="erroresVisibles.precio" id="anuncio-precio-error" class="form-field__error">
          {{ erroresVisibles.precio }}
        </p>
      </div>

      <div class="form-field">
        <label for="anuncio-categoria">Categoría</label>
        <select
          id="anuncio-categoria"
          :value="valores.categoria ?? ''"
          :aria-invalid="Boolean(erroresVisibles.categoria)"
          :aria-describedby="erroresVisibles.categoria ? 'anuncio-categoria-error' : undefined"
          @change="valores.categoria = $event.target.value ? Number($event.target.value) : null"
        >
          <option value="">Selecciona una categoría</option>
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.nombre }}
          </option>
        </select>
        <p v-if="erroresVisibles.categoria" id="anuncio-categoria-error" class="form-field__error">
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
