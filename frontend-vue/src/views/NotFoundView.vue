<template>
  <section class="placeholder" aria-labelledby="not-found-title">
    <p class="placeholder__eyebrow">Error 404</p>
    <h1 id="not-found-title" class="page-title">Página no encontrada</h1>
    <p class="placeholder__message">
      La dirección solicitada no existe o ya no está disponible.
    </p>
    <RouterLink class="button" :to="{ name: 'anuncios' }">Volver al inicio</RouterLink>
  </section>
</template>
