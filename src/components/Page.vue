<script setup lang="ts">
const links = [
  { label: 'Home', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'Blog', to: '/blog' },
  { label: 'Pages', children: [
    { label: 'Gallery', to: '/gallery' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Terms', to: '/terms' },
  ] },
  { label: 'Contact', to: '/contact' },
  { label: 'About', to: '/about' },
]

const route = useRoute()
const open = ref(false)
const pagesOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// close menus when navigating
watch(() => route.fullPath, () => {
  open.value = false
  pagesOpen.value = false
})

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
const pagesActive = computed(() =>
  links.find(l => l.children)?.children?.some(c => isActive(c.to)) ?? false,
)
const underline = 'border-b-2 border-white pb-1'
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
      scrolled || open ? 'bg-[#151a18]/95 backdrop-blur' : 'bg-transparent',
    ]"
  >
    <div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
      <NuxtLink to="/" class="font-serif text-xl text-white">Samlot Diamond Resort</NuxtLink>

      <!-- Desktop -->
      <nav class="hidden items-center gap-10 font-serif text-lg text-white md:flex" aria-label="Main">
        <template v-for="l in links" :key="l.label">
          <div
            v-if="l.children"
            class="relative"
            @mouseenter="pagesOpen = true"
            @mouseleave="pagesOpen = false"
          >
            <button
              type="button"
              :class="['flex items-center gap-1', pagesActive ? underline : 'pb-1']"
              :aria-expanded="pagesOpen"
              @click="pagesOpen = !pagesOpen"
              @keydown.esc="pagesOpen = false"
            >
              {{ l.label }}
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 4l4 4 4-4" /></svg>
            </button>
            <div v-show="pagesOpen" class="absolute left-1/2 top-full -translate-x-1/2 pt-3">
              <ul class="min-w-40 rounded bg-white py-2 text-base text-neutral-900 shadow-lg dark:bg-neutral-900 dark:text-neutral-100">
                <li v-for="c in l.children" :key="c.to">
                  <NuxtLink :to="c.to" class="block px-5 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">{{ c.label }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <NuxtLink v-else :to="l.to" :class="isActive(l.to!) ? underline : 'pb-1'">{{ l.label }}</NuxtLink>
        </template>
      </nav>

      <!-- Mobile toggle -->
      <button
        type="button"
        class="text-white md:hidden"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        :aria-expanded="open"
        @click="open = !open"
      >
        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" />
          <path v-else d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <nav v-show="open" class="border-t border-white/10 px-5 pb-6 font-serif text-lg text-white md:hidden" aria-label="Mobile">
      <ul class="space-y-1 pt-3">
        <template v-for="l in links" :key="l.label">
          <li v-if="l.children">
            <p class="py-2 text-white/60">{{ l.label }}</p>
            <ul class="space-y-1 border-l border-white/20 pl-4">
              <li v-for="c in l.children" :key="c.to">
                <NuxtLink :to="c.to" :class="['block py-1.5', isActive(c.to) ? 'text-[#c9a96b]' : '']">{{ c.label }}</NuxtLink>
              </li>
            </ul>
          </li>
          <li v-else>
            <NuxtLink :to="l.to" :class="['block py-2', isActive(l.to!) ? 'text-[#c9a96b]' : '']">{{ l.label }}</NuxtLink>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>