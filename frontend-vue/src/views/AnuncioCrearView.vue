<script setup>
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import AnuncioForm from '../components/anuncios/AnuncioForm.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { useAnunciosStore } from '../stores/anuncios'
import { useCategoriasStore } from '../stores/categorias'
import { useSessionStore } from '../stores/session'
import { useNotificaciones } from '../services/notifications'

const anuncios = useAnunciosStore()
const categorias = useCategoriasStore()
const session = useSessionStore()
const router = useRouter()
const notificaciones = useNotificaciones()

const hayCambios = ref(false)
const errores = ref({})
const errorGeneral = ref('')
const enviando = ref(false)

onMounted(() => {
  categorias.cargar()
})

onBeforeRouteLeave(() => {
  if (hayCambios.value && session.estaAutenticado) {
    return window.confirm('Tienes cambios sin guardar. ¿Quieres salir?')
  }
  return true
})

function manejarError(error) {
  if (error.campo) {
    errores.value = { [error.campo]: error.mensaje }
  } else {
    errorGeneral.value = error.mensaje ?? 'No se pudo crear el anuncio'
  }
}

async function enviar({ valores, imagen }) {
  if (enviando.value) {
    return
  }

  enviando.value = true
  errores.value = {}
  errorGeneral.value = ''

  try {
    const anuncio = await anuncios.crear(valores, imagen)
    hayCambios.value = false
    notificaciones.exito('Anuncio creado')
    await router.push({ name: 'anuncio-detalle', params: { id: anuncio.id } })
  } catch (error) {
    manejarError(error)
  } finally {
    enviando.value = false
  }
}

function cancelar() {
  if (
    hayCambios.value &&
    session.estaAutenticado &&
    !window.confirm('Tienes cambios sin guardar. ¿Quieres descartarlos?')
  ) {
    return
  }
  hayCambios.value = false
  router.push({ name: 'anuncios' })
}
</script>

<template>
  <section aria-labelledby="create-title">
    <h1 id="create-title" class="page-title">Publicar anuncio</h1>

    <StatePanel
      v-if="categorias.error"
      type="error"
      title="No se pudieron cargar las categorías"
      message="Revisa la conexión e inténtalo de nuevo"
      retryable
      @retry="categorias.cargar"
    />

    <AnuncioForm
      v-else
      modo="crear"
      :categorias="categorias.items"
      :enviando="enviando"
      :errores-servidor="errores"
      :error-general="errorGeneral"
      @submit="enviar"
      @cancel="cancelar"
      @dirty-change="hayCambios = $event"
    />
  </section>
</template>
