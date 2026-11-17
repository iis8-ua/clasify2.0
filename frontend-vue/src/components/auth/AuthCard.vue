<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <section class="auth-card" aria-labelledby="auth-card-title">
    <p class="placeholder__eyebrow">Clasify</p>
    <h1 id="auth-card-title" class="page-title">{{ title }}</h1>
    <p v-if="subtitle" class="auth-card__subtitle">{{ subtitle }}</p>
    <slot />
    <div class="auth-card__footer">
      <slot name="footer" />
    </div>
  </section>
</template>
