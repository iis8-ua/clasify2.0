<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnuncioGrid from '../catalog/AnuncioGrid.vue'
import PaginacionCatalogo from '../catalog/PaginacionCatalogo.vue'
import SelectorTamanoPagina from '../catalog/SelectorTamanoPagina.vue'
import { TAMANOS_PAGINA } from '../../router/catalogQuery'
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

const limite = computed(() => {
  const valor = Number(route.query.limite)
  return TAMANOS_PAGINA.includes(valor) ? valor : 20
})

async function cargar() {
  const queryNormalizada = {}
  if (pagina.value > 1) {
    queryNormalizada.pagina = String(pagina.value)
  }
  if (limite.value !== 20) {
    queryNormalizada.limite = String(limite.value)
  }
  const paginaEnUrl = route.query.pagina === undefined || String(pagina.value) === String(route.query.pagina)
  const limiteEnUrl = route.query.limite === undefined || String(limite.value) === String(route.query.limite)

  if (!paginaEnUrl || !limiteEnUrl) {
    await router.replace({ name: 'perfil', query: queryNormalizada })
    return
  }

  await Promise.all([categorias.cargar(), perfil.cargarAnuncios(pagina.value, limite.value)])

  if (perfil.errorAnuncios?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (perfil.estadoAnuncios === 'error') {
    return
  }

  if (pagina.value > 1 && perfil.paginacion.paginas === 0) {
    await router.replace({ name: 'perfil', query: limite.value !== 20 ? { limite: String(limite.value) } : {} })
    return
  }

  if (perfil.paginacion.paginas > 0 && pagina.value > perfil.paginacion.paginas) {
    const query = { pagina: String(perfil.paginacion.paginas) }
    if (limite.value !== 20) {
      query.limite = String(limite.value)
    }
    await router.replace({ name: 'perfil', query })
  }
}

watch(
  () => route.query.pagina,
  cargar,
  { immediate: true }
)

function cambiarPagina(nuevaPagina) {
  const query = nuevaPagina > 1 ? { pagina: String(nuevaPagina) } : {}
  if (limite.value !== 20) {
    query.limite = String(limite.value)
  }
  router.push({ name: 'perfil', query })
}

function cambiarTamano(nuevoLimite) {
  router.push({
    name: 'perfil',
    query: nuevoLimite !== 20 ? { limite: String(nuevoLimite) } : {}
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
      <div class="catalog-pagination__row">
        <SelectorTamanoPagina
          :model-value="limite"
          @update:model-value="cambiarTamano"
        />
        <PaginacionCatalogo
          :pagina="perfil.paginacion.pagina"
          :paginas="perfil.paginacion.paginas"
          aria-label="Paginación de mis anuncios"
          @cambiar="cambiarPagina"
        />
      </div>
    </template>
  </section>
</template>
