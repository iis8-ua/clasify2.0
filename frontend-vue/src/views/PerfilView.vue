<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import CambioContrasenaForm from '../components/perfil/CambioContrasenaForm.vue'
import MisAnunciosSection from '../components/perfil/MisAnunciosSection.vue'
import MisValoracionesSection from '../components/valoraciones/MisValoracionesSection.vue'
import PerfilDatos from '../components/perfil/PerfilDatos.vue'
import PerfilForm from '../components/perfil/PerfilForm.vue'
import StatePanel from '../components/states/StatePanel.vue'
import { esErrorDeSesion } from '../services/errors'
import { useNotificaciones } from '../services/notifications'
import { usePerfilStore } from '../stores/perfil'
import { useSessionStore } from '../stores/session'

const perfil = usePerfilStore()
const session = useSessionStore()
const router = useRouter()
const notificaciones = useNotificaciones()

const hayCambios = ref(false)
const guardando = ref(false)
const errores = ref({})
const errorGeneral = ref('')

const cargando = computed(
  () => perfil.estadoPerfil === 'idle' || perfil.estadoPerfil === 'loading'
)

onMounted(() => {
  cargar()
  window.addEventListener('beforeunload', avisarAntesDeCerrar)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', avisarAntesDeCerrar)
})

onBeforeRouteLeave(() => {
  if (hayCambios.value && session.estaAutenticado) {
    return window.confirm('Tienes cambios sin guardar. ¿Quieres salir?')
  }
  return true
})

function avisarAntesDeCerrar(event) {
  if (hayCambios.value && session.estaAutenticado) {
    event.preventDefault()
    event.returnValue = ''
  }
}

async function cargar() {
  await perfil.cargarPerfil()

  if (perfil.errorPerfil?.estado === 401) {
    await router.push({ name: 'login', query: { redirect: '/perfil' } })
  }
}

function actualizarCambios(valor) {
  hayCambios.value = valor
}

function limpiarErrores() {
  errores.value = {}
  errorGeneral.value = ''
}

async function guardar(cambios) {
  guardando.value = true
  errores.value = {}
  errorGeneral.value = ''

  try {
    const actualizado = await perfil.actualizarPerfil(cambios)
    if (!actualizado) {
      return
    }
    hayCambios.value = false
    notificaciones.exito('Perfil actualizado')
  } catch (error) {
    if (error.estado === 401 || esErrorDeSesion(error.codigo)) {
      hayCambios.value = false
      await router.push({ name: 'login', query: { redirect: '/perfil' } })
      return
    }

    if (error.campo) {
      errores.value = { [error.campo]: error.mensaje }
    } else {
      errorGeneral.value = error.mensaje ?? 'No se pudo actualizar el perfil'
    }
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <section aria-labelledby="perfil-title">
    <div class="perfil-heading">
      <h1 id="perfil-title" class="page-title">Mi perfil</h1>
      <RouterLink
        v-if="session.usuario"
        class="button button--secondary"
        :to="{ name: 'perfil-publico', params: { id: session.usuario.id } }"
      >
        Ver mi perfil público
      </RouterLink>
    </div>

    <StatePanel
      v-if="cargando"
      type="loading"
      message="Cargando tu perfil…"
    />

    <StatePanel
      v-else-if="perfil.estadoPerfil === 'error'"
      type="error"
      title="No se pudo cargar el perfil"
      :message="perfil.errorPerfil?.mensaje ?? 'Revisa la conexión e inténtalo de nuevo'"
      retryable
      @retry="cargar"
    />

    <div v-else-if="perfil.perfil" class="perfil-layout">
      <PerfilDatos :perfil="perfil.perfil" />

      <PerfilForm
        :perfil="perfil.perfil"
        :guardando="guardando"
        :errores-servidor="errores"
        :error-general="errorGeneral"
        @submit="guardar"
        @dirty-change="actualizarCambios"
        @discard="limpiarErrores"
      />

      <CambioContrasenaForm />

      <MisValoracionesSection />

      <MisAnunciosSection />
    </div>
  </section>
</template>
