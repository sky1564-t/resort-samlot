<script setup lang="ts">
useHead({ title: 'About – Samlot Diamond Resort' })

// Replace these paths with your own photos in /public/picture
const gallery = [
  { src: '/picture/1.jpg', alt: 'Resort villa surrounded by forest' },
  { src: '/picture/3.jpg', alt: 'Mountain view from the terrace' },
  { src: '/picture/4.jpg', alt: 'Dining area at sunset' },
]

const highlights = [
  { title: 'Forest and mountain views', text: 'Every room faces the hills of Samlot, so you wake up to the view you came for.' },
  { title: 'Rooms built with local materials', text: 'Timber, stone and woven details made by craftspeople from Battambang.' },
  { title: 'Slow, quiet days', text: 'Walks, a long breakfast, an afternoon by the pool. We keep the schedule open.' },
  { title: 'Hosts who know the area', text: 'Our team can plan treks, village visits and trips to nearby landmarks for you.' },
]

const facts = [
  { value: '24', label: 'Private rooms and villas' },
  { value: '8 AM–8 PM', label: 'Reservation desk, every day' },
  { value: '45 min', label: 'Drive from Battambang city' },
]
</script>

<template>
  <div class="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
    <!-- Hero -->
    <section class="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      <img
        src="/picture/43.jpg"
        alt="Samlot Diamond Resort among forest and mountains"
        class="hero-image fade absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-black/45" />
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 class="font-serif text-4xl md:text-6xl">About Samlot Diamond Resort</h1>
        <p class="mt-3 max-w-xl text-white/80">A quiet place to stay, set between the forest and the mountain.</p>
      </div>
    </section>

    <!-- Story -->
    <section class="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:py-24">
      <h2 class="font-serif text-3xl leading-tight md:text-4xl">
        We built the resort to
        <em class="block">keep the view the way it is</em>
      </h2>
      <div class="space-y-4 text-neutral-600 dark:text-neutral-400">
        <p>
          Samlot Diamond Resort sits in Battambang province, where the hills rise straight out of the
          farmland. We chose the site for the light in the morning and the quiet at night.
        </p>
        <p>
          The buildings are low and spread out, so the trees stay and the mountain stays visible from
          every room. We want guests to leave rested, and to remember the place.
        </p>
        <p>
          Whether you come for a weekend, a wedding or a team retreat, we handle the details so you
          can spend your time outside.
        </p>
      </div>
    </section>

    <!-- Facts -->
    <section class="border-y border-neutral-200 dark:border-neutral-800">
      <dl class="mx-auto grid max-w-5xl gap-8 px-5 py-10 text-center sm:grid-cols-3">
        <div v-for="f in facts" :key="f.label">
          <dd class="font-serif text-4xl text-[#a8895b]">{{ f.value }}</dd>
          <dt class="mt-1 text-sm text-neutral-500">{{ f.label }}</dt>
        </div>
      </dl>
    </section>

    <!-- Highlights -->
    <section class="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <h2 class="font-serif text-3xl md:text-4xl">What to expect when you stay</h2>
      <div class="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        <div v-for="h in highlights" :key="h.title" class="border-l-2 border-[#a8895b] pl-5">
          <h3 class="text-lg font-medium">{{ h.title }}</h3>
          <p class="mt-1 text-neutral-600 dark:text-neutral-400">{{ h.text }}</p>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="mx-auto max-w-5xl px-5 pb-16 md:pb-24">
      <div class="grid gap-3 md:grid-cols-3">
        <img
          v-for="(g, i) in gallery"
          :key="g.src"
          :src="g.src"
          :alt="g.alt"
          loading="lazy"
          :class="['h-64 w-full rounded object-cover md:h-80', i === 1 ? 'md:mt-8' : '']"
        />
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[#151a18] px-5 py-16 text-center text-white">
      <h2 class="font-serif text-3xl md:text-4xl">Ready to plan your stay?</h2>
      <p class="mx-auto mt-3 max-w-md text-white/70">Tell us your dates and we will reply with available rooms.</p>
      <NuxtLink
        to="/contact"
        class="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-90"
      >
        Contact us
      </NuxtLink>
    </section>
  </div>
</template>