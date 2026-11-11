<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PerfilPublicoDatos from '../components/perfil-publico/PerfilPublicoDatos.vue'
import ValoracionesRecibidas from '../components/perfil-publico/ValoracionesRecibidas.vue'
import AnunciosUsuario from '../components/perfil-publico/AnunciosUsuario.vue'
import FormularioValoracion from '../components/valoraciones/FormularioValoracion.vue'
import PaginacionCatalogo from '../components/catalog/PaginacionCatalogo.vue'
import SelectorTamanoPagina from '../components/catalog/SelectorTamanoPagina.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useCategoriasStore } from '../stores/categorias'
import { usePerfilPublicoStore } from '../stores/perfilPublico'
import { useSessionStore } from '../stores/session'
import { TAMANOS_PAGINA } from '../router/catalogQuery'

const route = useRoute()
const router = useRouter()
const perfilPublico = usePerfilPublicoStore()
const session = useSessionStore()
const categorias = useCategoriasStore()

const id = computed(() => Number(route.params.id))
const idValido = computed(() => Number.isInteger(id.value) && id.value > 0)

function enteroPositivo(valor, defecto) {
  const numero = Number(valor)
  return Number.isInteger(numero) && numero >= 1 ? numero : defecto
}

function limiteValido(valor) {
  const numero = Number(valor)
  return TAMANOS_PAGINA.includes(numero) ? numero : 20
}

const paginaAnuncios = computed(() => enteroPositivo(route.query.paginaAnuncios, 1))
const limiteAnuncios = computed(() => limiteValido(route.query.limiteAnuncios))
const paginaValoraciones = computed(() => enteroPositivo(route.query.paginaValoraciones, 1))
const limiteValoraciones = computed(() => limiteValido(route.query.limiteValoraciones))

function queryNormalizada() {
  const query = {}
  if (paginaAnuncios.value > 1) query.paginaAnuncios = String(paginaAnuncios.value)
  if (limiteAnuncios.value !== 20) query.limiteAnuncios = String(limiteAnuncios.value)
  if (paginaValoraciones.value > 1) query.paginaValoraciones = String(paginaValoraciones.value)
  if (limiteValoraciones.value !== 20) query.limiteValoraciones = String(limiteValoraciones.value)
  return query
}

function queryCoincide() {
  return ['paginaAnuncios', 'limiteAnuncios', 'paginaValoraciones', 'limiteValoraciones'].every(
    (clave) => route.query[clave] === undefined || String(route.query[clave]) === String(queryNormalizada()[clave])
  )
}

function aplicarCambio(clave, valor, defecto) {
  const query = { ...queryNormalizada() }
  if (valor === defecto) {
    delete query[clave]
  } else {
    query[clave] = String(valor)
  }
  router.push({ name: 'perfil-publico', params: { id: id.value }, query })
}

function cambiarPaginaAnuncios(pagina) {
  aplicarCambio('paginaAnuncios', pagina, 1)
}

function cambiarLimiteAnuncios(limite) {
  const query = { ...queryNormalizada(), limiteAnuncios: limite === 20 ? undefined : String(limite), paginaAnuncios: undefined }
  Object.keys(query).forEach((clave) => query[clave] === undefined && delete query[clave])
  router.push({ name: 'perfil-publico', params: { id: id.value }, query })
}

function cambiarPaginaValoraciones(pagina) {
  aplicarCambio('paginaValoraciones', pagina, 1)
}

function cambiarLimiteValoraciones(limite) {
  const query = { ...queryNormalizada(), limiteValoraciones: limite === 20 ? undefined : String(limite), paginaValoraciones: undefined }
  Object.keys(query).forEach((clave) => query[clave] === undefined && delete query[clave])
  router.push({ name: 'perfil-publico', params: { id: id.value }, query })
}

