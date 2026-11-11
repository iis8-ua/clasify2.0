<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HiloMensajes from '../components/mensajeria/HiloMensajes.vue'
import FormularioMensaje from '../components/mensajeria/FormularioMensaje.vue'
import SelectorTamanoPagina from '../components/catalog/SelectorTamanoPagina.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useMensajesStore } from '../stores/mensajes'
import { TAMANOS_PAGINA } from '../router/catalogQuery'

const route = useRoute()
const router = useRouter()
const mensajes = useMensajesStore()
const pagina = ref(1)

const id = computed(() => Number(route.params.id))
const idValido = computed(() => Number.isInteger(id.value) && id.value > 0)
const limite = computed(() => {
  const valor = Number(route.query.limite)
  return TAMANOS_PAGINA.includes(valor) ? valor : 20
})
const conversacion = computed(() =>
  mensajes.conversaciones.find((item) => item.id === id.value) ?? null
)

async function cargar() {
  if (!idValido.value) {
    return
  }
  if (route.query.limite !== undefined && String(limite.value) !== String(route.query.limite)) {
    await router.replace({ name: 'conversacion', params: { id: id.value }, query: limite.value !== 20 ? { limite: String(limite.value) } : {} })
    return
  }
  pagina.value = 1
  await mensajes.cargarHilo(id.value, 1, limite.value)
  if (mensajes.errorHilo?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: route.fullPath } })
  }
}

watch(() => [route.params.id, route.query.limite], cargar, { immediate: true })

async function cargarAnteriores() {
  const siguiente = pagina.value + 1
  await mensajes.cargarHilo(id.value, siguiente, limite.value, { reemplazar: false })
  if (mensajes.estadoHilo !== 'error') {
    pagina.value = siguiente
  }
}

function cambiarTamano(nuevoLimite) {
  router.push({
    name: 'conversacion',
    params: { id: id.value },
    query: nuevoLimite !== 20 ? { limite: String(nuevoLimite) } : {}
  })
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
      <div class="catalog-pagination__row">
        <SelectorTamanoPagina :model-value="limite" @update:model-value="cambiarTamano" />
      </div>
      <FormularioMensaje :conversacion-id="id" />
    </template>
  </section>
</template>
