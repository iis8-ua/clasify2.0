<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListaValoraciones from './ListaValoraciones.vue'
import PaginacionCatalogo from '../catalog/PaginacionCatalogo.vue'
import ConfirmAction from '../states/ConfirmAction.vue'
import { useValoracionesStore } from '../../stores/valoraciones'
import { useNotificaciones } from '../../services/notifications'
import { useSessionStore } from '../../stores/session'

const route = useRoute()
const router = useRouter()
const valoraciones = useValoracionesStore()
const notificaciones = useNotificaciones()
const session = useSessionStore()
const porEliminar = ref(null)

function entero(valor, defecto) {
  const numero = Number(valor)
  return Number.isInteger(numero) && numero >= 1 ? numero : defecto
}


const paginaRecibidas = computed(() => entero(route.query.valoracionesRecibidasPagina, 1))
const paginaEscritas = computed(() => entero(route.query.valoracionesEscritasPagina, 1))

function query() {
  const resultado = {}
  if (paginaRecibidas.value > 1) resultado.valoracionesRecibidasPagina = String(paginaRecibidas.value)
  if (paginaEscritas.value > 1) resultado.valoracionesEscritasPagina = String(paginaEscritas.value)
  return resultado
}

function coincideQuery() {
  const esperado = query()
  return ['valoracionesRecibidasPagina', 'valoracionesEscritasPagina'].every(
    (clave) => route.query[clave] === undefined || String(route.query[clave]) === String(esperado[clave])
  )
}

async function cargar() {
  if (!coincideQuery()) {
    await router.replace({ name: 'perfil', query: query() })
    return
  }

  await Promise.all([
    valoraciones.cargarRecibidas(session.usuario?.id, paginaRecibidas.value),
    valoraciones.cargarEscritas(paginaEscritas.value)
  ])

  if (valoraciones.estadoRecibidas !== 'error' && paginaRecibidas.value > 1 && valoraciones.paginacionRecibidas.paginas === 0) {
    const limpia = { ...query() }
    delete limpia.valoracionesRecibidasPagina
    await router.replace({ name: 'perfil', query: limpia })
    return
  }
  if (valoraciones.estadoRecibidas !== 'error' && valoraciones.paginacionRecibidas.paginas > 0 && paginaRecibidas.value > valoraciones.paginacionRecibidas.paginas) {
    await router.replace({ name: 'perfil', query: { ...query(), valoracionesRecibidasPagina: String(valoraciones.paginacionRecibidas.paginas) } })
    return
  }
  if (valoraciones.estadoEscritas !== 'error' && paginaEscritas.value > 1 && valoraciones.paginacionEscritas.paginas === 0) {
    const limpia = { ...query() }
    delete limpia.valoracionesEscritasPagina
    await router.replace({ name: 'perfil', query: limpia })
    return
  }
  if (valoraciones.estadoEscritas !== 'error' && valoraciones.paginacionEscritas.paginas > 0 && paginaEscritas.value > valoraciones.paginacionEscritas.paginas) {
    await router.replace({ name: 'perfil', query: { ...query(), valoracionesEscritasPagina: String(valoraciones.paginacionEscritas.paginas) } })
  }
}

watch(() => route.query, cargar, { immediate: true, deep: true })

function cambiar(clave, valor, defecto) {
  const nueva = { ...query() }
  if (valor === defecto) delete nueva[clave]
  else nueva[clave] = String(valor)
  router.push({ name: 'perfil', query: nueva })
}

async function confirmarEliminar() {
  if (!porEliminar.value) return
  const valoracion = porEliminar.value
  porEliminar.value = null
  try {
    await valoraciones.eliminar(valoracion.para.id)
    notificaciones.exito('Valoración eliminada')
    await cargar()
  } catch (fallo) {
    if (fallo.estado === 404) {
      notificaciones.exito('Valoración eliminada')
      await cargar()
      return
    }
    notificaciones.error(fallo.mensaje ?? 'No se pudo eliminar la valoración')
  }
}
</script>

<template>
  <ListaValoraciones
    titulo="Valoraciones recibidas"
    :items="valoraciones.recibidas"
    :estado="valoraciones.estadoRecibidas"
    :error="valoraciones.errorRecibidas"
    modo="recibida"
    @retry="cargar"
  />
  <div v-if="valoraciones.estadoRecibidas === 'success'" class="catalog-pagination__row">
    <PaginacionCatalogo
      :pagina="valoraciones.paginacionRecibidas.pagina"
      :paginas="valoraciones.paginacionRecibidas.paginas"
      aria-label="Paginación de valoraciones recibidas"
      @cambiar="cambiar('valoracionesRecibidasPagina', $event, 1)"
    />
  </div>

  <ListaValoraciones
    titulo="Valoraciones escritas"
    :items="valoraciones.escritas"
    :estado="valoraciones.estadoEscritas"
    :error="valoraciones.errorEscritas"
    modo="escrita"
    @retry="cargar"
    @editar="router.push({ name: 'perfil-publico', params: { id: $event.para.id } })"
    @eliminar="porEliminar = $event"
  />
  <div v-if="valoraciones.estadoEscritas === 'success'" class="catalog-pagination__row">
    <PaginacionCatalogo
      :pagina="valoraciones.paginacionEscritas.pagina"
      :paginas="valoraciones.paginacionEscritas.paginas"
      aria-label="Paginación de valoraciones escritas"
      @cambiar="cambiar('valoracionesEscritasPagina', $event, 1)"
    />
  </div>

  <ConfirmAction
    :open="Boolean(porEliminar)"
    title="Eliminar valoración"
    message="¿Quieres eliminar esta valoración?"
    confirm-label="Eliminar"
    cancel-label="Cancelar"
    :loading="valoraciones.eliminando"
    @confirm="confirmarEliminar"
    @cancel="porEliminar = null"
    @close="porEliminar = null"
  />
</template>
