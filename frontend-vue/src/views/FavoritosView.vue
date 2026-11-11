<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnuncioGrid from '../components/catalog/AnuncioGrid.vue'
import PaginacionCatalogo from '../components/catalog/PaginacionCatalogo.vue'
import StatePanel from '../components/states/StatePanel.vue'
import BotonQuitarFavorito from '../components/favoritos/BotonQuitarFavorito.vue'
import SelectorTamanoPagina from '../components/catalog/SelectorTamanoPagina.vue'
import { useCategoriasStore } from '../stores/categorias'
import { useFavoritosStore } from '../stores/favoritos'
import { TAMANOS_PAGINA } from '../router/catalogQuery'

const route = useRoute()
const router = useRouter()
const favoritos = useFavoritosStore()
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
    await router.replace({ name: 'favoritos', query: queryNormalizada })
    return
  }

  await Promise.all([categorias.cargar(), favoritos.cargar(pagina.value, limite.value)])

  if (favoritos.error?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (favoritos.estado === 'error') {
    return
  }

  if (pagina.value > 1 && favoritos.paginacion.paginas === 0) {
    await router.replace({ name: 'favoritos', query: limite.value !== 20 ? { limite: String(limite.value) } : {} })
    return
  }

  if (favoritos.paginacion.paginas > 0 && pagina.value > favoritos.paginacion.paginas) {
    const query = { pagina: String(favoritos.paginacion.paginas) }
    if (limite.value !== 20) {
      query.limite = String(limite.value)
    }
    await router.replace({ name: 'favoritos', query })
  }
}

watch(
  () => route.query.pagina,
  cargar,
  { immediate: true }
)

function quitarDeLista(id) {
  favoritos.listado = favoritos.listado.filter((item) => item.id !== id)
  const total = Math.max(0, favoritos.paginacion.total - 1)
  const paginas = total > 0 ? Math.ceil(total / limite.value) : 0
  favoritos.paginacion = { ...favoritos.paginacion, total, paginas }

  if (favoritos.listado.length === 0) {
    if (pagina.value > 1) {
      const query = { pagina: String(pagina.value - 1) }
      if (limite.value !== 20) {
        query.limite = String(limite.value)
      }
      router.replace({ name: 'favoritos', query })
    } else {
      favoritos.estado = 'empty'
    }
    return
  }

  if (paginas > 0 && pagina.value > paginas) {
    const query = { pagina: String(paginas) }
    if (limite.value !== 20) {
      query.limite = String(limite.value)
    }
    router.replace({ name: 'favoritos', query })
  }
}

function cambiarPagina(nuevaPagina) {
  const query = nuevaPagina > 1 ? { pagina: String(nuevaPagina) } : {}
  if (limite.value !== 20) {
    query.limite = String(limite.value)
  }
  router.push({ name: 'favoritos', query })
}

function cambiarTamano(nuevoLimite) {
  const query = nuevoLimite !== 20 ? { limite: String(nuevoLimite) } : {}
  router.push({ name: 'favoritos', query })
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
      >
        <template #acciones="{ anuncio }">
          <BotonQuitarFavorito :anuncio="anuncio" @quitar="quitarDeLista" />
        </template>
      </AnuncioGrid>
      <div class="catalog-pagination__row">
        <SelectorTamanoPagina
          :model-value="limite"
          @update:model-value="cambiarTamano"
        />
        <PaginacionCatalogo
          :pagina="favoritos.paginacion.pagina"
          :paginas="favoritos.paginacion.paginas"
          aria-label="Paginación de favoritos"
          @cambiar="cambiarPagina"
        />
      </div>
    </template>
  </section>
</template>
