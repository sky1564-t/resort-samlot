<script setup lang="ts">
import { ref } from 'vue'

const galleryItems = [
  '/picture/f1.jpg',
  '/picture/f4.jpg',
  '/picture/f8.jpg',
  '/picture/f13.jpg',
  '/picture/f14.jpg',
  '/picture/f15.jpg',
  '/picture/f17.jpg',
  '/picture/f18.jpg',
  '/picture/f20.jpg',
  '/picture/f21.jpg'
]

// State to manage the "More to explore" button on mobile
const showAllMobile = ref(false)
</script>

<template>
  <section class="bg-[#F8F7F4] py-16 md:py-24">

    <!-- Header -->
    <div class="mx-auto mb-10 md:mb-16 max-w-7xl px-4 sm:px-6 text-center">
      <p class="mb-2 md:mb-3 font-['Cinzel'] text-xs sm:text-sm uppercase tracking-[4px] md:tracking-[6px] text-[#D4AF37]">
        Gallery
      </p>
      <h2 class="font-['Cinzel'] text-3xl sm:text-4xl md:text-5xl text-neutral-900">
        Our Food Resort
      </h2>
      <p class="mx-auto mt-4 md:mt-5 max-w-2xl text-sm sm:text-base text-neutral-600">
        Experience beautiful dining spaces, local cuisine, fresh ingredients and unforgettable moments shared with family and friends.
      </p>
    </div>

    <!-- ============================================== -->
    <!-- DESKTOP VIEW: Horizontal Accordion Strip       -->
    <!-- ============================================== -->
    <div class="hidden lg:flex h-[600px] xl:h-[750px] w-full bg-[#11211b]">
      <div
        v-for="(image, index) in galleryItems"
        :key="index"
        class="takeaway-strip group relative cursor-pointer overflow-hidden border-r border-white/5 last:border-r-0"
      >
        <img
          :src="image"
          alt="Food Resort"
          class="absolute inset-0 h-full w-full object-cover brightness-50 contrast-110 grayscale-[20%] transition-all duration-[2000ms] group-hover:scale-110 group-hover:brightness-75 group-hover:grayscale-0"
        >
        <div class="absolute inset-0 bg-gradient-to-b from-[#11211b]/40 via-transparent to-[#11211b]/80" />
        
        <div class="absolute left-1/2 top-1/2 z-10 w-[90%] -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-700 group-hover:-translate-y-[55%]">
          <div class="mx-auto h-px w-8 bg-white/40 transition-all duration-500 group-hover:w-16 group-hover:bg-[#D4AF37]" />
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MOBILE / TABLET VIEW: Responsive Grid          -->
    <!-- ============================================== -->
    <div class="block lg:hidden mx-auto px-4 sm:px-6 max-w-5xl">
      
      <!-- Image Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <!-- Shows first 4 items by default, shows all when button is clicked -->
        <div
          v-for="(image, index) in (showAllMobile ? galleryItems : galleryItems.slice(0, 4))"
          :key="index"
          class="relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer bg-neutral-900 shadow-sm"
        >
          <img
            :src="image"
            alt="Food Resort"
            class="absolute inset-0 h-full w-full object-cover brightness-75 transition-transform duration-700 group-hover:scale-110 group-hover:brightness-100"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
        </div>
      </div>

      <!-- "More to explore" Button (Only visible on mobile if items are hidden) -->
      <div v-if="!showAllMobile && galleryItems.length > 4" class="mt-8 flex justify-center">
        <button 
          @click="showAllMobile = true" 
          class="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-800 shadow-sm transition hover:bg-neutral-50 hover:border-neutral-400 active:scale-95"
        >
          More to explore
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </button>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- MAIN CTA (Bottom)                              -->
    <!-- ============================================== -->
    <div class="mt-12 md:mt-16 text-center">
      <NuxtLink
        to="/gallery"
        class="inline-flex items-center justify-center rounded-full border border-[#1D3527] px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-[#1D3527] transition hover:bg-[#1D3527] hover:text-white active:scale-95"
      >
        View Full Gallery
      </NuxtLink>
    </div>

  </section>
</template>

<style scoped>
/* 
  We removed the buggy media queries. 
  This CSS now only applies to the Desktop Accordion Strip! 
*/
.takeaway-strip {
  flex: 1;
  transition: flex 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.takeaway-strip:hover {
  flex: 2.5; /* Makes the hovered image wider for a beautiful reveal */
}
</style>