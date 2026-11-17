<script setup>
import AuthCard from '../components/auth/AuthCard.vue'
import LoginForm from '../components/auth/LoginForm.vue'
</script>

<template>
  <AuthCard title="Iniciar sesión" subtitle="Accede para publicar y gestionar tus anuncios.">
    <LoginForm />
    <template #footer>
      <span>¿No tienes cuenta?</span>
      <RouterLink class="button button--secondary" :to="{ name: 'registro' }">
        Crear cuenta
      </RouterLink>
    </template>
  </AuthCard>
</template>
