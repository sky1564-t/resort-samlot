<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Gallery | Samlot Diamond Resort'
})

// Replace this with your actual Cloudflare R2 Public Access Custom Domain or .r2.dev URL
const R2_URL = 'https://pub-0c542abde828459785e3d8da1a74270d.r2.dev' 

const gallery = [
  { type: 'image', src: `${R2_URL}/image/f1.jpg`, title: 'Tropical Paradise' },
  { type: 'video', src: `${R2_URL}/video/v2.mp4`, title: 'Resort Walkthrough' },
  { type: 'video', src: `${R2_URL}/video/v3.mp4`, title: 'Ocean Views' },
  { type: 'image', src: `${R2_URL}/image/f4.jpg`, title: 'Luxury Villa' },
  { type: 'image', src: `${R2_URL}/image/f8.jpg`, title: 'Evening Dining' },
  { type: 'image', src: `${R2_URL}/image/f13.jpg`, title: 'Poolside View' },
  { type: 'video', src: `${R2_URL}/video/v4.mp4`, title: 'Spa Experience' },
  { type: 'image', src: `${R2_URL}/image/f14.jpg`, title: 'Interior Suite' },
  { type: 'image', src: `${R2_URL}/image/f15.jpg`, title: 'Spa & Wellness' },
  { type: 'image', src: `${R2_URL}/image/f17.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/1.jpg`, title: 'Tropical Paradise' },
  { type: 'image', src: `${R2_URL}/image/2.jpg`, title: 'Resort Walkthrough' },
  { type: 'image', src: `${R2_URL}/image/10.jpg`, title: 'Luxury Villa' },
  { type: 'image', src: `${R2_URL}/image/11.jpg`, title: 'Evening Dining' },
  { type: 'image', src: `${R2_URL}/image/12.jpg`, title: 'Poolside View' },
  { type: 'video', src: `${R2_URL}/video/v5.mp4`, title: 'Resort Activities' },
  { type: 'image', src: `${R2_URL}/image/13.jpg`, title: 'Interior Suite' },
  { type: 'image', src: `${R2_URL}/image/14.jpg`, title: 'Spa & Wellness' },
  { type: 'image', src: `${R2_URL}/image/15.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/18.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/19.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/20.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/21.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/22.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/23.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/24.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/25.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/26.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/27.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/28.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/29.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/30.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/31.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/32.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/33.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/34.jpg`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/35.jpg`, title: 'Garden Walkway' },
]

const currentIndex = ref<number | null>(null)

const activeMedia = computed(() => {
  if (currentIndex.value === null) return null
  return gallery[currentIndex.value]
})

// Safely generate "More to explore" grid without breaking original indexes
const moreToExplore = computed(() => {
  if (currentIndex.value === null) return []
  return gallery
    .map((item, index) => ({ item, index }))
    .filter(media => media.index !== currentIndex.value)
})

// Helper function to scroll to the content area (below the 100vh hero)
const scrollToContent = () => {
  setTimeout(() => {
    document.getElementById('gallery-content')?.scrollIntoView({ behavior: 'smooth' })
  }, 50)
}

// In-Flow Navigation Functions
const openDetailView = (index: number) => {
  currentIndex.value = index
  scrollToContent()
}

const closeDetailView = () => {
  currentIndex.value = null
  scrollToContent()
}

const nextMedia = () => {
  if (currentIndex.value === null) return
  currentIndex.value = (currentIndex.value + 1) % gallery.length
}

const prevMedia = () => {
  if (currentIndex.value === null) return
  currentIndex.value = (currentIndex.value - 1 + gallery.length) % gallery.length
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (currentIndex.value === null) return
  if (e.key === 'Escape') closeDetailView()
  if (e.key === 'ArrowRight') nextMedia()
  if (e.key === 'ArrowLeft') prevMedia()
}

onMounted(() => { window.addEventListener('keydown', handleKeydown) })
onUnmounted(() => { window.removeEventListener('keydown', handleKeydown) })
</script>

<template>
  <div class="bg-white min-h-screen pb-16 md:pb-24">
    
    <!-- ========================================== -->
    <!-- HERO SECTION (Always visible at the top)   -->
    <!-- ========================================== -->
    <section class="relative h-[100vh] overflow-hidden">
      <img src="/picture/21.jpg" alt="Gallery" class="absolute inset-0 h-full w-full object-cover">
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative flex h-full items-center justify-center text-center text-white p-4">
        <div>
          <p class="mb-2 sm:mb-4 font-['Cinzel'] uppercase tracking-[4px] sm:tracking-[6px] text-[#D4AF37] text-xs sm:text-base">
            Discover
          </p>
          <h1 class="font-['Cinzel'] text-4xl sm:text-5xl md:text-7xl">
            Resort Gallery
          </h1>
          <p class="mx-auto mt-3 sm:mt-5 max-w-2xl text-white/80 text-sm sm:text-base md:text-lg">
            Explore beautiful moments, luxury accommodation, dining experiences and breathtaking landscapes.
          </p>
        </div>
      </div>
    </section>

    <!-- Content Anchor for Scrolling -->
    <div id="gallery-content" class="scroll-mt-0">
      
      <!-- ========================================== -->
      <!-- VIEW 1: GRID (Hidden when checking an image) -->
      <!-- ========================================== -->
      <div v-show="currentIndex === null">
        <section class="py-12 sm:py-16 md:py-24 mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-[1600px]">
          <div class="mb-8 sm:mb-12 md:mb-16 text-center px-4">
            <p class="mb-2 sm:mb-3 font-['Cinzel'] uppercase tracking-[4px] sm:tracking-[6px] text-[#D4AF37] text-xs sm:text-sm md:text-base">
              Photography & Video Collection
            </p>
            <h2 class="font-['Cinzel'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neutral-900">
              Moments At Samlot Diamond Resort
            </h2>
          </div>

          <!-- Fully Responsive Masonry Columns -->
          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-4 md:gap-6">
            <button
              v-for="(media, index) in gallery"
              :key="index"
              class="group relative mb-2 sm:mb-4 md:mb-6 w-full inline-block overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl break-inside-avoid cursor-zoom-in bg-neutral-100 shadow-sm"
              @click="openDetailView(index)"
            >
              <img v-if="media.type === 'image'" :src="media.src" class="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" loading="lazy">
              <video v-else-if="media.type === 'video'" :src="media.src" class="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-90" autoplay muted loop playsinline></video>
              <div class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
            </button>
          </div>
        </section>
      </div>

      <!-- ========================================== -->
      <!-- VIEW 2: FULL WIDTH DETAIL IN-FLOW          -->
      <!-- ========================================== -->
      <div v-if="activeMedia" class="mx-auto px-2 sm:px-4 md:px-8 pt-6 sm:pt-8 md:pt-12 max-w-[1600px]">
        
        <!-- Full Width Media Container -->
        <div class="relative w-full bg-neutral-100 flex items-center justify-center min-h-[50vh] sm:min-h-[70vh] lg:min-h-[85vh] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] group">
          
          <!-- Back Arrow Button -->
          <button class="absolute top-3 sm:top-6 left-3 sm:left-6 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-neutral-800 hover:bg-white transition-colors shadow-md backdrop-blur-sm" @click="closeDetailView">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>

          <!-- Media Display -->
          <img v-if="activeMedia.type === 'image'" :src="activeMedia.src" class="w-full h-full max-h-[85vh] object-contain">
          <video v-else :src="activeMedia.src" class="w-full h-full max-h-[85vh] object-contain" controls autoplay loop playsinline></video>

          <!-- Left/Right Desktop Navigation Arrows -->
          <button @click="prevMedia" class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button @click="nextMedia" class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </button>
        </div>

        <!-- More to explore Grid -->
        <div class="mt-12 sm:mt-16 md:mt-24 pt-8 sm:pt-12 md:pt-16 border-t border-neutral-200 px-2 sm:px-0">
          <h3 class="font-serif text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 md:mb-12 text-neutral-900 text-center">More to explore</h3>
          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-4 md:gap-6">
            <button
              v-for="media in moreToExplore"
              :key="media.index"
              class="group relative mb-2 sm:mb-4 md:mb-6 w-full inline-block overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl break-inside-avoid bg-neutral-100 shadow-sm cursor-zoom-in"
              @click="openDetailView(media.index)"
            >
              <img v-if="media.item.type === 'image'" :src="media.item.src" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105">
              <video v-else :src="media.item.src" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"></video>
              <div class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"></div>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>