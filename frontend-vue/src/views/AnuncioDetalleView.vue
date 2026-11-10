<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DateText from '../components/common/DateText.vue'
import ImageWithFallback from '../components/common/ImageWithFallback.vue'
import PriceText from '../components/common/PriceText.vue'
import EstadoAnuncioBadge from '../components/catalog/EstadoAnuncioBadge.vue'
import AccionesAnuncio from '../components/anuncios/AccionesAnuncio.vue'
import BotonFavorito from '../components/favoritos/BotonFavorito.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useAnunciosStore } from '../stores/anuncios'

const route = useRoute()
const router = useRouter()
const anuncios = useAnunciosStore()

const id = computed(() => Number(route.params.id))
const idValido = computed(() => Number.isInteger(id.value) && id.value > 0)
const detalle = computed(() => anuncios.detalle)

const imagenUrl = computed(() => {
  if (!detalle.value?.imagen) {
    return null
  }
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base.replace(/\/$/, '')}/uploads/${detalle.value.imagen}`
})

const valoracion = computed(() => {
  const autor = detalle.value?.autor
  if (!autor || autor.num_valoraciones === 0 || autor.valoracion_media === null) {
    return 'Sin valoraciones'
  }
  return `${autor.valoracion_media} de 5 (${autor.num_valoraciones} valoraciones)`
})

async function cargar() {
  if (!idValido.value) {
    anuncios.limpiarDetalle()
    return
  }
  await anuncios.cargarDetalle(id.value)
}

watch(
  () => route.params.id,
  cargar,
  { immediate: true }
)

function volver() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: 'anuncios' })
  }
}

function actualizarFavorito({ esFavorito, numFavoritos }) {
  anuncios.actualizarFavorito(detalle.value.id, esFavorito, numFavoritos)
}
</script>

<template>
  <section aria-labelledby="detail-title">
    <button class="button button--secondary" type="button" @click="volver">
      Volver al listado
    </button>

    <StatePanel
      v-if="!idValido"
      type="validation"
      title="Anuncio no válido"
      message="El identificador del anuncio no es válido"
    />

    <StatePanel
      v-else-if="anuncios.estadoDetalle === 'loading'"
      type="loading"
      message="Cargando el anuncio…"
    />

    <StatePanel
      v-else-if="anuncios.estadoDetalle === 'notfound'"
      type="empty"
      title="Anuncio no encontrado"
      message="El anuncio que buscas no existe o ya no está disponible"
    />

    <StatePanel
      v-else-if="anuncios.estadoDetalle === 'error'"
      type="error"
      title="No se pudo cargar el anuncio"
      :message="anuncios.errorDetalle?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <article v-else-if="detalle" class="anuncio-detalle">
      <div class="anuncio-detalle__media">
        <ImageWithFallback :src="imagenUrl" :alt="`Imagen de ${detalle.titulo}`" loading="eager" />
      </div>

      <div class="anuncio-detalle__content">
        <div class="anuncio-detalle__heading">
          <h1 id="detail-title" class="page-title">{{ detalle.titulo }}</h1>
          <EstadoAnuncioBadge :estado="detalle.estado" />
        </div>

        <p class="anuncio-detalle__price"><PriceText :value="detalle.precio" /></p>
        <p class="anuncio-detalle__category">{{ detalle.categoria.nombre }}</p>
        <p><DateText :value="detalle.fecha_creacion" /></p>
        <p class="anuncio-detalle__description">{{ detalle.descripcion }}</p>

        <section class="anuncio-detalle__author" aria-labelledby="author-title">
          <h2 id="author-title" class="anuncio-detalle__section-title">Sobre el vendedor</h2>
          <p class="anuncio-detalle__author-name">{{ detalle.autor.nombre }}</p>
          <p v-if="detalle.autor.biografia" class="anuncio-detalle__author-bio">
            {{ detalle.autor.biografia }}
          </p>
          <p class="anuncio-detalle__rating">{{ valoracion }}</p>
        </section>

        <p class="anuncio-detalle__favorites">
          {{ detalle.num_favoritos }} favoritos
          <span v-if="detalle.es_favorito">· Guardado en tus favoritos</span>
        </p>

        <BotonFavorito :anuncio="detalle" @cambio="actualizarFavorito" />

        <AccionesAnuncio :anuncio="detalle" />
      </div>
    </article>
  </section>
</template>
