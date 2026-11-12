<template>
  <section class="bg-white py-24">
    <div class="mx-auto max-w-7xl px-6">

      <div class="mb-16 text-center">
        <p
          class="mb-3 font-['Cinzel']
          text-sm uppercase tracking-[6px]
          text-[#D4AF37]"
        >
          Testimonials
        </p>

        <h2
          class="font-['Cinzel']
          text-4xl md:text-5xl"
        >
          Guest Experiences
        </h2>
      </div>

      <div
        class="grid gap-8
        md:grid-cols-2
        lg:grid-cols-3"
      >

        <div
          v-for="item in testimonials"
          :key="item.name"
          class="rounded-3xl bg-[#F8F7F4] p-8"
        >
          <div class="mb-4 text-[#D4AF37]">
            ★★★★★
          </div>

          <p class="mb-6 text-neutral-600">
            "{{ item.comment }}"
          </p>

          <h4 class="font-semibold">
            {{ item.name }}
          </h4>

          <p class="text-sm text-neutral-500">
            {{ item.country }}
          </p>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    name: 'David',
    country: 'United Kingdom',
    comment:
      'One of the most beautiful resorts we visited in Cambodia.'
  },
  {
    name: 'Sophea',
    country: 'Cambodia',
    comment:
      'Amazing hospitality and peaceful environment.'
  },
  {
    name: 'Lisa',
    country: 'Germany',
    comment:
      'Perfect for family vacations and relaxation.'
  }
]
</script>