<script setup lang="ts">
useHead({
  title: 'Special Offers | Samlot Diamond Resort'
})

interface SpecialOffer {
  id: number
  title: string
  badge: string
  description: string
  discount_text: string
  valid_until: string | null
  image: string
  is_active: boolean
}

const { getOffers, getHeroByPage } = useApi()

const { data: hero } = await useAsyncData('hero-offers', async () => {
  try {
    return await getHeroByPage('offers')
  } catch {
    return null
  }
})

const { data: offers, pending } = await useAsyncData<SpecialOffer[]>(
  'public-offers',
  async () => {
    const res: any = await getOffers()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)
</script>

<template>
  <div class="min-h-screen bg-[#FDFBF7] text-neutral-900">
    <!-- Hero -->
    <section class="relative h-[70vh] overflow-hidden bg-neutral-950">
      <img
        :src="hero?.background_image || '/picture/38.jpg'"
        :alt="hero?.title || 'Special Offers'"
        class="absolute inset-0 h-full w-full object-cover opacity-80"
      >
      <div class="absolute inset-0 bg-black/50" />

      <div class="relative flex h-full items-center justify-center px-6 text-center text-white">
        <div class="max-w-3xl">
          <p class="mb-4 text-xs uppercase tracking-[6px] text-[#D4AF37]">
            {{ hero?.eyebrow || 'Exclusive Packages' }}
          </p>
          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            {{ hero?.title || 'Special Offers' }}
          </h1>
          <p class="mx-auto mt-5 max-w-xl text-sm text-white/80 md:text-base">
            {{ hero?.description || 'Enjoy curated seasonal packages and exclusive direct-booking privileges at Samlot Diamond Resort.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Offers List -->
    <section class="mx-auto max-w-7xl px-6 py-24">
      <div v-if="pending" class="grid gap-8 md:grid-cols-2">
        <div v-for="n in 4" :key="n" class="h-96 animate-pulse rounded-3xl bg-neutral-200" />
      </div>

      <div v-else-if="offers.length" class="grid gap-10 md:grid-cols-2">
        <article
          v-for="offer in offers"
          :key="offer.id"
          class="flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative h-64 w-full bg-neutral-100">
            <img
              :src="offer.image"
              :alt="offer.title"
              class="h-full w-full object-cover"
            >
            <span
              v-if="offer.badge"
              class="absolute left-5 top-5 rounded-full bg-[#1D3527] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]"
            >
              {{ offer.badge }}
            </span>
            <span
              v-if="offer.discount_text"
              class="absolute bottom-4 right-4 rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black shadow"
            >
              {{ offer.discount_text }}
            </span>
          </div>

          <div class="flex flex-1 flex-col p-8">
            <h2 class="font-['Cinzel'] text-2xl font-semibold text-[#1D3527]">
              {{ offer.title }}
            </h2>

            <p class="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">
              {{ offer.description }}
            </p>

            <div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6">
              <p v-if="offer.valid_until" class="text-xs font-medium text-neutral-500">
                Valid until: <span class="text-neutral-800">{{ offer.valid_until }}</span>
              </p>
              <NuxtLink
                to="/booking"
                class="ml-auto inline-flex rounded-full bg-[#1D3527] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#2b4e38]"
              >
                Claim Offer →
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="py-16 text-center text-neutral-500">
        New seasonal offers will be announced soon.
      </div>
    </section>
  </div>
</template>