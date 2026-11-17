<script setup>
defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  categorias: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

function cambiar(event) {
  const valor = event.target.value
  emit('update:modelValue', valor === '' ? null : Number(valor))
}
</script>

<template>
  <div class="form-field">
    <label for="filtro-categoria">Categoría</label>
    <select id="filtro-categoria" :value="modelValue ?? ''" @change="cambiar">
      <option value="">Todas</option>
      <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
        {{ categoria.nombre }}
      </option>
    </select>
  </div>
</template>
