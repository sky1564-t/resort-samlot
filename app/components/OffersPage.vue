<script setup lang="ts">
useHead({
  title: 'Special Offers | Samlot Diamond Resort'
})

const offers = [
  {
    title: 'Romantic Escape',
    image: '/picture/4.jpg',
    price: '$299',
    description:
      'Perfect for couples with romantic room decoration, dinner and spa experience.'
  },
  {
    title: 'Family Adventure',
    image: '/picture/5.jpg',
    price: '$399',
    description:
      'Spacious accommodation, activities and dining for the entire family.'
  },
  {
    title: 'Weekend Retreat',
    image: '/picture/3.jpg',
    price: '$199',
    description:
      'A relaxing weekend surrounded by mountains and nature.'
  }
]
</script>

<template>
  <div>
    <section class="relative h-[60vh] overflow-hidden">
      <img
        src="/picture/43.jpg"
        alt="Special Offers"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative flex h-full items-center justify-center text-center text-white">
        <div>
          <p class="mb-4 font-['Cinzel'] uppercase tracking-[6px] text-[#D4AF37]">
            Exclusive
          </p>

          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            Special Offers
          </h1>

          <p class="mx-auto mt-5 max-w-2xl text-white/80">
            Discover exclusive packages designed for unforgettable stays.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-[#F8F7F4] py-24">
      <div class="mx-auto max-w-7xl px-6">

        <div class="grid gap-10 lg:grid-cols-3">

          <article
            v-for="offer in offers"
            :key="offer.title"
            class="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
          >
            <img
              :src="offer.image"
              :alt="offer.title"
              class="h-[320px] w-full object-cover"
            >

            <div class="p-6">

              <div class="mb-3 text-[#D4AF37] font-semibold">
                From {{ offer.price }}
              </div>

              <h2 class="mb-4 font-['Cinzel'] text-2xl">
                {{ offer.title }}
              </h2>

              <p class="mb-6 text-neutral-600">
                {{ offer.description }}
              </p>

              <NuxtLink
                to="/booking"
                class="inline-flex rounded-full bg-[#1D3527] px-6 py-3 text-white transition hover:bg-[#294b36]"
              >
                Book Offer
              </NuxtLink>

            </div>

          </article>

        </div>

      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-4xl px-6 text-center">

        <h2 class="font-['Cinzel'] text-4xl md:text-5xl">
          Need A Custom Package?
        </h2>

        <p class="mt-6 text-neutral-600">
          Contact our team and we can create a personalized experience for your stay.
        </p>

        <NuxtLink
          to="/contact"
          class="mt-8 inline-flex rounded-full bg-[#1D3527] px-8 py-4 text-white transition hover:bg-[#294b36]"
        >
          Contact Us
        </NuxtLink>

      </div>
    </section>
  </div>
</template>