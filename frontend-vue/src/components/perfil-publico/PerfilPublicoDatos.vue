<script setup>
import { computed } from 'vue'
import DateText from '../common/DateText.vue'

const props = defineProps({
  perfil: {
    type: Object,
    required: true
  }
})

const resumenValoraciones = computed(() => {
  if (!props.perfil.num_valoraciones || props.perfil.valoracion_media === null) {
    return 'Sin valoraciones'
  }
  return `${props.perfil.valoracion_media} de 5 (${props.perfil.num_valoraciones} valoraciones)`
})
</script>

<template>
  <section class="perfil-card" aria-labelledby="public-data-title">
    <h2 id="public-data-title" class="perfil-section__title">Datos públicos</h2>
    <dl class="perfil-datos">
      <div class="perfil-datos__item">
        <dt>Nombre</dt>
        <dd>{{ perfil.nombre }}</dd>
      </div>
      <div class="perfil-datos__item">
        <dt>Biografía</dt>
        <dd>{{ perfil.biografia || 'Sin biografía' }}</dd>
      </div>
      <div class="perfil-datos__item">
        <dt>Fecha de alta</dt>
        <dd><DateText :value="perfil.fecha_alta" /></dd>
      </div>
      <div class="perfil-datos__item">
        <dt>Valoraciones</dt>
        <dd>{{ resumenValoraciones }}</dd>
      </div>
    </dl>
  </section>
</template>
