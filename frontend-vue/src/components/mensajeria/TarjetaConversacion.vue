<script setup>
import DateText from '../common/DateText.vue'
import ImageWithFallback from '../common/ImageWithFallback.vue'
import PriceText from '../common/PriceText.vue'
import { urlImagen } from '../../services/media'

defineProps({
  conversacion: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="conversation-card">
    <RouterLink
      class="conversation-card__main"
      :to="{ name: 'conversacion', params: { id: conversacion.id } }"
      :aria-label="`Abrir conversación sobre ${conversacion.anuncio.titulo}`"
    >
      <ImageWithFallback
        class="conversation-card__image"
        :src="urlImagen(conversacion.anuncio.imagen)"
        :alt="`Imagen de ${conversacion.anuncio.titulo}`"
      />
      <div class="conversation-card__body">
        <div class="conversation-card__heading">
          <h2 class="conversation-card__title">{{ conversacion.anuncio.titulo }}</h2>
          <span v-if="conversacion.no_leidos > 0" class="conversation-card__unread">
            {{ conversacion.no_leidos }} sin leer
          </span>
        </div>
        <p class="conversation-card__price"><PriceText :value="conversacion.anuncio.precio" /></p>
        <p class="conversation-card__counterpart">
          Con
          <RouterLink
            class="conversation-card__profile"
            :to="{ name: 'perfil-publico', params: { id: conversacion.contraparte.id } }"
            @click.stop
          >
            {{ conversacion.contraparte.nombre }}
          </RouterLink>
        </p>
        <p v-if="conversacion.ultimo_mensaje" class="conversation-card__last">
          {{ conversacion.ultimo_mensaje.texto }}
          <DateText :value="conversacion.ultimo_mensaje.fecha" />
        </p>
        <p v-else class="conversation-card__last">Sin mensajes todavía</p>
      </div>
    </RouterLink>
  </article>
</template>
