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

async function cargar() {
  await Promise.all([
    valoraciones.cargarRecibidas(session.usuario?.id, paginaRecibidas.value, limiteRecibidas.value),
    valoraciones.cargarEscritas(paginaEscritas.value, limiteEscritas.value)
  ])
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
    <SelectorTamanoPagina :model-value="limiteRecibidas" @update:model-value="cambiar('valoracionesRecibidasLimite', $event, 20)" />
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
    <SelectorTamanoPagina :model-value="limiteEscritas" @update:model-value="cambiar('valoracionesEscritasLimite', $event, 20)" />
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
