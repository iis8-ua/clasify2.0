<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <nav class="app-nav" aria-label="Navegación principal">
    <RouterLink
      v-for="item in items"
      :key="item.routeName"
      class="app-nav__link"
      active-class="app-nav__link--active"
      :to="{ name: item.routeName }"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
