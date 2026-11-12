<script setup lang="ts">
useHead({
  title: 'Experiences | Samlot Diamond Resort'
})

const experiences = [
  {
    title: 'Nature Retreat',
    image: '/picture/31.jpg',
    description:
      'Disconnect from busy city life and reconnect with nature.'
  },
  {
    title: 'Swimming Pool',
    image: '/picture/21.jpg',
    description:
      'Relax beside the pool while enjoying mountain views.'
  },
  {
    title: 'Restaurant Dining',
    image: '/picture/f1.jpg',
    description:
      'Enjoy local and international cuisine prepared fresh daily.'
  },
  {
    title: 'Family Activities',
    image: '/picture/22.jpg',
    description:
      'Fun activities designed for families and groups.'
  },
  {
    title: 'Photography Tours',
    image: '/picture/18.jpg',
    description:
      'Capture beautiful landscapes, sunsets and natural scenery.'
  },
  {
    title: 'Mountain Exploration',
    image: '/picture/19.jpg',
    description:
      'Explore trails and discover the beauty of Samlot.'
  }
]
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

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          <article
            v-for="item in experiences"
            :key="item.title"
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