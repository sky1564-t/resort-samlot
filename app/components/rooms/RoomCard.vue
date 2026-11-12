<script setup lang="ts">
import type { Room } from '~/types/room'

defineProps<{
  room: Room
}>()
</script>

<template>
  <article
    class="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <img
      src="/picture/34.jpg"
      :alt="room.name"
      class="h-[280px] w-full object-cover"
    >

    <div class="p-6">

      <div class="text-sm uppercase tracking-wide text-[#a8895b]">
        {{ room.category }}
      </div>

      <h3 class="mt-2 font-serif text-2xl">
        {{ room.name }}
      </h3>

      <p class="mt-4 line-clamp-3 text-neutral-600">
        {{ room.description }}
      </p>

      <div class="mt-6 flex items-center justify-between">

        <div>
          <div class="text-sm text-neutral-500">
            Starting from
          </div>

          <div class="font-serif text-3xl text-[#a8895b]">
            ${{ room.base_price }}
          </div>
        </div>

        <NuxtLink
          :to="`/rooms/${room.slug}`"
          class="rounded-full bg-[#151a18] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          View Room
        </NuxtLink>

      </div>

      <div class="mt-5 border-t pt-4 text-sm text-neutral-500">
        Up to {{ room.max_guests }} guests
      </div>

    </div>
  </article>
</template>