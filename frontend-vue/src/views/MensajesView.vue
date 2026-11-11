<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TarjetaConversacion from '../components/mensajeria/TarjetaConversacion.vue'
import PaginacionCatalogo from '../components/catalog/PaginacionCatalogo.vue'
import SelectorTamanoPagina from '../components/catalog/SelectorTamanoPagina.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useMensajesStore } from '../stores/mensajes'
import { TAMANOS_PAGINA } from '../router/catalogQuery'

const route = useRoute()
const router = useRouter()
const mensajes = useMensajesStore()

const pagina = computed(() => {
  const valor = Number(route.query.pagina)
  return Number.isInteger(valor) && valor >= 1 ? valor : 1
})

const limite = computed(() => {
  const valor = Number(route.query.limite)
  return TAMANOS_PAGINA.includes(valor) ? valor : 20
})

async function cargar() {
  const query = {}
  if (pagina.value > 1) {
    query.pagina = String(pagina.value)
  }
  if (limite.value !== 20) {
    query.limite = String(limite.value)
  }
  const paginaEnUrl = route.query.pagina === undefined || String(pagina.value) === String(route.query.pagina)
  const limiteEnUrl = route.query.limite === undefined || String(limite.value) === String(route.query.limite)
  if (!paginaEnUrl || !limiteEnUrl) {
    await router.replace({ name: 'mensajes', query })
    return
  }

  await mensajes.cargarConversaciones(pagina.value, limite.value)
  if (mensajes.estado === 'error') {
    return
  }
  if (pagina.value > 1 && mensajes.paginacion.paginas === 0) {
    await router.replace({ name: 'mensajes', query: limite.value !== 20 ? { limite: String(limite.value) } : {} })
    return
  }
  if (mensajes.paginacion.paginas > 0 && pagina.value > mensajes.paginacion.paginas) {
    const corregida = { pagina: String(mensajes.paginacion.paginas) }
    if (limite.value !== 20) {
      corregida.limite = String(limite.value)
    }
    await router.replace({ name: 'mensajes', query: corregida })
  }
}

watch(() => route.query, cargar, { immediate: true, deep: true })

function cambiarPagina(nuevaPagina) {
  const query = nuevaPagina > 1 ? { pagina: String(nuevaPagina) } : {}
  if (limite.value !== 20) {
    query.limite = String(limite.value)
  }
  router.push({ name: 'mensajes', query })
}

function cambiarTamano(nuevoLimite) {
  router.push({ name: 'mensajes', query: nuevoLimite !== 20 ? { limite: String(nuevoLimite) } : {} })
}
</script>

<template>
  <section aria-labelledby="messages-title">
    <h1 id="messages-title" class="page-title">Mensajes</h1>

    <StatePanel v-if="mensajes.estado === 'loading'" type="loading" message="Cargando conversaciones…" />

    <StatePanel
      v-else-if="mensajes.estado === 'error'"
      type="error"
      title="No se pudieron cargar los mensajes"
      :message="mensajes.error?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <StatePanel
      v-else-if="mensajes.estado === 'empty'"
      type="empty"
      title="Sin conversaciones"
      message="Todavía no has hablado con nadie"
      action-label="Explorar anuncios"
      @action="router.push({ name: 'anuncios' })"
    />

    <template v-else-if="mensajes.estado === 'success'">
      <div class="conversation-list">
        <TarjetaConversacion
          v-for="conversacion in mensajes.conversaciones"
          :key="conversacion.id"
          :conversacion="conversacion"
        />
      </div>
      <div class="catalog-pagination__row">
        <SelectorTamanoPagina :model-value="limite" @update:model-value="cambiarTamano" />
        <PaginacionCatalogo
          :pagina="mensajes.paginacion.pagina"
          :paginas="mensajes.paginacion.paginas"
          aria-label="Paginación de mensajes"
          @cambiar="cambiarPagina"
        />
      </div>
    </template>
  </section>
</template>
