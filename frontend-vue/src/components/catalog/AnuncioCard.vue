<script setup>
import { computed } from 'vue'
import DateText from '../common/DateText.vue'
import ImageWithFallback from '../common/ImageWithFallback.vue'
import PriceText from '../common/PriceText.vue'
import EstadoAnuncioBadge from './EstadoAnuncioBadge.vue'
import { urlImagen } from '../../services/media'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  },
  nombreCategoria: {
    type: String,
    default: 'Categoría no disponible'
  },
  nivelTitulo: {
    type: Number,
    default: 3,
    validator: (value) => [2, 3, 4].includes(value)
  }
})

const imagenUrl = computed(() => urlImagen(props.anuncio.imagen))
</script>

<template>
  <article class="anuncio-card">
    <RouterLink
      class="anuncio-card__link"
      :to="{ name: 'anuncio-detalle', params: { id: anuncio.id } }"
      :aria-label="`Ver detalle de ${anuncio.titulo}`"
    >
      <ImageWithFallback :src="imagenUrl" :alt="`Imagen de ${anuncio.titulo}`" />
      <div class="anuncio-card__body">
        <component :is="`h${nivelTitulo}`" class="anuncio-card__title">{{ anuncio.titulo }}</component>
        <p class="anuncio-card__price">
          <PriceText :value="anuncio.precio" />
        </p>
        <p class="anuncio-card__category">{{ nombreCategoria }}</p>
        <div class="anuncio-card__meta">
          <EstadoAnuncioBadge :estado="anuncio.estado" />
          <DateText :value="anuncio.fecha_creacion" />
        </div>
      </div>
    </RouterLink>
    <div v-if="$slots.acciones" class="anuncio-card__actions">
      <slot name="acciones" />
    </div>
  </article>
</template>
