<script setup>
import { computed, useId } from 'vue'
import { TAMANOS_PAGINA } from '../../router/catalogQuery'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 20
  },
  label: {
    type: String,
    default: 'Elementos por página'
  },
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const idGenerado = useId()
const identificador = computed(() => props.id || `page-size-${idGenerado}`)
</script>

<template>
  <div class="form-field page-size">
    <label :for="identificador">{{ label }}</label>
    <select
      :id="identificador"
      :value="modelValue"
      @change="emit('update:modelValue', Number($event.target.value))"
    >
      <option v-for="tamano in TAMANOS_PAGINA" :key="tamano" :value="tamano">
        {{ tamano }}
      </option>
    </select>
  </div>
</template>
