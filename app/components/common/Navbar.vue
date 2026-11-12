<template>
  <header
    :class="[
      'left-0 top-0 z-[1000] w-full transition-all duration-300 ease-in-out px-4 sm:px-6 md:px-8 xl:px-12 font-[Inter,sans-serif]',
      isScrolled
        ? 'fixed h-[70px] md:h-[80px] bg-black/85 backdrop-blur-md shadow-lg'
        : 'absolute h-[80px] md:h-[100px] bg-transparent'
    ]"
  >
    <div
      class="mx-auto grid h-full max-w-[1400px] grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]"
    >
      <!-- Desktop Navigation (Hidden on Mobile/Tablet) -->
      <nav class="hidden lg:flex">
        <ul class="flex items-center gap-4 xl:gap-7">
          <li
            v-for="link in links"
            :key="link.path"
          >
            <NuxtLink
              :to="link.path"
              class="relative pb-1 font-['Cinzel'] text-xs xl:text-sm tracking-wide text-white transition-all duration-300 hover:text-[#D4AF37]"
              :class="{
                'text-[#D4AF37]': route.path === link.path
              }"
              @click="closeMenu"
            >
              {{ link.label }}

              <span
                v-if="route.path === link.path"
                class="absolute bottom-0 left-0 h-[2px] w-full bg-[#D4AF37]"
              />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Center Logo (Scales based on scroll & screen size) -->
      <div
        class="flex cursor-pointer justify-center"
        @click="navigateTo('/')"
      >
        <div
          :class="[
            'transition-all duration-300',
            isScrolled
              ? 'h-[50px] w-[50px] md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]'
              : 'h-[60px] w-[60px] md:h-[80px] md:w-[80px] lg:h-[100px] lg:w-[100px]'
          ]"
        >
          <img
            src="/logo/logo-b.png"
            alt="Samlot Diamond Resort"
            class="h-full w-full object-contain"
          >
        </div>
      </div>

      <!-- Right Actions (Scales gaps and padding) -->
      <div class="flex items-center justify-end gap-4 sm:gap-5 xl:gap-6">

        <!-- Reservation Contact (Visible only on very large screens) -->
        <div
          class="hidden xl:block text-right"
        >
          <p
            class="text-[10px] xl:text-xs uppercase tracking-widest text-white/60"
          >
            Reservations
          </p>

          <a
            href="tel:+85512345678"
            class="text-sm text-white transition hover:text-[#D4AF37]"
          >
            +855 12 345 678
          </a>
        </div>

        <!-- Social Icons (Visible on Desktop) -->
        <div
          class="hidden gap-3 xl:gap-4 lg:flex"
        >
          <a
            href="#"
            class="text-sm xl:text-base text-white/80 hover:text-[#D4AF37]"
          >
            <i class="fab fa-facebook-f" />
          </a>

          <a
            href="#"
            class="text-sm xl:text-base text-white/80 hover:text-[#D4AF37]"
          >
            <i class="fab fa-instagram" />
          </a>

          <a
            href="#"
            class="text-sm xl:text-base text-white/80 hover:text-[#D4AF37]"
          >
            <i class="fab fa-tiktok" />
          </a>
        </div>

        <!-- CTA Book Now Button (Visible on Desktop) -->
        <NuxtLink
          to="/booking"
          class="hidden lg:inline-flex items-center rounded-full bg-[#D4AF37] px-5 py-2.5 xl:px-6 xl:py-3 text-sm xl:text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#c89c2b]"
        >
          Book Now
        </NuxtLink>

        <!-- Mobile/Tablet Toggle -->
        <button
          class="hamburger-toggle z-[1005] flex h-5 w-7 sm:h-6 sm:w-8 flex-col justify-between lg:hidden"
          :class="{ 'is-active': menuOpen }"
          @click="toggleMenu"
        >
          <span />
          <span />
          <span />
        </button>

      </div>
    </div>

    <!-- Mobile/Tablet Fullscreen Menu -->
    <transition name="fade">
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-[1001] flex items-center justify-center bg-black/95 backdrop-blur-md px-6"
      >
        <nav
          class="flex flex-col items-center w-full max-w-sm"
        >
          <!-- Responsive Menu Logo -->
          <img
            src="/logo/logo-b.png"
            alt="Samlot Diamond Resort"
            class="mb-8 sm:mb-12 w-20 sm:w-24"
          >

          <!-- Responsive Menu Links -->
          <NuxtLink
            v-for="link in links"
            :key="link.path"
            :to="link.path"
            class="mb-4 sm:mb-6 font-['Cinzel'] text-xl sm:text-2xl tracking-widest text-white transition hover:text-[#D4AF37]"
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Responsive Menu Button -->
          <NuxtLink
            to="/booking"
            class="mt-6 sm:mt-8 rounded-full bg-[#D4AF37] px-8 py-3 text-sm sm:text-base font-semibold text-black transition-transform hover:scale-105"
            @click="closeMenu"
          >
            Book Now
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, navigateTo } from '#app' // Ensure proper Nuxt auto-imports

const route = useRoute()

const isScrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { path: '/', label: 'Home' },
  { path: '/rooms', label: 'Rooms' },
  { path: '/experiences', label: 'Experiences' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/blog', label: 'Blog' },
  { path: '/about-us', label: 'About Us' },
  { path: '/contact', label: 'Contact' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  menuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.hamburger-toggle span {
  height: 2px;
  width: 100%;
  border-radius: 9999px;
  background: white;
  transition: all 0.3s ease;
}

.hamburger-toggle.is-active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-toggle.is-active span:nth-child(2) {
  opacity: 0;
}

.hamburger-toggle.is-active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Specific adjustment for smaller mobile screens on hamburger */
@media (max-width: 639px) {
  .hamburger-toggle.is-active span:nth-child(1) {
    transform: rotate(45deg) translate(4px, 5px);
  }
  .hamburger-toggle.is-active span:nth-child(3) {
    transform: rotate(-45deg) translate(4px, -4px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>