<template>
  <footer
    class="border-t border-white/10 bg-black/50 px-6 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 text-white backdrop-blur-[15px]"
  >
    <div
      class="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr] lg:gap-8 xl:gap-12"
    >
      <!-- Brand -->
      <div class="text-center sm:text-left flex flex-col items-center sm:items-start">
        <NuxtLink to="/" class="inline-flex">
          <div
            class="flex h-20 w-20 md:h-[100px] md:w-[100px] lg:h-[110px] lg:w-[110px] items-center justify-center transition-all duration-300"
          >
            <img
              src="/logo/logo.png"
              alt="Samlot Diamond Resort"
              class="h-full w-full object-contain"
            >
          </div>
        </NuxtLink>

        <p
          class="mt-5 md:mt-6 max-w-[280px] text-sm md:text-base lg:text-sm xl:text-base leading-relaxed text-white/70"
        >
          Experience luxury accommodations,
          natural beauty and unforgettable moments
          in the heart of Samlot.
        </p>

        <p class="mt-5 md:mt-6 text-xs md:text-sm text-white/50">
          © 2026 Samlot Diamond Resort.
          <br>
          All rights reserved.
        </p>
      </div>

      <!-- Explore -->
      <div class="text-center sm:text-left">
        <h4
          class="mb-4 md:mb-6 text-sm md:text-base font-medium uppercase tracking-[2px]"
        >
          Explore
        </h4>

        <ul class="space-y-3 md:space-y-4">
          <li>
            <NuxtLink
              to="/"
              class="text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
            >
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/rooms"
              class="text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
            >
              Rooms
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/experiences"
              class="text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
            >
              Experiences
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/gallery"
              class="text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
            >
              Gallery
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/blog"
              class="text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
            >
              Blog
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/booking"
              class="text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
            >
              Book Now
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="text-center sm:text-left">
        <h4
          class="mb-4 md:mb-6 text-sm md:text-base font-medium uppercase tracking-[2px]"
        >
          Contact
        </h4>

        <p
          class="mb-4 md:mb-5 text-sm md:text-base lg:text-sm xl:text-base leading-relaxed text-white/70"
        >
          Chamkar Ta Chamnab, near Checkpoint 400,
          Vireak Chey Village, Samlout Commune,
          Samlout District, Battambang Province.
        </p>

        <a
          href="mailto:info@samlotdiamondresort.com"
          class="block text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
        >
          info@samlotdiamondresort.com
        </a>

        <a
          href="tel:+855965533359"
          class="mt-2 md:mt-3 block text-sm md:text-base lg:text-sm xl:text-base text-white/70 transition hover:text-[#D4AF37]"
        >
          +855 96 553 3359
        </a>
      </div>

      <!-- Newsletter -->
      <div class="text-center sm:text-left">
        <h4
          class="mb-4 md:mb-6 text-sm md:text-base font-medium uppercase tracking-[2px]"
        >
          Newsletter
        </h4>

        <p
          class="mb-5 md:mb-6 text-sm md:text-base lg:text-sm xl:text-base text-white/70"
        >
          Stay updated with our latest offers,
          promotions and resort news.
        </p>

        <form
          class="mb-8 md:mb-10 flex flex-col gap-3 lg:flex-col xl:flex-row xl:gap-2"
          @submit.prevent="subscribe"
        >
          <input
            v-model="email"
            type="email"
            required
            placeholder="Your email address"
            class="flex-1 rounded border border-white/20 bg-transparent px-4 py-3 md:px-5 md:py-3.5 text-sm md:text-base text-white outline-none placeholder:text-white/40 focus:border-[#D4AF37] transition-colors"
          >

          <button
            class="rounded bg-[#D4AF37] px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-medium text-black transition hover:bg-[#c79d26] whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>

        <div
          class="flex justify-center sm:justify-start gap-4 md:gap-5"
        >
          <a
            href="#"
            class="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#D4AF37] group"
          >
            <img
              src="/picture/facebook.png"
              alt="Facebook"
              class="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110"
            >
          </a>

          <a
            href="#"
            class="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#D4AF37] group"
          >
            <img
              src="/picture/instagram.png"
              alt="Instagram"
              class="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110"
            >
          </a>

          <a
            href="#"
            class="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#D4AF37] group"
          >
            <img
              src="/picture/telegram.png"
              alt="Telegram"
              class="h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:scale-110"
            >
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

const subscribe = () => {
  console.log('Newsletter signup:', email.value)
  email.value = ''
  alert('Thank you for subscribing!')
}
</script>