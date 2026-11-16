<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TarjetaConversacion from '../components/mensajeria/TarjetaConversacion.vue'
import PaginacionCatalogo from '../components/catalog/PaginacionCatalogo.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useMensajesStore } from '../stores/mensajes'

const route = useRoute()
const router = useRouter()
const mensajes = useMensajesStore()

const pagina = computed(() => {
  const valor = Number(route.query.pagina)
  return Number.isInteger(valor) && valor >= 1 ? valor : 1
})


async function cargar() {
  if (route.query.pagina !== undefined && String(pagina.value) !== String(route.query.pagina)) {
    await router.replace({
      name: 'mensajes',
      query: pagina.value > 1 ? { pagina: String(pagina.value) } : {}
    })
    return
  }

  await mensajes.cargarConversaciones(pagina.value)
  if (mensajes.estado === 'error') {
    return
  }
  if (pagina.value > 1 && mensajes.paginacion.paginas === 0) {
    await router.replace({ name: 'mensajes', query: {} })
    return
  }
  if (mensajes.paginacion.paginas > 0 && pagina.value > mensajes.paginacion.paginas) {
    await router.replace({
      name: 'mensajes',
      query: { pagina: String(mensajes.paginacion.paginas) }
    })
  }
}

watch(() => route.query, cargar, { immediate: true, deep: true })

function cambiarPagina(nuevaPagina) {
  router.push({
    name: 'mensajes',
    query: nuevaPagina > 1 ? { pagina: String(nuevaPagina) } : {}
  })
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
      <PaginacionCatalogo
        :pagina="mensajes.paginacion.pagina"
        :paginas="mensajes.paginacion.paginas"
        aria-label="Paginación de mensajes"
        @cambiar="cambiarPagina"
      />
    </template>
  </section>
</template>
