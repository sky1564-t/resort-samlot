<script setup lang="ts">
useHead({
  title: 'Events & Weddings | Samlot Diamond Resort'
})

const events = [
  {
    title: 'Wedding Ceremony',
    image: '/picture/4.jpg',
    description: 'Celebrate your special day surrounded by nature and beautiful mountain views.'
  },
  {
    title: 'Corporate Retreat',
    image: '/picture/5.jpg',
    description: 'Team building, meetings and unforgettable experiences for your organization.'
  },
  {
    title: 'Birthday Celebration',
    image: '/picture/3.jpg',
    description: 'Create lasting memories with family and friends.'
  }
]
</script>

<template>
  <div>

    <section class="relative h-[70vh] overflow-hidden">
      <img
        src="/picture/43.jpg"
        alt="Events"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative flex h-full items-center justify-center text-center text-white">
        <div>
          <p class="mb-4 font-['Cinzel'] uppercase tracking-[6px] text-[#D4AF37]">
            Celebrate
          </p>

          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            Events & Weddings
          </h1>

          <p class="mx-auto mt-6 max-w-2xl text-white/80">
            Create unforgettable memories in one of Cambodia's most beautiful natural destinations.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-7xl px-6">

        <div class="mb-16 text-center">
          <h2 class="font-['Cinzel'] text-4xl md:text-5xl">
            Special Events
          </h2>

          <p class="mx-auto mt-6 max-w-2xl text-neutral-600">
            From intimate celebrations to large gatherings, our resort offers unique event experiences.
          </p>
        </div>

        <div class="grid gap-10 lg:grid-cols-3">

          <article
            v-for="event in events"
            :key="event.title"
            class="overflow-hidden rounded-3xl bg-[#F8F7F4] shadow-lg"
          >
            <img
              :src="event.image"
              :alt="event.title"
              class="h-[320px] w-full object-cover"
            >

            <div class="p-6">
              <h3 class="mb-4 font-['Cinzel'] text-2xl">
                {{ event.title }}
              </h3>

              <p class="mb-6 text-neutral-600">
                {{ event.description }}
              </p>

              <NuxtLink
                to="/contact"
                class="inline-flex rounded-full bg-[#1D3527] px-6 py-3 text-white transition hover:bg-[#2b4e38]"
              >
                Inquire Now
              </NuxtLink>
            </div>

          </article>

        </div>

      </div>
    </section>

    <section class="bg-[#F8F7F4] py-24">
      <div class="mx-auto max-w-5xl px-6 text-center">

        <h2 class="font-['Cinzel'] text-4xl md:text-5xl">
          Plan Your Event
        </h2>

        <p class="mx-auto mt-6 max-w-3xl text-neutral-600 leading-8">
          Our dedicated team will help organize weddings, corporate events, birthdays and private celebrations tailored to your needs.
        </p>

        <NuxtLink
          to="/contact"
          class="mt-10 inline-flex rounded-full bg-[#1D3527] px-8 py-4 text-white transition hover:bg-[#2b4e38]"
        >
          Contact Event Team
        </NuxtLink>

      </div>
    </section>

  </div>
</template>