async function cargar() {
  if (!idValido.value) {
    return
  }
  if (!queryCoincide()) {
    await router.replace({ name: 'perfil-publico', params: { id: id.value }, query: queryNormalizada() })
    return
  }

  await Promise.all([
    categorias.cargar(),
    perfilPublico.cargarPerfil(id.value),
    perfilPublico.cargarValoraciones(id.value, paginaValoraciones.value, limiteValoraciones.value),
    perfilPublico.cargarAnuncios(id.value, paginaAnuncios.value, limiteAnuncios.value)
  ])

  if (perfilPublico.estadoPerfil === 'notfound') {
    return
  }

  if (perfilPublico.estadoValoraciones !== 'error' && paginaValoraciones.value > 1 && perfilPublico.paginacionValoraciones.paginas === 0) {
    cambiarPaginaValoraciones(1)
    return
  }
  if (perfilPublico.estadoValoraciones !== 'error' && perfilPublico.paginacionValoraciones.paginas > 0 && paginaValoraciones.value > perfilPublico.paginacionValoraciones.paginas) {
    cambiarPaginaValoraciones(perfilPublico.paginacionValoraciones.paginas)
    return
  }
  if (perfilPublico.estadoAnuncios !== 'error' && paginaAnuncios.value > 1 && perfilPublico.paginacionAnuncios.paginas === 0) {
    cambiarPaginaAnuncios(1)
    return
  }
  if (perfilPublico.estadoAnuncios !== 'error' && perfilPublico.paginacionAnuncios.paginas > 0 && paginaAnuncios.value > perfilPublico.paginacionAnuncios.paginas) {
    cambiarPaginaAnuncios(perfilPublico.paginacionAnuncios.paginas)
  }
}

watch(() => [route.params.id, route.query], cargar, { immediate: true, deep: true })
</script>

<template>
  <section aria-labelledby="public-profile-title">
    <StatePanel v-if="!idValido" type="validation" title="Perfil no válido" message="El identificador del usuario no es válido" />
    <StatePanel v-else-if="perfilPublico.estadoPerfil === 'loading'" type="loading" message="Cargando el perfil…" />
    <StatePanel
      v-else-if="perfilPublico.estadoPerfil === 'notfound'"
      type="empty"
      title="Perfil no encontrado"
      message="El usuario que buscas no existe"
    />
    <StatePanel
      v-else-if="perfilPublico.estadoPerfil === 'error'"
      type="error"
      title="No se pudo cargar el perfil"
      :message="perfilPublico.errorPerfil?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <template v-else-if="perfilPublico.perfil">
      <h1 id="public-profile-title" class="page-title">{{ perfilPublico.perfil.nombre }}</h1>
      <div class="perfil-layout">
        <PerfilPublicoDatos :perfil="perfilPublico.perfil" />

        <FormularioValoracion
          v-if="id !== session.usuario?.id"
          :usuario-id="id"
          :valoracion="perfilPublico.perfil.mi_valoracion"
          :nombre="perfilPublico.perfil.nombre"
          @guardado="cargar"
          @eliminado="cargar"
        />

        <ValoracionesRecibidas
          :valoraciones="perfilPublico.valoraciones"
          :estado="perfilPublico.estadoValoraciones"
          :error="perfilPublico.errorValoraciones"
          @retry="cargar"
        />
        <div v-if="perfilPublico.estadoValoraciones === 'success'" class="catalog-pagination__row">
          <SelectorTamanoPagina :model-value="limiteValoraciones" @update:model-value="cambiarLimiteValoraciones" />
          <PaginacionCatalogo
            :pagina="perfilPublico.paginacionValoraciones.pagina"
            :paginas="perfilPublico.paginacionValoraciones.paginas"
            aria-label="Paginación de valoraciones recibidas"
            @cambiar="cambiarPaginaValoraciones"
          />
        </div>

        <AnunciosUsuario
          :anuncios="perfilPublico.anuncios"
          :categorias-por-id="categorias.porId"
          :estado="perfilPublico.estadoAnuncios"
          :error="perfilPublico.errorAnuncios"
          @retry="cargar"
        />
        <div v-if="perfilPublico.estadoAnuncios === 'success'" class="catalog-pagination__row">
          <SelectorTamanoPagina :model-value="limiteAnuncios" @update:model-value="cambiarLimiteAnuncios" />
          <PaginacionCatalogo
            :pagina="perfilPublico.paginacionAnuncios.pagina"
            :paginas="perfilPublico.paginacionAnuncios.paginas"
            aria-label="Paginación de anuncios del perfil"
            @cambiar="cambiarPaginaAnuncios"
          />
        </div>
      </div>
    </template>
  </section>
</template>
