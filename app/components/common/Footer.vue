<template>
  <footer
    class="border-t border-white/10 bg-black/70 px-4 pb-10 pt-16 text-white backdrop-blur-[15px]"
  >
    <div
      class="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr]"
    >

      <!-- Brand -->

      <div
        class="text-center md:text-left"
      >
        <NuxtLink
          to="/"
          class="inline-flex flex-col items-center md:items-start"
        >
          <div
            class="flex h-[100px] w-[100px] items-center justify-center"
          >
            <img
              src="/logo/logo.png"
              alt="Samlot Diamond Resort"
            >
          </div>
        </NuxtLink>

        <p
          class="mt-5 max-w-[280px] text-sm leading-relaxed text-white/70"
        >
          Experience luxury accommodations,
          natural beauty and unforgettable moments
          in the heart of Samlot.
        </p>

        <p
          class="mt-5 text-sm text-white/50"
        >
          © 2026 Samlot Diamond Resort.
          <br>
          All rights reserved.
        </p>
      </div>

      <!-- Explore -->

      <div
        class="text-center md:text-left"
      >
        <h4
          class="mb-5 text-sm font-medium uppercase tracking-[2px]"
        >
          Explore
        </h4>

        <ul
          class="space-y-3"
        >
          <li>
            <NuxtLink
              to="/"
              class="text-white/70 transition hover:text-[#D4AF37]"
            >
              Home
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/rooms"
              class="text-white/70 transition hover:text-[#D4AF37]"
            >
              Rooms
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/experiences"
              class="text-white/70 transition hover:text-[#D4AF37]"
            >
              Experiences
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/gallery"
              class="text-white/70 transition hover:text-[#D4AF37]"
            >
              Gallery
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/blog"
              class="text-white/70 transition hover:text-[#D4AF37]"
            >
              Blog
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/booking"
              class="text-white/70 transition hover:text-[#D4AF37]"
            >
              Book Now
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact -->

      <div
        class="text-center md:text-left"
      >
        <h4
          class="mb-5 text-sm font-medium uppercase tracking-[2px]"
        >
          Contact
        </h4>

        <p
          class="mb-4 text-sm leading-relaxed text-white/70"
        >
          Chamkar Ta Chamnab, near Checkpoint 400,
          Vireak Chey Village, Samlout Commune,
          Samlout District, Battambang Province.
        </p>

        <a
          href="mailto:info@samlotdiamondresort.com"
          class="block text-white/70 transition hover:text-[#D4AF37]"
        >
          info@samlotdiamondresort.com
        </a>

        <a
          href="tel:+855965533359"
          class="mt-2 block text-white/70 transition hover:text-[#D4AF37]"
        >
          +855 96 553 3359
        </a>
      </div>

      <!-- Newsletter -->

      <div
        class="text-center md:text-left"
      >
        <h4
          class="mb-5 text-sm font-medium uppercase tracking-[2px]"
        >
          Newsletter
        </h4>

        <p
          class="mb-5 text-sm text-white/70"
        >
          Stay updated with our latest offers,
          promotions and resort news.
        </p>

        <form
          class="mb-8 flex flex-col gap-3 sm:flex-row"
          @submit.prevent="subscribe"
        >
          <input
            v-model="email"
            type="email"
            required
            placeholder="Your email address"
            class="flex-1 rounded border border-white/20 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#D4AF37]"
          >

          <button
            class="rounded bg-[#D4AF37] px-5 py-3 font-medium text-black transition hover:bg-[#c79d26]"
          >
            Subscribe
          </button>
        </form>

        <div
          class="flex justify-center gap-4 md:justify-start"
        >
          <a
            href="#"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#D4AF37]"
          >
            <img
              src="/picture/facebook.png"
              alt="Facebook"
              class="h-5 w-5"
            >
          </a>

          <a
            href="#"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#D4AF37]"
          >
            <img
              src="/picture/instagram.png"
              alt="Instagram"
              class="h-5 w-5"
            >
          </a>

          <a
            href="#"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#D4AF37]"
          >
            <img
              src="/picture/telegram.png"
              alt="Telegram"
              class="h-5 w-5"
            >
          </a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const email = ref('')

const subscribe = () => {
  console.log('Newsletter signup:', email.value)

  email.value = ''

  alert('Thank you for subscribing!')
}
</script>