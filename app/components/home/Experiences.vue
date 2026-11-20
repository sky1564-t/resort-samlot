<script setup lang="ts">
import type { Experience } from '~/types/experience'

useHead({
  title: 'Experiences | Samlot Diamond Resort'
})

const { getExperiences } = useApi()

const { data: experiences, pending } = await useAsyncData<Experience[]>(
  'public-experiences',
  () => getExperiences(),
  {
    default: () => []
  }
)
</script>

<template>
  <div>
    <section class="relative h-[80vh] overflow-hidden">
      <img
        src="/picture/h2.jpg"
        alt="Experiences"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/50" />

      <div class="relative flex h-full items-center justify-center text-center text-white">
        <div>
          <p class="mb-4 uppercase tracking-[6px] text-[#D4AF37]">
            Discover
          </p>

          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            Experiences
          </h1>
        </div>
      </div>
    </section>

    <section class="bg-[#F8F7F4] py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-16 text-center">
          <h2 class="font-['Cinzel'] text-4xl md:text-5xl">
            More Than A Stay
          </h2>

          <p class="mx-auto mt-6 max-w-2xl text-neutral-600">
            Every experience is designed to help guests relax,
            explore and create unforgettable memories.
          </p>
        </div>

        <div v-if="pending" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="n in 6"
            :key="n"
            class="h-[420px] animate-pulse rounded-3xl bg-neutral-200"
          />
        </div>

        <div
          v-else-if="experiences.length"
          class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <article
            v-for="item in experiences"
            :key="item.id"
            class="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="h-[280px] w-full object-cover"
            >

            <div class="p-6">
              <h3 class="mb-4 font-['Cinzel'] text-2xl">
                {{ item.title }}
              </h3>

              <p class="text-neutral-600">
                {{ item.description }}
              </p>
            </div>
          </article>
        </div>

        <p v-else class="text-center text-neutral-500">
          Experiences will be available soon.
        </p>
      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 class="mb-6 font-['Cinzel'] text-4xl md:text-5xl">
          Ready For Your Adventure?
        </h2>

        <p class="mx-auto max-w-2xl text-neutral-600">
          Plan your escape to Samlot and enjoy nature,
          food, relaxation and unforgettable experiences.
        </p>

        <NuxtLink
          to="/booking"
          class="mt-10 inline-flex rounded-full bg-[#1D3527] px-8 py-4 text-white transition hover:bg-[#2b4e38]"
        >
          Book Your Stay
        </NuxtLink>
      </div>
    </section>
  </div>
</template>