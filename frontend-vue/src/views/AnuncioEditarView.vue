<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import AnuncioForm from '../components/anuncios/AnuncioForm.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { urlImagen } from '../services/media'
import { useNotificaciones } from '../services/notifications'
import { useAnunciosStore } from '../stores/anuncios'
import { useCategoriasStore } from '../stores/categorias'
import { useSessionStore } from '../stores/session'

const route = useRoute()
const router = useRouter()
const anuncios = useAnunciosStore()
const categorias = useCategoriasStore()
const session = useSessionStore()
const notificaciones = useNotificaciones()

const hayCambios = ref(false)
const errores = ref({})
const errorGeneral = ref('')
const enviando = ref(false)

const id = computed(() => Number(route.params.id))
const idValido = computed(() => Number.isInteger(id.value) && id.value > 0)
const detalle = computed(() => anuncios.detalle)
const esAutor = computed(
  () => detalle.value && session.usuario?.id === (detalle.value.id_autor ?? detalle.value.autor?.id)
)
const valoresIniciales = computed(() => ({
  titulo: detalle.value?.titulo ?? '',
  descripcion: detalle.value?.descripcion ?? '',
  precio: detalle.value?.precio !== undefined ? String(detalle.value.precio) : '',
  categoria: detalle.value?.id_categoria ?? detalle.value?.categoria?.id ?? null
}))
const imagenActualUrl = computed(() => urlImagen(detalle.value?.imagen))

async function cargar() {
  if (!idValido.value) {
    anuncios.limpiarDetalle()
    return
  }
  await Promise.all([anuncios.cargarDetalle(id.value), categorias.cargar()])
}

watch(
  () => route.params.id,
  cargar,
  { immediate: true }
)

onMounted(() => {
  categorias.cargar()
})

onBeforeRouteLeave(() => {
  if (hayCambios.value) {
    return window.confirm('Tienes cambios sin guardar. ¿Quieres salir?')
  }
  return true
})

function manejarError(error) {
  if (error.campo) {
    errores.value = { [error.campo]: error.mensaje }
  } else {
    errorGeneral.value = error.mensaje ?? 'No se pudo guardar el anuncio'
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
    const anuncio = await anuncios.actualizar(id.value, valores, imagen)
    hayCambios.value = false
    notificaciones.exito('Anuncio actualizado')
    await router.push({ name: 'anuncio-detalle', params: { id: anuncio.id } })
  } catch (error) {
    manejarError(error)
  } finally {
    enviando.value = false
  }
}

function cancelar() {
  if (hayCambios.value && !window.confirm('Tienes cambios sin guardar. ¿Quieres descartarlos?')) {
    return
  }
  hayCambios.value = false
  router.push({ name: 'anuncio-detalle', params: { id: id.value } })
}
</script>

<template>
  <section aria-labelledby="edit-title">
    <h1 id="edit-title" class="page-title">Editar anuncio</h1>

    <StatePanel
      v-if="!idValido"
      type="validation"
      title="Anuncio no válido"
      message="El identificador del anuncio no es válido"
    />

    <StatePanel
      v-else-if="anuncios.estadoDetalle === 'loading'"
      type="loading"
      message="Cargando el anuncio…"
    />

    <StatePanel
      v-else-if="anuncios.estadoDetalle === 'notfound'"
      type="empty"
      title="Anuncio no encontrado"
      message="El anuncio que quieres editar no existe"
    />

    <StatePanel
      v-else-if="anuncios.estadoDetalle === 'error'"
      type="error"
      title="No se pudo cargar el anuncio"
      :message="anuncios.errorDetalle?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <StatePanel
      v-else-if="detalle && !esAutor"
      type="permission"
      title="Sin permisos"
      message="Solo el autor puede editar este anuncio"
    />

    <AnuncioForm
      v-else-if="detalle && esAutor"
      modo="editar"
      :valores-iniciales="valoresIniciales"
      :imagen-actual="detalle.imagen"
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
