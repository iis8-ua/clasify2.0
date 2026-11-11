<script setup>
import { ref, watch } from 'vue'
import AnuncioGrid from './AnuncioGrid.vue'
import { anunciosService } from '../../services/anunciosService'
import { useCategoriasStore } from '../../stores/categorias'

const props = defineProps({
  anuncio: {
    type: Object,
    required: true
  }
})

const categorias = useCategoriasStore()
const similares = ref([])
const delVendedor = ref([])

function disponibles(anuncios, idActual) {
  return (Array.isArray(anuncios) ? anuncios : [])
    .filter((item) => item.id !== idActual && item.estado === 'disponible')
    .slice(0, 4)
}

async function cargar() {
  if (!props.anuncio?.id) {
    return
  }

  await categorias.cargar()

  const [respuestaSimilares, respuestaVendedor] = await Promise.allSettled([
    anunciosService.listar({
      estado: 'disponible',
      orden: 'fecha_desc',
      pagina: 1,
      limite: 4,
      categoria: props.anuncio.id_categoria ?? props.anuncio.categoria?.id
    }),
    anunciosService.listarDeUsuario(props.anuncio.id_autor ?? props.anuncio.autor?.id, {
      limite: 4
    })
  ])

  similares.value = respuestaSimilares.status === 'fulfilled'
    ? disponibles(respuestaSimilares.value.datos, props.anuncio.id)
    : []
  delVendedor.value = respuestaVendedor.status === 'fulfilled'
    ? disponibles(respuestaVendedor.value.datos, props.anuncio.id)
    : []
}

watch(() => props.anuncio?.id, cargar, { immediate: true })
</script>

<template>
  <section v-if="similares.length > 0" class="related-section" aria-labelledby="related-title">
    <h2 id="related-title" class="anuncio-detalle__section-title">Anuncios similares</h2>
    <AnuncioGrid
      :anuncios="similares"
      :categorias-por-id="categorias.porId"
      :nivel-titulo="3"
    />
  </section>

  <section v-if="delVendedor.length > 0" class="related-section" aria-labelledby="seller-title">
    <div class="related-section__heading">
      <h2 id="seller-title" class="anuncio-detalle__section-title">Más de este vendedor</h2>
      <RouterLink class="related-section__profile" :to="{ name: 'perfil-publico', params: { id: anuncio.id_autor ?? anuncio.autor?.id } }">
        Ver perfil
      </RouterLink>
    </div>
    <AnuncioGrid
      :anuncios="delVendedor"
      :categorias-por-id="categorias.porId"
      :nivel-titulo="3"
    />
  </section>
</template>
