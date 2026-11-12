<script setup lang="ts">
useHead({
  title: 'Restaurant | Samlot Diamond Resort'
})

const dishes = [
  {
    title: 'Khmer Signature Cuisine',
    image: '/picture/f1.jpg',
    description: 'Traditional Cambodian flavors prepared with fresh local ingredients.'
  },
  {
    title: 'International Favorites',
    image: '/picture/f14.jpg',
    description: 'A selection of international dishes crafted for every guest.'
  },
  {
    title: 'Fresh Mountain Dining',
    image: '/picture/f20.jpg',
    description: 'Dining surrounded by beautiful natural scenery and fresh air.'
  }
]
</script>

<template>
  <div>
    <section class="relative h-[70vh] overflow-hidden">
      <img
        src="/picture/f21.jpg"
        alt="Restaurant"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative flex h-full items-center justify-center text-center text-white">
        <div>
          <p class="mb-4 font-['Cinzel'] uppercase tracking-[6px] text-[#D4AF37]">
            Dining Experience
          </p>

          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            Restaurant
          </h1>

          <p class="mx-auto mt-6 max-w-2xl text-white/80">
            Fresh ingredients, local flavors and unforgettable dining experiences.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-5xl px-6 text-center">

        <p class="mb-3 font-['Cinzel'] uppercase tracking-[6px] text-[#D4AF37]">
          Our Story
        </p>

        <h2 class="font-['Cinzel'] text-4xl md:text-5xl">
          Dining In Nature
        </h2>

        <p class="mx-auto mt-6 max-w-3xl leading-8 text-neutral-600">
          Enjoy carefully prepared meals inspired by local traditions and international cuisine while surrounded by the beauty of Samlot's mountains and forests.
        </p>

      </div>
    </section>

    <section class="bg-[#F8F7F4] py-24">
      <div class="mx-auto max-w-7xl px-6">

        <div class="grid gap-10 lg:grid-cols-3">

          <article
            v-for="dish in dishes"
            :key="dish.title"
            class="overflow-hidden rounded-3xl bg-white shadow-lg"
          >
            <img
              :src="dish.image"
              :alt="dish.title"
              class="h-[320px] w-full object-cover"
            >

            <div class="p-6">

              <h3 class="mb-4 font-['Cinzel'] text-2xl">
                {{ dish.title }}
              </h3>

              <p class="text-neutral-600">
                {{ dish.description }}
              </p>

            </div>

          </article>

        </div>

      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-4xl px-6 text-center">

        <h2 class="font-['Cinzel'] text-4xl md:text-5xl">
          Reserve A Table
        </h2>

        <p class="mt-6 text-neutral-600">
          Let us prepare a memorable dining experience during your stay.
        </p>

        <NuxtLink
          to="/contact"
          class="mt-8 inline-flex rounded-full bg-[#1D3527] px-8 py-4 text-white transition hover:bg-[#294b36]"
        >
          Contact Restaurant
        </NuxtLink>

      </div>
    </section>

  </div>
</template>