<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnuncioGrid from '../components/catalog/AnuncioGrid.vue'
import PaginacionCatalogo from '../components/catalog/PaginacionCatalogo.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useCategoriasStore } from '../stores/categorias'
import { useFavoritosStore } from '../stores/favoritos'

const route = useRoute()
const router = useRouter()
const favoritos = useFavoritosStore()
const categorias = useCategoriasStore()

const pagina = computed(() => {
  const valor = Number(route.query.pagina)
  return Number.isInteger(valor) && valor >= 1 ? valor : 1
})

async function cargar() {
  if (route.query.pagina !== undefined && String(pagina.value) !== String(route.query.pagina)) {
    await router.replace({
      name: 'favoritos',
      query: pagina.value > 1 ? { pagina: String(pagina.value) } : {}
    })
    return
  }

  await Promise.all([categorias.cargar(), favoritos.cargar(pagina.value)])

  if (favoritos.error?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (favoritos.estado === 'error') {
    return
  }

  if (pagina.value > 1 && favoritos.paginacion.paginas === 0) {
    await router.replace({ name: 'favoritos', query: {} })
    return
  }

  if (favoritos.paginacion.paginas > 0 && pagina.value > favoritos.paginacion.paginas) {
    await router.replace({
      name: 'favoritos',
      query: { pagina: String(favoritos.paginacion.paginas) }
    })
  }
}

watch(
  () => route.query.pagina,
  cargar,
  { immediate: true }
)

function cambiarPagina(nuevaPagina) {
  router.push({
    name: 'favoritos',
    query: nuevaPagina > 1 ? { pagina: String(nuevaPagina) } : {}
  })
}
</script>

<template>
  <section aria-labelledby="favorites-title">
    <h1 id="favorites-title" class="page-title">Mis favoritos</h1>

    <StatePanel
      v-if="favoritos.estado === 'loading'"
      type="loading"
      message="Cargando favoritos…"
    />

    <StatePanel
      v-else-if="favoritos.estado === 'error'"
      type="error"
      title="No se pudieron cargar los favoritos"
      :message="favoritos.error?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <StatePanel
      v-else-if="favoritos.estado === 'empty'"
      type="empty"
      title="Sin favoritos"
      message="Todavía no has guardado ningún anuncio"
      action-label="Explorar anuncios"
      @action="router.push({ name: 'anuncios' })"
    />

    <template v-else-if="favoritos.estado === 'success'">
      <AnuncioGrid
        :anuncios="favoritos.listado"
        :categorias-por-id="categorias.porId"
        :nivel-titulo="2"
      />
      <PaginacionCatalogo
        :pagina="favoritos.paginacion.pagina"
        :paginas="favoritos.paginacion.paginas"
        aria-label="Paginación de favoritos"
        @cambiar="cambiarPagina"
      />
    </template>
  </section>
</template>
