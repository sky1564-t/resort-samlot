<template>
  <section
    class="bg-white py-24"
  >
    <div
      class="mx-auto max-w-7xl px-6"
    >

      <!-- Header -->

      <div
        class="mb-16 text-center"
      >
        <p
          class="mb-3 font-['Cinzel'] text-sm uppercase tracking-[6px] text-[#D4AF37]"
        >
          Experiences
        </p>

        <h2
          class="font-['Cinzel'] text-4xl md:text-5xl"
        >
          More Than A Stay
        </h2>

        <p
          class="mx-auto mt-5 max-w-2xl text-neutral-600"
        >
          Discover unforgettable experiences designed
          for relaxation, adventure and connection
          with nature.
        </p>
      </div>

      <!-- Grid -->

      <div
        class="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
      >

        <div
          v-for="item in experiences"
          :key="item.title"
          class="group overflow-hidden rounded-3xl bg-[#F8F7F4] shadow transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
        >
          <div
            class="h-[260px] overflow-hidden"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            >
          </div>

          <div
            class="p-6"
          >
            <h3
              class="mb-3 font-['Cinzel'] text-2xl"
            >
              {{ item.title }}
            </h3>

            <p
              class="text-sm leading-relaxed text-neutral-600"
            >
              {{ item.description }}
            </p>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const experiences = [
  {
    title: 'Nature Retreat',
    image: '/picture/experience-nature.jpg',
    description:
      'Relax among beautiful landscapes, fresh air and peaceful surroundings.'
  },

  {
    title: 'Infinity Pool',
    image: '/picture/experience-pool.jpg',
    description:
      'Enjoy stunning views while relaxing in our resort swimming pool.'
  },

  {
    title: 'Restaurant & Dining',
    image: '/picture/experience-restaurant.jpg',
    description:
      'Taste local and international cuisine prepared with fresh ingredients.'
  },

  {
    title: 'Outdoor Activities',
    image: '/picture/experience-activity.jpg',
    description:
      'Explore nature trails, family activities and memorable adventures.'
  }
]
</script>