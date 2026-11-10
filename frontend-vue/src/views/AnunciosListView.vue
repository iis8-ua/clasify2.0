<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnuncioGrid from '../components/catalog/AnuncioGrid.vue'
import FiltrosCatalogo from '../components/catalog/FiltrosCatalogo.vue'
import PaginacionCatalogo from '../components/catalog/PaginacionCatalogo.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { conFiltro, conPagina, escribirQuery, leerQuery, FILTROS_POR_DEFECTO } from '../router/catalogQuery'
import { useAnunciosStore } from '../stores/anuncios'
import { useCategoriasStore } from '../stores/categorias'

const route = useRoute()
const router = useRouter()
const anuncios = useAnunciosStore()
const categorias = useCategoriasStore()

const filtros = computed(() => leerQuery(route.query))
const hayFiltrosActivos = computed(
  () =>
    filtros.value.texto !== FILTROS_POR_DEFECTO.texto ||
    filtros.value.categoria !== FILTROS_POR_DEFECTO.categoria ||
    filtros.value.estado !== FILTROS_POR_DEFECTO.estado ||
    filtros.value.orden !== FILTROS_POR_DEFECTO.orden
)
const textoInvalido = computed(() => filtros.value.texto.length > 150)

async function cargar() {
  if (textoInvalido.value) {
    return
  }

  await categorias.cargar()
  await anuncios.cargarListado(filtros.value)

  if (anuncios.paginacion.paginas > 0 && filtros.value.pagina > anuncios.paginacion.paginas) {
    await router.replace({
      name: 'anuncios',
      query: escribirQuery(conPagina(filtros.value, anuncios.paginacion.paginas))
    })
  }
}

watch(
  () => route.query,
  cargar,
  { immediate: true, deep: true }
)

function navegar(nuevosFiltros) {
  router.push({
    name: 'anuncios',
    query: escribirQuery(nuevosFiltros)
  })
}

function buscar(texto) {
  navegar(conFiltro(filtros.value, { texto }))
}

function cambiar(campo, valor) {
  navegar(conFiltro(filtros.value, { [campo]: valor }))
}

function limpiar() {
  router.push({ name: 'anuncios' })
}

function cambiarPagina(pagina) {
  navegar(conPagina(filtros.value, pagina))
}
</script>

<template>
  <section aria-labelledby="catalog-title">
    <h1 id="catalog-title" class="page-title">Anuncios</h1>

    <FiltrosCatalogo
      :filtros="filtros"
      :categorias="categorias.items"
      @buscar="buscar"
      @cambiar="cambiar"
      @limpiar="limpiar"
    />

    <StatePanel
      v-if="textoInvalido"
      type="validation"
      title="Búsqueda no válida"
      message="El texto de búsqueda no puede superar los 150 caracteres"
    />

    <StatePanel
      v-else-if="anuncios.estadoListado === 'loading'"
      type="loading"
      message="Cargando anuncios…"
    />

    <StatePanel
      v-else-if="anuncios.estadoListado === 'error'"
      type="error"
      title="No se pudo cargar el catálogo"
      :message="anuncios.errorListado?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <StatePanel
      v-else-if="anuncios.estadoListado === 'empty'"
      type="empty"
      title="Sin resultados"
      :message="
        hayFiltrosActivos
          ? 'No hay anuncios que coincidan con los filtros seleccionados'
          : 'No hay anuncios disponibles en este momento'
      "
    />

    <template v-else-if="anuncios.estadoListado === 'success'">
      <AnuncioGrid :anuncios="anuncios.listado" :categorias-por-id="categorias.porId" />
      <PaginacionCatalogo
        :pagina="anuncios.paginacion.pagina"
        :paginas="anuncios.paginacion.paginas"
        @cambiar="cambiarPagina"
      />
    </template>
  </section>
</template>
