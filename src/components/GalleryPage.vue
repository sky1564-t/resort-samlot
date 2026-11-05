<script setup lang="ts">
import type { MediaVideo } from '~/types/gallery'

useHead({ title: 'Gallery – Samlot Diamond Resort' })

const { items } = useMedia()

// Add your YouTube videos here. The id is the part after "v=" in the video link.
const videos: MediaVideo[] = [
  // { title: 'Welcome to Samlot Diamond Resort', youtubeId: 'XXXXXXXXXXX' },
]

// Lightbox
const active = ref<number | null>(null)
const current = computed(() => (active.value === null ? null : items.value[active.value]))

function open(i: number) {
  active.value = i
}
function close() {
  active.value = null
}
function step(direction: number) {
  if (active.value === null) return
  const total = items.value.length
  active.value = (active.value + direction + total) % total
}
function onKey(e: KeyboardEvent) {
  if (active.value === null) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
// Stop the page behind from scrolling while the viewer is open
watch(active, (v) => {
  if (import.meta.client) document.body.style.overflow = v === null ? '' : 'hidden'
})
</script>

<template>
  <div class="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
    <!-- Hero bar -->
    <section class="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
      <img src="/picture/2.jpg" alt="Samlot Diamond Resort" class="hero-image fade absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black/45" />
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 class="font-serif text-4xl md:text-6xl">Gallery</h1>
        <p class="mt-3 text-white/80">Photos and videos from Samlot Diamond Resort</p>
      </div>
    </section>

    <!-- Photos -->
    <section class="mx-auto max-w-8xl px-4 py-12 md:py-16">
      <div class="mb-8 flex items-end justify-between">
        <h2 class="font-serif text-3xl md:text-4xl">Photos</h2>
        <p class="text-sm text-neutral-500">{{ items.length }} photos</p>
      </div>

      <div class="columns-2 gap-3 md:columns-3">
        <button
          v-for="(item, i) in items"
          :key="item.id"
          type="button"
          class="group mb-3 block w-full overflow-hidden rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a8895b]"
          :aria-label="`Open photo ${i + 1} of ${items.length}`"
          @click="open(i)"
        >
          <img
            :src="item.src"
            :alt="item.alt"
            loading="lazy"
            class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
      </div>
    </section>

    <!-- Videos (only shown when you add some) -->
    <section v-if="videos.length" class="bg-neutral-100 px-4 py-12 md:py-16 dark:bg-neutral-900">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-8 font-serif text-3xl md:text-4xl">Videos</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <figure v-for="v in videos" :key="v.youtubeId">
            <div class="aspect-video overflow-hidden rounded bg-black">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${v.youtubeId}`"
                :title="v.title"
                class="h-full w-full"
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowfullscreen
              />
            </div>
            <figcaption class="mt-2 text-sm text-neutral-500">{{ v.title }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- Call to action -->
    <section class="bg-[#151a18] px-5 py-14 text-center text-white">
      <h2 class="font-serif text-3xl md:text-4xl">Ready to see it in person?</h2>
      <NuxtLink to="/booking" class="mt-6 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-90">
        Book your stay
      </NuxtLink>
    </section>

    <!-- Lightbox -->
    <div
      v-if="current"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      @click.self="close"
    >
      <button type="button" class="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" aria-label="Close" @click="close">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <button type="button" class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6" aria-label="Previous photo" @click="step(-1)">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>

      <img :src="current.src" :alt="current.alt" class="max-h-[85vh] max-w-full rounded object-contain" />

      <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6" aria-label="Next photo" @click="step(1)">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>

      <p class="absolute bottom-4 left-0 right-0 text-center text-sm text-white/70">{{ (active ?? 0) + 1 }} / {{ items.length }}</p>
    </div>
  </div>
</template>