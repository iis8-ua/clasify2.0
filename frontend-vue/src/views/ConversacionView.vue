<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HiloMensajes from '../components/mensajeria/HiloMensajes.vue'
import FormularioMensaje from '../components/mensajeria/FormularioMensaje.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useMensajesStore } from '../stores/mensajes'

const route = useRoute()
const router = useRouter()
const mensajes = useMensajesStore()
const cargandoAnteriores = ref(false)

const id = computed(() => Number(route.params.id))
const idValido = computed(() => Number.isInteger(id.value) && id.value > 0)
const pagina = computed(() => {
  const valor = Number(route.query.pagina)
  return Number.isInteger(valor) && valor >= 1 ? valor : 1
})
const conversacion = computed(
  () => mensajes.conversacionActual ?? mensajes.conversaciones.find((item) => item.id === id.value) ?? null
)

function query(paginaDestino = pagina.value) {
  return paginaDestino > 1 ? { pagina: String(paginaDestino) } : {}
}

async function cargar() {
  if (!idValido.value) {
    return
  }
  if (cargandoAnteriores.value) {
    cargandoAnteriores.value = false
    return
  }

  if (route.query.pagina !== undefined && String(pagina.value) !== String(route.query.pagina)) {
    await router.replace({ name: 'conversacion', params: { id: id.value }, query: query() })
    return
  }

  await Promise.all([
    mensajes.cargarConversacion(id.value),
    mensajes.cargarHilo(id.value, pagina.value)
  ])
  if (mensajes.errorHilo?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (mensajes.estadoHilo === 'error') {
    return
  }
  if (pagina.value > 1 && mensajes.paginacionHilo.paginas === 0) {
    await router.replace({ name: 'conversacion', params: { id: id.value }, query: query(1) })
    return
  }
  if (mensajes.paginacionHilo.paginas > 0 && pagina.value > mensajes.paginacionHilo.paginas) {
    await router.replace({ name: 'conversacion', params: { id: id.value }, query: query(mensajes.paginacionHilo.paginas) })
  }
}

watch(() => [route.params.id, route.query.pagina], cargar, { immediate: true })

async function cargarAnteriores() {
  const siguiente = pagina.value + 1
  await mensajes.cargarHilo(id.value, siguiente, { reemplazar: false })
  if (mensajes.estadoHilo !== 'error' && mensajes.errorHilo?.estado !== 404) {
    cargandoAnteriores.value = true
    await router.replace({ name: 'conversacion', params: { id: id.value }, query: query(siguiente) })
  }
}
</script>

<template>
  <section aria-labelledby="conversation-title">
    <h1 id="conversation-title" class="page-title">Conversación</h1>

    <p v-if="conversacion" class="conversation-header">
      <RouterLink :to="{ name: 'anuncio-detalle', params: { id: conversacion.anuncio.id } }">
        {{ conversacion.anuncio.titulo }}
      </RouterLink>
      · Con
      <RouterLink :to="{ name: 'perfil-publico', params: { id: conversacion.contraparte.id } }">
        {{ conversacion.contraparte.nombre }}
      </RouterLink>
    </p>

    <StatePanel v-if="!idValido" type="validation" title="Conversación no válida" message="El identificador no es válido" />
    <StatePanel v-else-if="mensajes.estadoHilo === 'loading'" type="loading" message="Cargando mensajes…" />
    <StatePanel
      v-else-if="mensajes.estadoHilo === 'notfound'"
      type="empty"
      title="Conversación no encontrada"
      message="La conversación no existe o ya no está disponible"
    />
    <StatePanel
      v-else-if="mensajes.errorHilo?.estado === 403"
      type="permission"
      title="Sin permisos"
      message="No participas en esta conversación"
    />
    <StatePanel
      v-else-if="mensajes.estadoHilo === 'error'"
      type="error"
      title="No se pudieron cargar los mensajes"
      :message="mensajes.errorHilo?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <template v-else-if="mensajes.estadoHilo === 'success' || mensajes.estadoHilo === 'empty'">
      <button
        v-if="mensajes.estadoHilo === 'success' && pagina < mensajes.paginacionHilo.paginas"
        type="button"
        class="button button--secondary message-thread__more"
        @click="cargarAnteriores"
      >
        Cargar mensajes anteriores
      </button>
      <HiloMensajes :mensajes="mensajes.hilo" />
      <FormularioMensaje :conversacion-id="id" />
    </template>
  </section>
</template>
