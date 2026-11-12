<!-- <script setup lang="ts">
import type { Room } from '~/types/room'

useHead({
  title: 'Rooms & Suites | Samlot Diamond Resort'
})

const api = useApi()

const rooms = ref<Room[]>([])
const loading = ref(true)
const error = ref('')

try {
  const data: any = await api.getRooms()

  rooms.value = Array.isArray(data)
    ? data
    : data?.results || []
} catch (err: any) {
  console.error(err)

  error.value =
    err?.data?.detail ||
    'Failed to load rooms.'
} finally {
  loading.value = false
}
</script>

<template>
  <div>

    <section class="relative h-[55vh] min-h-[420px] overflow-hidden">
      <img
        src="/picture/43.jpg"
        alt="Rooms"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/45" />

      <div class="relative flex h-full items-center justify-center px-6 text-center text-white">
        <div>
          <p class="mb-4 text-sm uppercase tracking-[0.35em] text-[#d4af37]">
            Samlot Diamond Resort
          </p>

          <h1 class="font-serif text-5xl md:text-7xl">
            Rooms & Suites
          </h1>

          <p class="mx-auto mt-6 max-w-2xl text-white/80">
            Comfortable stays designed for relaxation, privacy and memorable experiences.
          </p>
        </div>
      </div>
    </section>



    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-6">

        <div class="mb-16 max-w-3xl">
          <h2 class="font-serif text-4xl">
            Choose Your Stay
          </h2>

          <p class="mt-4 text-neutral-600">
            Explore our collection of accommodations, from cozy rooms to spacious villas,
            each designed with comfort and simplicity in mind.
          </p>
        </div>

        <div
          v-if="loading"
          class="py-20 text-center text-neutral-500"
        >
          Loading accommodations...
        </div>

        <div
          v-else-if="error"
          class="py-20 text-center text-red-600"
        >
          {{ error }}
        </div>

        <div
          v-else
          class="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          <RoomsRoomCard
            v-for="room in rooms"
            :key="room.id"
            :room="room"
          />
        </div>

      </div>
    </section>
  </div>
</template> -->

<template>
  <RoomTest />
</template>