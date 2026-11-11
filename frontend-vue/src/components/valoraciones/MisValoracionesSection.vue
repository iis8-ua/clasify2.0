<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ListaValoraciones from './ListaValoraciones.vue'
import SelectorTamanoPagina from '../catalog/SelectorTamanoPagina.vue'
import PaginacionCatalogo from '../catalog/PaginacionCatalogo.vue'
import ConfirmAction from '../states/ConfirmAction.vue'
import { useValoracionesStore } from '../../stores/valoraciones'
import { TAMANOS_PAGINA } from '../../router/catalogQuery'
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

function limiteValido(valor) {
  const numero = Number(valor)
  return TAMANOS_PAGINA.includes(numero) ? numero : 20
}

const paginaRecibidas = computed(() => entero(route.query.valoracionesRecibidasPagina, 1))
const limiteRecibidas = computed(() => limiteValido(route.query.valoracionesRecibidasLimite))
const paginaEscritas = computed(() => entero(route.query.valoracionesEscritasPagina, 1))
const limiteEscritas = computed(() => limiteValido(route.query.valoracionesEscritasLimite))

function query() {
  const resultado = {}
  if (paginaRecibidas.value > 1) resultado.valoracionesRecibidasPagina = String(paginaRecibidas.value)
  if (limiteRecibidas.value !== 20) resultado.valoracionesRecibidasLimite = String(limiteRecibidas.value)
  if (paginaEscritas.value > 1) resultado.valoracionesEscritasPagina = String(paginaEscritas.value)
  if (limiteEscritas.value !== 20) resultado.valoracionesEscritasLimite = String(limiteEscritas.value)
  return resultado
}

function coincideQuery() {
  const esperado = query()
  return ['valoracionesRecibidasPagina', 'valoracionesRecibidasLimite', 'valoracionesEscritasPagina', 'valoracionesEscritasLimite'].every(
    (clave) => route.query[clave] === undefined || String(route.query[clave]) === String(esperado[clave])
  )
}

async function cargar() {
  if (!coincideQuery()) {
    await router.replace({ name: 'perfil', query: query() })
    return
  }

  await Promise.all([
    valoraciones.cargarRecibidas(session.usuario?.id, paginaRecibidas.value, limiteRecibidas.value),
    valoraciones.cargarEscritas(paginaEscritas.value, limiteEscritas.value)
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

function cambiarTamano(clavePagina, claveLimite, valor, defecto) {
  const nueva = { ...query() }
  delete nueva[clavePagina]
  if (valor === defecto) delete nueva[claveLimite]
  else nueva[claveLimite] = String(valor)
  router.push({ name: 'perfil', query: nueva })
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
    <SelectorTamanoPagina :model-value="limiteRecibidas" @update:model-value="cambiarTamano('valoracionesRecibidasPagina', 'valoracionesRecibidasLimite', $event, 20)" />
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
    <SelectorTamanoPagina :model-value="limiteEscritas" @update:model-value="cambiarTamano('valoracionesEscritasPagina', 'valoracionesEscritasLimite', $event, 20)" />
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
