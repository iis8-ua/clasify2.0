<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnuncioGrid from '../catalog/AnuncioGrid.vue'
import PaginacionCatalogo from '../catalog/PaginacionCatalogo.vue'
import StatePanel from '../states/StatePanel.vue'
import { useCategoriasStore } from '../../stores/categorias'
import { usePerfilStore } from '../../stores/perfil'

const route = useRoute()
const router = useRouter()
const perfil = usePerfilStore()
const categorias = useCategoriasStore()

const pagina = computed(() => {
  const valor = Number(route.query.pagina)
  return Number.isInteger(valor) && valor >= 1 ? valor : 1
})

async function cargar() {
  if (route.query.pagina !== undefined && String(pagina.value) !== String(route.query.pagina)) {
    await router.replace({
      name: 'perfil',
      query: pagina.value > 1 ? { pagina: String(pagina.value) } : {}
    })
    return
  }

  await Promise.all([categorias.cargar(), perfil.cargarAnuncios(pagina.value)])

  if (perfil.errorAnuncios?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (pagina.value > 1 && perfil.paginacion.paginas === 0) {
    await router.replace({ name: 'perfil', query: {} })
    return
  }

  if (perfil.paginacion.paginas > 0 && pagina.value > perfil.paginacion.paginas) {
    await router.replace({
      name: 'perfil',
      query: { pagina: String(perfil.paginacion.paginas) }
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
    name: 'perfil',
    query: nuevaPagina > 1 ? { pagina: String(nuevaPagina) } : {}
  })
}

function crearAnuncio() {
  router.push({ name: 'anuncio-crear' })
}
</script>

<template>
  <section aria-labelledby="mis-anuncios-title" class="perfil-card">
    <h2 id="mis-anuncios-title" class="perfil-section__title">Mis anuncios</h2>

    <StatePanel
      v-if="perfil.estadoAnuncios === 'loading'"
      type="loading"
      message="Cargando tus anuncios…"
    />

    <StatePanel
      v-else-if="perfil.estadoAnuncios === 'error'"
      type="error"
      title="No se pudieron cargar tus anuncios"
      :message="perfil.errorAnuncios?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <StatePanel
      v-else-if="perfil.estadoAnuncios === 'empty'"
      type="empty"
      title="Sin anuncios publicados"
      message="Todavía no has publicado ningún anuncio"
      action-label="Publicar anuncio"
      @action="crearAnuncio"
    />

    <template v-else-if="perfil.estadoAnuncios === 'success'">
      <AnuncioGrid :anuncios="perfil.anuncios" :categorias-por-id="categorias.porId" />
      <PaginacionCatalogo
        :pagina="perfil.paginacion.pagina"
        :paginas="perfil.paginacion.paginas"
        aria-label="Paginación de mis anuncios"
        @cambiar="cambiarPagina"
      />
    </template>
  </section>
</template>
