<script setup lang="ts">
useHead({
  title: 'Ankhusa Restaurant | Samlot Diamond Resort'
})

interface RestaurantItem {
  id: number
  name: string
  category: 'breakfast' | 'khmer' | 'western' | 'drinks' | 'dessert'
  description: string
  price: number | string
  image: string | null
  is_featured: boolean
  is_active: boolean
}

const { getRestaurantItems, getHeroByPage } = useApi()

const { data: hero } = await useAsyncData('hero-restaurant', async () => {
  try {
    return await getHeroByPage('restaurant')
  } catch {
    return null
  }
})

const { data: items, pending } = await useAsyncData<RestaurantItem[]>(
  'public-restaurant-items',
  async () => {
    const res: any = await getRestaurantItems()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)

const activeCategory = ref('all')

const categories = [
  { key: 'all', label: 'All Menu' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'khmer', label: 'Khmer Cuisine' },
  { key: 'western', label: 'Western' },
  { key: 'drinks', label: 'Drinks & Coffee' },
  { key: 'dessert', label: 'Dessert' }
]

const filteredItems = computed(() => {
  if (activeCategory.value === 'all') return items.value
  return items.value.filter(item => item.category === activeCategory.value)
})
</script>

<template>
  <div class="min-h-screen bg-[#F8F7F4] text-neutral-900">
    <!-- Hero -->
    <section class="relative h-[75vh] overflow-hidden bg-neutral-950">
      <img
        :src="hero?.background_image || '/picture/f1.jpg'"
        :alt="hero?.title || 'Ankhusa Restaurant'"
        class="absolute inset-0 h-full w-full object-cover opacity-80"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/30" />

      <div class="relative flex h-full items-center justify-center px-6 text-center text-white">
        <div class="max-w-3xl">
          <p class="mb-4 text-xs uppercase tracking-[6px] text-[#D4AF37]">
            {{ hero?.eyebrow || 'Farm-to-Table Dining' }}
          </p>
          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            {{ hero?.title || 'Ankhusa Restaurant' }}
          </h1>
          <p class="mx-auto mt-6 max-w-xl text-sm text-white/80 md:text-base">
            {{ hero?.description || 'Fresh organic ingredients harvested daily from our Samlot mountain farm, crafted into authentic Khmer and international dishes.' }}
          </p>
        </div>
      </div>
    </section>

    <!-- Menu Section -->
    <section class="mx-auto max-w-7xl px-6 py-24">
      <div class="mb-12 text-center">
        <h2 class="font-['Cinzel'] text-4xl text-[#1D3527] md:text-5xl">
          Our Menu
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-neutral-600">
          Prepared fresh daily with mountain herbs, seasonal produce, and local flavors.
        </p>

        <!-- Category Tabs -->
        <div class="mt-10 flex flex-wrap justify-center gap-3">
          <button
            v-for="cat in categories"
            :key="cat.key"
            @click="activeCategory = cat.key"
            :class="[
              'rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition',
              activeCategory === cat.key
                ? 'bg-[#1D3527] text-[#D4AF37] shadow-md'
                : 'border border-neutral-300 bg-white text-neutral-700 hover:border-[#1D3527]'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="h-80 animate-pulse rounded-3xl bg-neutral-200" />
      </div>

      <!-- Menu Grid -->
      <div v-else-if="filteredItems.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in filteredItems"
          :key="item.id"
          class="flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="relative h-56 w-full bg-neutral-100">
            <img
              :src="item.image || '/picture/f1.jpg'"
              :alt="item.name"
              class="h-full w-full object-cover"
            >
            <span
              v-if="item.is_featured"
              class="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black"
            >
              Chef's Special
            </span>
          </div>

          <div class="flex flex-1 flex-col p-6">
            <div class="mb-2 flex items-start justify-between gap-3">
              <h3 class="font-['Cinzel'] text-xl font-semibold text-neutral-900">
                {{ item.name }}
              </h3>
              <span class="shrink-0 text-lg font-bold text-[#1D3527]">
                ${{ Number(item.price).toFixed(2) }}
              </span>
            </div>

            <p class="flex-1 text-sm leading-relaxed text-neutral-600">
              {{ item.description || 'Prepared fresh daily at Ankhusa Restaurant.' }}
            </p>
          </div>
        </article>
      </div>

      <p v-else class="py-12 text-center text-neutral-500">
        No menu items available in this category yet.
      </p>
    </section>

    <!-- Reservation CTA -->
    <section class="bg-[#1D3527] py-20 text-center text-white">
      <div class="mx-auto max-w-3xl px-6">
        <h2 class="font-['Cinzel'] text-3xl md:text-4xl">
          Reserve a Table
        </h2>
        <p class="mt-4 text-sm text-white/75 md:text-base">
          Planning a romantic dinner or group dining experience? Contact our team to reserve your table.
        </p>
        <NuxtLink
          to="/contact"
          class="mt-8 inline-flex rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-[#c89c2b]"
        >
          Book a Table
        </NuxtLink>
      </div>
    </section>
  </div>
</template>