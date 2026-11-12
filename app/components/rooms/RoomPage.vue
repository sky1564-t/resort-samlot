<script setup lang="ts">
import type { RoomDetail } from '~/types/room'

defineProps<{
  room: RoomDetail
}>()
</script>

<template>
  <div>

    <section class="relative h-[70vh] overflow-hidden">
      <img
        src="/picture/34.jpg"
        :alt="room.name"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative flex h-full items-center justify-center text-center text-white">
        <div>

          <p class="mb-4 uppercase tracking-[6px] text-[#D4AF37]">
            Luxury Accommodation
          </p>

          <h1 class="font-serif text-5xl md:text-7xl">
            {{ room.name }}
          </h1>

        </div>
      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-7xl px-6">

        <div class="grid gap-12 lg:grid-cols-[2fr_1fr]">

          <div>

            <h2 class="mb-6 font-serif text-4xl">
              About This Room
            </h2>

            <p class="mb-10 leading-8 text-neutral-600">
              {{ room.description }}
            </p>

            <RoomsRoomGallery
              :images="room.images"
            />

            <div class="mt-12">
              <RoomsRoomAmenities
                :amenities="room.amenities"
              />
            </div>

          </div>

          <RoomsRoomSidebar
            :room="room"
          />

        </div>

      </div>
    </section>

  </div>
</template>