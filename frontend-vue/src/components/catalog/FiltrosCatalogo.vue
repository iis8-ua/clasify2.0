<script setup>
import { computed, ref, watch } from 'vue'
import SelectorCategoria from './SelectorCategoria.vue'
import { ESTADOS, ORDENES } from '../../router/catalogQuery'

const props = defineProps({
  filtros: {
    type: Object,
    required: true
  },
  categorias: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['buscar', 'cambiar', 'limpiar'])
const texto = ref(props.filtros.texto)
const errorTexto = ref('')
const LONGITUD_MAXIMA_TEXTO = 150

watch(
  () => props.filtros.texto,
  (valor) => {
    texto.value = valor
    errorTexto.value = ''
  }
)

const hayFiltros = computed(
  () =>
    props.filtros.texto !== '' ||
    props.filtros.categoria !== null ||
    props.filtros.estado !== 'disponible' ||
    props.filtros.orden !== 'fecha_desc'
)

function buscar() {
  const valor = texto.value.trim()

  if (valor.length > LONGITUD_MAXIMA_TEXTO) {
    errorTexto.value = 'El texto de búsqueda no puede superar los 150 caracteres'
    return
  }

  errorTexto.value = ''
  emit('buscar', valor)
}

function cambiar(campo, valor) {
  emit('cambiar', campo, valor)
}
</script>

<template>
  <section class="catalog-filters" aria-label="Búsqueda y filtros de anuncios">
    <form class="catalog-filters__search" role="search" @submit.prevent="buscar">
      <div class="form-field">
        <label for="filtro-texto">Buscar</label>
        <input
          id="filtro-texto"
          v-model="texto"
          type="search"
          placeholder="Título o descripción"
          :aria-invalid="Boolean(errorTexto)"
          :aria-describedby="errorTexto ? 'filtro-texto-error' : undefined"
          @input="errorTexto = ''"
        />
        <p v-if="errorTexto" id="filtro-texto-error" class="form-field__error" role="alert">
          {{ errorTexto }}
        </p>
      </div>
      <button class="button" type="submit">Buscar</button>
    </form>

    <div class="catalog-filters__controls">
      <SelectorCategoria
        :model-value="filtros.categoria"
        :categorias="categorias"
        @update:model-value="cambiar('categoria', $event)"
      />

      <div class="form-field">
        <label for="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          :value="filtros.estado"
          @change="cambiar('estado', $event.target.value)"
        >
          <option v-for="estado in ESTADOS" :key="estado" :value="estado">
            {{ estado === 'todos' ? 'Todos' : estado === 'vendido' ? 'Vendidos' : 'Disponibles' }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <label for="filtro-orden">Orden</label>
        <select
          id="filtro-orden"
          :value="filtros.orden"
          @change="cambiar('orden', $event.target.value)"
        >
          <option v-for="orden in ORDENES" :key="orden" :value="orden">
            {{
              orden === 'fecha_desc'
                ? 'Más recientes'
                : orden === 'fecha_asc'
                  ? 'Más antiguos'
                  : orden === 'precio_desc'
                    ? 'Precio mayor'
                    : 'Precio menor'
            }}
          </option>
        </select>
      </div>

      <button
        v-if="hayFiltros"
        class="button button--secondary"
        type="button"
        @click="emit('limpiar')"
      >
        Limpiar filtros
      </button>
    </div>
  </section>
</template>
