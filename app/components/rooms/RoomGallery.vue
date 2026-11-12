<script setup lang="ts">
defineProps<{
  images?: {
    id: number
    image: string
  }[]
}>()
</script>

<template>
  <div
    v-if="images?.length"
    class="grid gap-4 md:grid-cols-2"
  >
    <img
      v-for="image in images"
      :key="image.id"
      :src="image.image"
      class="h-[300px] w-full rounded-2xl object-cover"
    >
  </div>
</template>