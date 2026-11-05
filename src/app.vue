<script setup>
const route = useRoute()
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
</script>

<template>
  <NavBarComponent v-if="!isDashboard" />
  <NuxtPage />
  <FooterComponent v-if="!isDashboard" />
</template>