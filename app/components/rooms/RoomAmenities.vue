<script setup lang="ts">
defineProps<{
  amenities?: string[]
}>()
</script>

<template>
  <div v-if="amenities?.length">
    <h2 class="mb-6 font-serif text-3xl">
      Amenities
    </h2>

    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="amenity in amenities"
        :key="amenity"
        class="rounded-xl bg-[#F8F7F4] p-4"
      >
        {{ amenity }}
      </div>
    </div>
  </div>
</template>