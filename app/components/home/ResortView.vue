<script setup lang="ts">
import { ref } from 'vue'

const isNight = ref(false)

const images = {
  day: {
    collage1: '/picture/31.jpg',
    collage2: '/picture/18.jpg',
    collage3: '/picture/19.jpg',
    bottom1: '/picture/21.jpg',
    bottom2: '/picture/22.jpg'
  },
  night: {
    collage1: '/picture/11.jpg',
    collage2: '/picture/12.jpg',
    collage3: '/picture/13.jpg',
    bottom1: '/picture/14.jpg',
    bottom2: '/picture/35.jpg'
  }
}
</script>

<template>
  <div
    :class="isNight ? 'bg-[#121413] text-gray-100' : 'bg-[#f9f8f6] text-gray-900'"
    class="relative min-h-screen w-full pb-32 transition-colors duration-1000"
  >
    <!-- Toggle -->

    <div
      class="absolute right-8 top-8 z-50 flex items-center gap-3 rounded-full border border-gray-500/30 bg-white/10 px-4 py-2 backdrop-blur-md"
    >
      <span
        class="text-xs font-semibold uppercase tracking-widest"
        :class="isNight ? 'text-gray-500' : 'text-gray-900'"
      >
        Day
      </span>

      <button
        class="relative h-6 w-12 rounded-full transition-colors duration-500"
        :class="isNight ? 'bg-green-700' : 'bg-gray-300'"
        @click="isNight = !isNight"
      >
        <span
          class="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-500"
          :class="isNight ? 'left-7' : 'left-1'"
        />
      </button>

      <span
        class="text-xs font-semibold uppercase tracking-widest"
        :class="isNight ? 'text-white' : 'text-gray-400'"
      >
        Night
      </span>
    </div>

    <!-- Top -->

    <div class="mx-auto max-w-7xl px-4 pt-32 md:px-8">

      <div class="max-w-2xl md:pr-12">
        <h2 class="mb-6 text-4xl font-serif leading-tight md:text-5xl">
          We understood slow living, before it became a trend.
        </h2>

        <p class="text-sm leading-relaxed opacity-70 md:text-base">
          Everything tastes better, smells distinctly, and draws more
          attention here. In the mountains, we live slowly and don't
          look back.
        </p>
      </div>

      <div class="relative ml-auto mt-12 w-full md:-mt-10 md:w-3/4">

        <div class="relative z-10 mt-12 grid grid-cols-3 items-end gap-2 md:gap-4">

          <div class="relative aspect-[3/4] overflow-hidden">
            <img
              :src="images.day.collage1"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-0' : 'opacity-100'"
            >
            <img
              :src="images.night.collage1"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-100' : 'opacity-0'"
            >
          </div>

          <div class="relative mb-8 aspect-[3/4] overflow-hidden">
            <img
              :src="images.day.collage2"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-0' : 'opacity-100'"
            >
            <img
              :src="images.night.collage2"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-100' : 'opacity-0'"
            >
          </div>

          <div class="relative aspect-[4/3] overflow-hidden">
            <img
              :src="images.day.collage3"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-0' : 'opacity-100'"
            >
            <img
              :src="images.night.collage3"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-100' : 'opacity-0'"
            >
          </div>

        </div>

      </div>

    </div>

    <!-- Bottom -->

    <div class="mx-auto mt-32 max-w-7xl px-4 md:mt-48 md:px-8">

      <h2 class="mx-auto mb-20 max-w-4xl text-center font-serif text-3xl leading-tight md:text-4xl">
        One day we wanted to create a place in the mountains where
        you can feel this climate on your own skin.
      </h2>

      <div class="grid items-center gap-12 md:grid-cols-2 lg:gap-24">

        <div class="mt-12 grid grid-cols-2 gap-4">

          <div class="relative aspect-[3/5] overflow-hidden">
            <img
              :src="images.day.bottom1"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-0' : 'opacity-100'"
            >
            <img
              :src="images.night.bottom1"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-100' : 'opacity-0'"
            >
          </div>

          <div class="relative mt-12 aspect-[4/5] overflow-hidden">
            <img
              :src="images.day.bottom2"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-0' : 'opacity-100'"
            >
            <img
              :src="images.night.bottom2"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
              :class="isNight ? 'opacity-100' : 'opacity-0'"
            >
          </div>

        </div>

        <div class="max-w-lg">

          <p class="mb-10 text-sm leading-relaxed opacity-70">
            We invite you to our secluded resort. Every moment is designed
            to connect you deeply with nature.
          </p>

          <NuxtLink
            to="/rooms"
            class="inline-block rounded border px-8 py-3 text-xs font-bold uppercase tracking-widest transition"
            :class="
              isNight
                ? 'border-gray-500 text-gray-200 hover:bg-white hover:text-black'
                : 'border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white'
            "
          >
            See Cabin Details
          </NuxtLink>

        </div>

      </div>

    </div>

  </div>
</template>