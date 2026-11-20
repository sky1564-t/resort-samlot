<script setup lang="ts">
useHead({
  title: 'Events & Celebrations | Samlot Diamond Resort'
})

interface ResortEvent {
  id: number
  title: string
  category: string
  description: string
  event_date: string | null
  capacity: string
  image: string
  is_active: boolean
}

const { getEvents, getHeroByPage } = useApi()

const { data: hero } = await useAsyncData('hero-events', async () => {
  try {
    return await getHeroByPage('events')
  } catch {
    return null
  }
})

const { data: events, pending } = await useAsyncData<ResortEvent[]>(
  'public-events',
  async () => {
    const res: any = await getEvents()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] text-neutral-900">
    <!-- Hero -->
    <section class="relative h-[75vh] overflow-hidden bg-neutral-950">
      <img
        :src="hero?.background_image || '/picture/22.jpg'"
        :alt="hero?.title || 'Events & Celebrations'"
        class="absolute inset-0 h-full w-full object-cover opacity-80"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/30" />

      <div class="relative flex h-full items-center justify-center px-6 text-center text-white">
        <div class="max-w-3xl">
          <p class="mb-4 text-xs uppercase tracking-[6px] text-[#D4AF37]">
            {{ hero?.eyebrow || 'Weddings • Retreats • Gatherings' }}
          </p>
          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            {{ hero?.title || 'Events & Celebrations' }}
          </h1>
          <p class="mx-auto mt-6 max-w-xl text-sm text-white/80 md:text-base">
            {{ hero?.description || 'Host unforgettable weddings, corporate retreats, and private celebrations surrounded by the tranquil mountains of Samlot.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Events Showcase -->
    <section class="mx-auto max-w-7xl px-6 py-24">
      <div v-if="pending" class="space-y-12">
        <div v-for="n in 3" :key="n" class="h-80 animate-pulse rounded-3xl bg-neutral-200" />
      </div>

      <div v-else-if="events.length" class="space-y-16">
        <article
          v-for="(ev, index) in events"
          :key="ev.id"
          :class="[
            'grid overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2',
            index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
          ]"
        >
          <div class="h-72 w-full md:h-full">
            <img
              :src="ev.image"
              :alt="ev.title"
              class="h-full w-full object-cover"
            >
          </div>

          <div class="flex flex-col justify-center p-8 md:p-12">
            <span class="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              {{ ev.category || 'Resort Event' }}
            </span>

            <h2 class="mt-3 font-['Cinzel'] text-3xl text-[#1D3527]">
              {{ ev.title }}
            </h2>

            <p class="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
              {{ ev.description }}
            </p>

            <div class="mt-6 flex flex-wrap gap-6 text-xs font-medium text-neutral-500">
              <div v-if="ev.capacity">
                <span class="uppercase tracking-wider text-neutral-400">Capacity:</span>
                <span class="ml-1 text-neutral-800">{{ ev.capacity }}</span>
              </div>
              <div v-if="ev.event_date">
                <span class="uppercase tracking-wider text-neutral-400">Date:</span>
                <span class="ml-1 text-neutral-800">{{ ev.event_date }}</span>
              </div>
            </div>

            <div class="mt-8">
              <NuxtLink
                to="/contact"
                class="inline-flex rounded-full bg-[#1D3527] px-7 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#2b4e38]"
              >
                Inquire Now →
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="py-16 text-center text-neutral-500">
        Event packages will be available soon.
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bg-white py-20 text-center">
      <div class="mx-auto max-w-3xl px-6">
        <h2 class="font-['Cinzel'] text-3xl text-[#1D3527] md:text-4xl">
          Plan Your Event With Us
        </h2>
        <p class="mt-4 text-neutral-600">
          Our dedicated events team will tailor every detail—from catering and floral decor to guest accommodations.
        </p>
        <NuxtLink
          to="/contact"
          class="mt-8 inline-flex rounded-full bg-[#1D3527] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#2b4e38]"
        >
          Contact Events Team
        </NuxtLink>
      </div>
    </section>
  </div>
</template>