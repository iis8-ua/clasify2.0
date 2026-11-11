<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DateText from '../components/common/DateText.vue'
import ImageWithFallback from '../components/common/ImageWithFallback.vue'
import PriceText from '../components/common/PriceText.vue'
import EstadoAnuncioBadge from '../components/catalog/EstadoAnuncioBadge.vue'
import CompartirAnuncio from '../components/catalog/CompartirAnuncio.vue'
import AnunciosRelacionados from '../components/catalog/AnunciosRelacionados.vue'
import ModalContactar from '../components/mensajeria/ModalContactar.vue'
import AccionesAnuncio from '../components/anuncios/AccionesAnuncio.vue'
import BotonFavorito from '../components/favoritos/BotonFavorito.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { urlImagen } from '../services/media'
import { useAnunciosStore } from '../stores/anuncios'
import { useSessionStore } from '../stores/session'

const route = useRoute()
const router = useRouter()
const anuncios = useAnunciosStore()
const session = useSessionStore()
const contactoAbierto = ref(false)

const id = computed(() => Number(route.params.id))
const idValido = computed(() => Number.isInteger(id.value) && id.value > 0)
const detalle = computed(() => anuncios.detalle)

const imagenUrl = computed(() => urlImagen(detalle.value?.imagen))
const esAutor = computed(
  () => session.usuario?.id === (detalle.value?.id_autor ?? detalle.value?.autor?.id)
)
const conversacionExistente = computed(() => detalle.value?.conversacion?.id ?? null)
const contactoDeshabilitado = computed(
  () => Boolean(detalle.value) && detalle.value.estado === 'vendido' && !conversacionExistente.value
)

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

function contactar() {
  if (!session.estaAutenticado) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (conversacionExistente.value) {
    router.push({ name: 'conversacion', params: { id: conversacionExistente.value } })
    return
  }
  contactoAbierto.value = true
}

function abrirConversacion(id) {
  router.push({ name: 'conversacion', params: { id } })
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
          <p class="anuncio-detalle__author-name">
            <RouterLink :to="{ name: 'perfil-publico', params: { id: detalle.autor.id } }">
              {{ detalle.autor.nombre }}
            </RouterLink>
          </p>
          <p v-if="detalle.autor.biografia" class="anuncio-detalle__author-bio">
            {{ detalle.autor.biografia }}
          </p>
          <p class="anuncio-detalle__rating">{{ valoracion }}</p>
        </section>

        <CompartirAnuncio :anuncio="detalle" />

        <p class="anuncio-detalle__favorites">
          {{ detalle.num_favoritos }} favoritos
          <span v-if="detalle.es_favorito">· Guardado en tus favoritos</span>
        </p>

        <BotonFavorito :anuncio="detalle" @cambio="actualizarFavorito" />

        <div v-if="!esAutor" class="contact-control">
          <button
            type="button"
            class="button button--secondary"
            :disabled="contactoDeshabilitado"
            @click="contactar"
          >
            {{ conversacionExistente ? 'Ver conversación' : 'Contactar' }}
          </button>
          <p v-if="contactoDeshabilitado" class="form-field__help">
            No se puede iniciar una conversación sobre un anuncio vendido.
          </p>
        </div>

        <AccionesAnuncio :anuncio="detalle" />
      </div>

      <AnunciosRelacionados class="anuncio-detalle__related" :anuncio="detalle" />
    </article>

    <ModalContactar
      v-if="detalle"
      :anuncio="detalle"
      :open="contactoAbierto"
      @close="contactoAbierto = false"
      @enviado="abrirConversacion"
    />
  </section>
</template>
