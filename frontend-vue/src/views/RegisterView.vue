<script setup>
import AuthCard from '../components/auth/AuthCard.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
</script>

<template>
  <AuthCard title="Crear cuenta" subtitle="Regístrate para empezar a publicar anuncios.">
    <RegisterForm />
    <template #footer>
      <span>¿Ya tienes cuenta?</span>
      <RouterLink class="button button--secondary" :to="{ name: 'login' }">
        Iniciar sesión
      </RouterLink>
    </template>
  </AuthCard>
</template>
