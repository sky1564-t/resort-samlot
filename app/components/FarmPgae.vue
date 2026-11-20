<script setup lang="ts">
import type { FarmFeature } from '~/types/farm'

useHead({
  title: 'The Resort Farm | Samlot Diamond Resort'
})

const { getFarmFeatures } = useApi()

const { data: features, pending } = await useAsyncData<FarmFeature[]>(
  'public-farm-features',
  () => getFarmFeatures(),
  {
    default: () => []
  }
)
</script>

<template>
  <div class="w-full min-h-screen bg-[#FDFBF7] py-24 font-sans text-gray-900">
    <!-- Page Header -->
    <div class="max-w-3xl mx-auto text-center px-4 mb-24">
      <h1 class="text-4xl md:text-5xl font-serif mb-6 text-[#2C2B29]">The Resort Farm</h1>
      <p class="text-sm md:text-base text-gray-600 leading-relaxed font-light">
        Our collection of organic herbs, seasonal vegetables, and mountain fruits is designed to add freshness, nutrition, and authentic taste to your plate. From the soil directly to Ankhusa Restaurant.
      </p>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="max-w-6xl mx-auto px-4 md:px-8 space-y-24">
      <div v-for="n in 3" :key="n" class="h-[360px] animate-pulse rounded-[2rem] bg-neutral-200" />
    </div>

    <!-- Alternating Grid Container -->
    <div
      v-else-if="features.length"
      class="max-w-6xl mx-auto px-4 md:px-8 space-y-24 md:space-y-32"
    >
      <div
        v-for="(item, index) in features"
        :key="item.id"
        :class="[
          'flex flex-col items-center gap-10 md:gap-16',
          index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
        ]"
      >
        <div class="w-full md:w-3/5">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-[300px] md:h-[400px] object-cover rounded-[2rem] shadow-sm"
          >
        </div>

        <div
          :class="[
            'w-full md:w-2/5',
            index % 2 === 1 ? 'md:text-right flex flex-col md:items-end' : ''
          ]"
        >
          <h2 class="text-2xl md:text-3xl font-serif mb-4 text-[#2C2B29]">
            {{ item.title }}
          </h2>
          <p
            :class="[
              'text-sm text-gray-600 leading-relaxed mb-6 font-light',
              index % 2 === 1 ? 'md:ml-auto' : ''
            ]"
          >
            {{ item.description }}
          </p>
          <NuxtLink
            :to="item.button_link || '/booking'"
            class="text-xs font-bold uppercase tracking-widest text-[#2C2B29] flex items-center gap-2 hover:text-green-700 transition-colors"
          >
            {{ item.button_text || 'Learn More' }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-gray-500">
      Farm highlights will be available soon.
    </p>

    <!-- Bottom Action Button -->
    <div class="mt-32 flex justify-center">
      <NuxtLink
        to="/restaurant"
        class="bg-[#2C2B29] text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg"
      >
        Explore Dining
        <span class="bg-white text-[#2C2B29] rounded-full p-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </NuxtLink>
    </div>
  </div>
</template>