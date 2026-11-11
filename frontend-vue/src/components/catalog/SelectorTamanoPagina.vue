<script setup>
import { TAMANOS_PAGINA } from '../../router/catalogQuery'

defineProps({
  modelValue: {
    type: Number,
    default: 20
  },
  label: {
    type: String,
    default: 'Elementos por página'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="form-field page-size">
    <label :for="`page-size-${label}`">{{ label }}</label>
    <select
      :id="`page-size-${label}`"
      :value="modelValue"
      @change="emit('update:modelValue', Number($event.target.value))"
    >
      <option v-for="tamano in TAMANOS_PAGINA" :key="tamano" :value="tamano">
        {{ tamano }}
      </option>
    </select>
  </div>
</template>
