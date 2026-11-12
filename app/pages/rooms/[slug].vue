<script setup lang="ts">
import type { RoomDetail } from '~/types/room'

const api = useApi()
const route = useRoute()

const room = ref<RoomDetail | null>(null)

const { pending, error } = await useAsyncData(
  `room-${route.params.slug}`,
  async () => {
    return await api.getRoom(
      route.params.slug as string
    )
  }
)

watchEffect(() => {
  if ((pending.value === false) && !error.value) {
    room.value = (useNuxtData(
      `room-${route.params.slug}`
    ).data.value ?? null) as RoomDetail | null
  }
})

useHead(() => ({
  title: room.value
    ? `${room.value.name} | Samlot Diamond Resort`
    : 'Room Details'
}))
const heroImage = computed(() => {
  return room.value?.images?.[0]?.image || null
})
</script>

<template>
  <div>

    <div
      v-if="pending"
      class="flex min-h-[60vh] items-center justify-center"
    >
      Loading...
    </div>

    <div
      v-else-if="error"
      class="flex min-h-[60vh] items-center justify-center"
    >
      <p class="text-red-600">
        Unable to load room.
      </p>
    </div>

    <template v-else-if="room">

      <!-- Hero -->

      <section class="relative h-[70vh] overflow-hidden">
      <img
        v-if="heroImage"
        :src="heroImage"
        :alt="room.name"
        class="absolute inset-0 h-full w-full object-cover"
      />

        <img
          v-else
          src="/picture/34.jpg"
          :alt="room.name"
          class="absolute inset-0 h-full w-full object-cover"
        >

        <div class="absolute inset-0 bg-black/45" />

        <div class="relative flex h-full items-center justify-center px-6 text-center text-white">
          <div>

            <p class="mb-4 text-sm uppercase tracking-[0.35em] text-[#d4af37]">
              Accommodation
            </p>

            <h1 class="font-serif text-5xl md:text-7xl">
              {{ room.name }}
            </h1>

          </div>
        </div>
      </section>

      <!-- Content -->

      <section class="bg-white py-20">
        <div class="mx-auto max-w-7xl px-6">

          <div class="grid gap-16 lg:grid-cols-[2fr_380px]">

            <!-- Main -->

            <div>

              <h2 class="font-serif text-4xl">
                About This Room
              </h2>

              <p class="mt-6 leading-8 text-neutral-600">
                {{ room.description }}
              </p>

              <!-- Gallery -->

              <div
                v-if="room.images.length"
                class="mt-14 grid gap-4 md:grid-cols-2"
              >
                <img
                  v-for="image in room.images"
                  :key="image.id"
                  :src="image.image"
                  :alt="room.name"
                  class="h-[280px] w-full rounded-2xl object-cover"
                >
              </div>

              <!-- Amenities -->

              <div
                v-if="room.amenities.length"
                class="mt-16"
              >
                <h3 class="font-serif text-3xl">
                  Amenities
                </h3>

                <div class="mt-8 grid gap-4 sm:grid-cols-2">
                  <div
                    v-for="amenity in room.amenities"
                    :key="amenity.id"
                    class="rounded-xl border border-neutral-200 p-4"
                  >
                    {{ amenity.name }}
                  </div>
                </div>
              </div>

            </div>

            <!-- Sidebar -->

            <RoomsRoomSidebar
              :room="room"
            />
          </div>

        </div>
      </section>

    </template>

  </div>
</template>