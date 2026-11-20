<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useHead } from '#imports'

useHead({
  title: 'Gallery | Samlot Diamond Resort',
})

interface GalleryMediaItem {
  id?: string | number
  type: 'image' | 'video'
  src: string
  title: string
}

const R2_URL = 'https://pub-0c542abde828459785e3d8da1a74270d.r2.dev'

const normalizeMediaUrl = (rawUrl: unknown): string => {
  if (!rawUrl || typeof rawUrl !== 'string') return ''
  let url = rawUrl.trim()
  while (url.startsWith('https://https://')) {
    url = url.replace('https://https://', 'https://')
  }
  while (url.startsWith('http://https://')) {
    url = url.replace('http://https://', 'https://')
  }
  if (/^https?:\/\//i.test(url)) return url
  return `${R2_URL}/${url.replace(/^\/+/, '')}`
}

const isVideoSource = (url: string, explicitType?: unknown): boolean => {
  if (explicitType === 'video' || explicitType === 'mp4' || explicitType === 'mov') return true
  return /\.(mp4|mov|webm|ogg)(\?.*)?$/i.test(url)
}

// 1. Array for your specific videos and 'f' images
const specificMedia: GalleryMediaItem[] = [
  { type: 'image', src: `${R2_URL}/image/f1.jpg`, title: 'Tropical Paradise' },
  { type: 'video', src: `${R2_URL}/video/v2.mp4`, title: 'Resort Walkthrough' },
  { type: 'video', src: `${R2_URL}/video/v3.mp4`, title: 'Ocean Views' },
  { type: 'image', src: `${R2_URL}/image/f4.jpg`, title: 'Luxury Villa' },
  { type: 'image', src: `${R2_URL}/image/f8.jpg`, title: 'Evening Dining' },
  { type: 'image', src: `${R2_URL}/image/f13.jpg`, title: 'Poolside View' },
  { type: 'video', src: `${R2_URL}/video/v4.mp4`, title: 'Spa Experience' },
  { type: 'image', src: `${R2_URL}/image/f14.jpg`, title: 'Interior Suite' },
  { type: 'image', src: `${R2_URL}/image/f17.jpg`, title: 'Garden Walkway' },
  { type: 'video', src: `${R2_URL}/video/v5.mp4`, title: 'Resort Activities' },
  { type: 'video', src: `${R2_URL}/video/v6.mp4`, title: 'Garden Walkway' },
  { type: 'video', src: `${R2_URL}/video/v7.mp4`, title: 'Garden Walkway' },
  { type: 'video', src: `${R2_URL}/video/v8.mp4`, title: 'Garden Walkway' },
  { type: 'image', src: `${R2_URL}/image/f15.jpg`, title: 'Spa & Wellness' },
  
]

// 2. Function to generate images 1.jpg to 35.jpg
const generateSequentialImages = (start: number, end: number): GalleryMediaItem[] => {
  const images: GalleryMediaItem[] = []
  for (let i = start; i <= end; i++) {
    images.push({
      type: 'image',
      src: `${R2_URL}/image/${i}.jpg`,
      title: `Resort View ${i}`,
    })
  }
  return images
}

const generatedImages = generateSequentialImages(1, 35)
const baseGallery: GalleryMediaItem[] = [...specificMedia, ...generatedImages]
const uploadedMedia = ref<GalleryMediaItem[]>([])
const mediaFilter = ref<'all' | 'image' | 'video'>('all')

const gallery = computed<GalleryMediaItem[]>(() => {
  const merged = [...uploadedMedia.value, ...baseGallery]
  if (mediaFilter.value === 'all') return merged
  return merged.filter((item) => item.type === mediaFilter.value)
})

const currentIndex = ref<number | null>(null)

watch(mediaFilter, () => {
  currentIndex.value = null
})

const activeMedia = computed(() => {
  if (currentIndex.value === null) return null
  return gallery.value[currentIndex.value] ?? null
})

const moreToExplore = computed(() => {
  if (currentIndex.value === null) return []
  return gallery.value
    .map((item, index) => ({ item, index }))
    .filter((media) => media.index !== currentIndex.value)
})

const scrollToContent = () => {
  setTimeout(() => {
    document.getElementById('gallery-content')?.scrollIntoView({ behavior: 'smooth' })
  }, 50)
}

const openDetailView = (index: number) => {
  currentIndex.value = index
  scrollToContent()
}

const closeDetailView = () => {
  currentIndex.value = null
  scrollToContent()
}

const nextMedia = () => {
  if (currentIndex.value === null || gallery.value.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % gallery.value.length
}

const prevMedia = () => {
  if (currentIndex.value === null || gallery.value.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + gallery.value.length) % gallery.value.length
}

const handleKeydown = (e: KeyboardEvent) => {
  if (currentIndex.value === null) return
  if (e.key === 'Escape') closeDetailView()
  if (e.key === 'ArrowRight') nextMedia()
  if (e.key === 'ArrowLeft') prevMedia()
}

const loadApiGallery = async () => {
  try {
    const { getGallery } = useApi()
    const items = await getGallery()
    if (Array.isArray(items) && items.length > 0) {
      uploadedMedia.value = items
        .map((row: any, idx: number): GalleryMediaItem | null => {
          const rawSrc = row?.image || row?.file || row?.url || row?.src || row?.media_url || ''
          const src = normalizeMediaUrl(rawSrc)
          if (!src) return null
          const type: 'image' | 'video' = isVideoSource(src, row?.type || row?.media_type)
            ? 'video'
            : 'image'
          return {
            id: row?.id ?? `api-${idx}`,
            type,
            src,
            title: row?.title || row?.caption || `Resort Moment ${idx + 1}`,
          }
        })
        .filter((item): item is GalleryMediaItem => item !== null)
    }
  } catch {
    // Keep R2 static gallery active when API is offline
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadApiGallery()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

</script>

<template>
  <div class="bg-white min-h-screen pb-16 md:pb-24">
    <!-- HERO SECTION -->
    <section class="relative h-[100vh] overflow-hidden">
      <img src="/picture/21.jpg" alt="Gallery" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black/50" />
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

    <!-- Content Anchor -->
    <div id="gallery-content" class="scroll-mt-0">
      <!-- VIEW 1: GRID -->
      <div v-show="currentIndex === null">
        <section class="py-12 sm:py-16 md:py-24 mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-[1600px]">
          <div class="mb-8 sm:mb-12 md:mb-16 text-center px-4">
            <p class="mb-2 sm:mb-3 font-['Cinzel'] uppercase tracking-[4px] sm:tracking-[6px] text-[#D4AF37] text-xs sm:text-sm md:text-base">
              Photography &amp; Video Collection
            </p>
            <h2 class="font-['Cinzel'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neutral-900">
              Moments At Samlot Diamond Resort
            </h2>

            <div class="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-100 p-1.5 border border-neutral-200/80">
              <button
                type="button"
                @click="mediaFilter = 'all'"
                :class="[
                  'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer',
                  mediaFilter === 'all'
                    ? 'bg-emerald-950 text-amber-300 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900',
                ]"
              >
                All
              </button>
              <button
                type="button"
                @click="mediaFilter = 'image'"
                :class="[
                  'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer',
                  mediaFilter === 'image'
                    ? 'bg-emerald-950 text-amber-300 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900',
                ]"
              >
                Photos
              </button>
              <button
                type="button"
                @click="mediaFilter = 'video'"
                :class="[
                  'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer',
                  mediaFilter === 'video'
                    ? 'bg-emerald-950 text-amber-300 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900',
                ]"
              >
                Videos
              </button>
            </div>
          </div>

          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-4 md:gap-6">
            <button
              v-for="(media, index) in gallery"
              :key="media.id ?? `${media.src}-${index}`"
              type="button"
              class="group relative mb-2 sm:mb-4 md:mb-6 w-full inline-block overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl break-inside-avoid cursor-zoom-in bg-neutral-100 shadow-sm"
              @click="openDetailView(index)"
            >
              <!-- IMAGE -->
              <img
                v-if="media.type === 'image'"
                :src="media.src"
                :alt="media.title"
                class="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                loading="lazy"
              />

              <!-- VIDEO -->
              <video
                v-else-if="media.type === 'video'"
                :key="media.src"
                :src="media.src"
                class="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-90"
                autoplay
                muted
                loop
                playsinline
              />

              <div class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </button>
          </div>
        </section>
      </div>

      <!-- VIEW 2: FULL WIDTH DETAIL -->
      <div v-if="activeMedia" class="mx-auto px-2 sm:px-4 md:px-8 pt-6 sm:pt-8 md:pt-12 max-w-[1600px]">
        <div class="relative w-full bg-neutral-100 flex items-center justify-center min-h-[50vh] sm:min-h-[70vh] lg:min-h-[85vh] rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] group">
          <button
            type="button"
            class="absolute top-3 sm:top-6 left-3 sm:left-6 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-neutral-800 hover:bg-white transition-colors shadow-md backdrop-blur-sm cursor-pointer"
            @click="closeDetailView"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <!-- Detail Image -->
          <img
            v-if="activeMedia.type === 'image'"
            :src="activeMedia.src"
            :alt="activeMedia.title"
            class="w-full h-full max-h-[85vh] object-contain"
          />

          <!-- Detail Video -->
          <video
            v-else
            :key="activeMedia.src"
            :src="activeMedia.src"
            class="w-full h-full max-h-[85vh] object-contain"
            controls
            autoplay
            playsinline
          />

          <button
            type="button"
            @click="prevMedia"
            class="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            @click="nextMedia"
            class="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <!-- More to explore Grid -->
        <div class="mt-12 sm:mt-16 md:mt-24 pt-8 sm:pt-12 md:pt-16 border-t border-neutral-200 px-2 sm:px-0">
          <h3 class="font-serif text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 md:mb-12 text-neutral-900 text-center">More to explore</h3>
          <div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-2 sm:gap-4 md:gap-6">
            <button
              v-for="media in moreToExplore"
              :key="media.item.id ?? `${media.item.src}-${media.index}`"
              type="button"
              class="group relative mb-2 sm:mb-4 md:mb-6 w-full inline-block overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl break-inside-avoid bg-neutral-100 shadow-sm cursor-zoom-in"
              @click="openDetailView(media.index)"
            >
              <img
                v-if="media.item.type === 'image'"
                :src="media.item.src"
                :alt="media.item.title"
                class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <video
                v-else
                :key="media.item.src"
                :src="media.item.src"
                class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                preload="metadata"
                muted
              />

              <div class="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>