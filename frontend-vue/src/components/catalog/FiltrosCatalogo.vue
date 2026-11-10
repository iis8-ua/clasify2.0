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

watch(
  () => props.filtros.texto,
  (valor) => {
    texto.value = valor
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
  emit('buscar', texto.value.trim())
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
          maxlength="150"
          placeholder="Título o descripción"
        />
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
