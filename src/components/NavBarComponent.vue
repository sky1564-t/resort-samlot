<template>
  <header 
    :class="[
      'absolute top-0 left-0 w-full flex items-center z-[1000] transition-all duration-400 ease-in-out px-5 md:px-10 box-border font-[\'Inter\',sans-serif]',
      isScrolled ? 'fixed bg-black/85 backdrop-blur-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] h-[80px]' : 'h-[100px] bg-transparent'
    ]"
  >
    <!-- Navbar Container -->
    <div class="relative z-[1002] mx-auto grid w-full max-w-[1400px] grid-cols-[1fr_auto] items-center justify-between min-[992px]:grid-cols-[1fr_auto_1fr]">
      
      <!-- LEFT: Navigation Links (Desktop) -->
      <nav class="hidden justify-start min-[992px]:flex">
        <ul class="m-0 flex list-none gap-6 p-0">
          <li v-for="(link, index) in links" :key="index">
            <!-- Using NuxtLink instead of router-link for Nuxt 3 -->
            <NuxtLink 
              :to="link.path" 
              active-class="after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-white" 
              class="relative flex items-center gap-1.5 pb-1 font-['Cinzel'] text-[14px] font-medium text-white no-underline transition-opacity duration-300 hover:opacity-70"
              @click="closeMenu"
            >
              {{ link.label }}
              <i v-if="link.dropdown" class="fas fa-chevron-down text-[10px] opacity-80"></i>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- CENTER: Stacked Logo -->
      <div 
        class="flex cursor-pointer flex-col items-start text-center text-[#160202] min-[992px]:items-center" 
        @click="$router.push('/'); closeMenu()"
      >
        <div class="mb-1 flex h-[100px] w-[100px] items-center justify-center text-[12px]">
          <img src="/logo/logo-b.png" alt="Logo" />
        </div>
      </div>

      <!-- RIGHT: Social Icons & CTA (Desktop) -->
      <div class="flex items-center justify-end gap-[30px]">
        <div class="hidden gap-[15px] min-[992px]:flex">
          <a href="#" class="text-[14px] text-white opacity-80 transition-opacity duration-300 hover:opacity-100"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-[14px] text-white opacity-80 transition-opacity duration-300 hover:opacity-100"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-[14px] text-white opacity-80 transition-opacity duration-300 hover:opacity-100"><i class="fab fa-dribbble"></i></a>
        </div>
        
        <NuxtLink 
          to="/booking" 
          class="hidden whitespace-nowrap rounded-[10px] border border-[#4e5051] bg-transparent px-6 py-2.5 text-[14px] font-medium text-white no-underline transition-colors duration-300 hover:bg-[#616d78] min-[992px]:block"
        >
          Book A Room
        </NuxtLink>

        <!-- MOBILE HAMBURGER TOGGLE -->
        <button 
          class="hamburger-toggle z-[1005] flex h-[24px] w-[30px] cursor-pointer flex-col justify-around border-none bg-transparent p-0 min-[992px]:hidden" 
          :class="{ 'is-active': menuOpen }"
          @click="toggleMenu"
        >
          <span class="relative h-[2px] w-full origin-[1px] rounded-[2px] bg-white transition-all duration-300"></span>
          <span class="relative h-[2px] w-full origin-[1px] rounded-[2px] bg-white transition-all duration-300"></span>
          <span class="relative h-[2px] w-full origin-[1px] rounded-[2px] bg-white transition-all duration-300"></span>
        </button>
      </div>

    </div>

    <!-- MOBILE MENU FULLSCREEN OVERLAY -->
    <transition name="fade">
      <div v-if="menuOpen" class="fixed left-0 top-0 z-[1001] flex h-screen w-screen items-center justify-center bg-black/95 backdrop-blur-[10px]">
        <nav class="flex flex-col items-center gap-[25px] text-center">
          <NuxtLink 
            v-for="(link, index) in links" 
            :key="index" 
            :to="link.path" 
            class="font-['Cinzel'] text-[24px] tracking-[2px] text-white no-underline transition-colors duration-300 hover:text-[#00bfff]" 
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>
          
          <div class="my-5 flex gap-[20px]">
            <a href="#" class="text-[20px] text-white"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="text-[20px] text-white"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-[20px] text-white"><i class="fab fa-dribbble"></i></a>
          </div>

          <NuxtLink 
            to="/booking" 
            class="mt-2.5 whitespace-nowrap rounded-[10px] border border-[#4e5051] bg-transparent px-6 py-2.5 text-[14px] font-medium text-white no-underline transition-colors duration-300 hover:bg-[#616d78]" 
            @click="closeMenu"
          >
            Book A Room
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { path: '/', label: 'Home' },
  { path: '/rooms', label: 'Rooms' },
  { path: '/blog', label: 'Blog', dropdown: true },
  { path: '/pages', label: 'Pages', dropdown: true },
  { path: '/contact', label: 'Contact' },
  { path: '/about', label: 'About' }
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
/* Hamburger Animation to 'X' */
.hamburger-toggle.is-active span:nth-child(1) {
  transform: rotate(45deg);
}
.hamburger-toggle.is-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}
.hamburger-toggle.is-active span:nth-child(3) {
  transform: rotate(-45deg);
}

/* Vue Transition Classes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>