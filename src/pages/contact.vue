<script setup lang="ts">
useHead({ title: 'Contact – Samlot Diamond Resort' })

const inquiryTypes = ['Room reservation', 'Event or wedding', 'Group or retreat', 'Other question']

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  checkIn: '',
  checkOut: '',
  inquiry: inquiryTypes[0],
  message: '',
})

const errors = reactive<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

function validate() {
  errors.firstName = form.firstName.trim() ? '' : 'Enter your first name.'
  errors.lastName = form.lastName.trim() ? '' : 'Enter your last name.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email address.'
  return !Object.values(errors).some(Boolean)
}

async function submit() {
  if (!validate()) return
  status.value = 'sending'
  try {
    // Replace with your own endpoint: server/api/contact.post.ts
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    status.value = 'sent'
  } catch {
    status.value = 'error'
  }
}

const field =
  'w-full rounded border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#a8895b] dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500'
</script>

<template>
  <div class="min-h-screen bg-[#c9bcae] dark:bg-black">
    <!-- Hero bar -->
    <section class="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      <img
        src="/picture/2.jpg"
        alt="Samlot Diamond Resort among forest and mountains"
        class="hero-image fade absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-black/40" />
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 class="font-serif text-4xl md:text-6xl">Contact Us</h1>
        <p class="mt-3 text-white/80">Questions, reservations or events: we reply within one day.</p>
      </div>
    </section>

    <!-- Card overlaps the hero -->
    <div class="relative -mt-20 px-4 pb-12">
    <main
      class="mx-auto grid w-full max-w-5xl gap-8 bg-white p-5 text-neutral-900 sm:p-8 md:grid-cols-2 md:gap-12 md:p-14 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <!-- Left: intro + scene -->
      <section>
        <h2 class="font-serif text-4xl leading-tight md:text-5xl">
          Connect with Us for
          <em class="block">Your Next Stay</em>
        </h2>
        <p class="mt-4 max-w-md text-neutral-500 dark:text-neutral-400">
          Send us a message through the form, or call during our reservation hours, every day from
          8:00 AM to 8:00 PM. Let’s plan your escape into the forest and mountains.
        </p>

        <div class="my-6 flex items-center gap-3 text-[#a8895b]">
          <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          ◇
          <span class="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div
          class="relative aspect-[4/4.6] overflow-hidden rounded bg-gradient-to-b from-[#e8d5b0] via-[#b98c5a] to-[#14221a] text-white"
          role="img"
          aria-label="Forest and mountain scenery at dusk"
        >
          <svg
            class="absolute inset-0 h-full w-full"
            viewBox="0 0 400 460"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <circle cx="285" cy="150" r="34" fill="#fff4d6" opacity=".85" />
            <path d="M0 300 L90 190 L160 260 L250 160 L340 250 L400 210 L400 460 L0 460Z" fill="#4c6a58" opacity=".75" />
            <path d="M0 340 L80 270 L170 330 L260 250 L400 340 L400 460 L0 460Z" fill="#2c4636" />
            <g fill="#14221a">
              <path d="M20 460 L45 360 L70 460Z" />
              <path d="M60 460 L90 340 L120 460Z" />
              <path d="M300 460 L330 350 L360 460Z" />
              <path d="M345 460 L372 370 L400 460Z" />
            </g>
          </svg>
          <p class="absolute left-6 top-6 font-serif text-3xl leading-tight drop-shadow">
            Unlock the View
            <em class="block">of Forest &amp; Mountain</em>
          </p>
          <p class="absolute inset-x-6 bottom-5 text-sm text-stone-100">
            Quiet luxury, surrounded by nature in Samlot.
          </p>
        </div>

        <div class="mt-5 space-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          <p><b class="font-medium text-neutral-900 dark:text-neutral-100">Samlot Diamond Resort</b> · Samlot District, Battambang, Cambodia</p>
          <p>reservations@samlotdiamond.com</p>
        </div>
      </section>

      <!-- Right: form -->
      <form
        class="self-start rounded bg-neutral-100 p-5 sm:p-8 dark:bg-neutral-900"
        novalidate
        @submit.prevent="submit"
      >
        <div v-if="status === 'sent'" class="py-12 text-center" role="status">
          <div class="font-serif text-4xl text-[#a8895b]">◇</div>
          <h2 class="mt-2 font-serif text-3xl">Thank you</h2>
          <p class="mt-1 text-neutral-500">We’ve received your message and will reply shortly.</p>
        </div>

        <div v-else class="grid gap-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="firstName" class="mb-1.5 block text-sm font-medium">First name</label>
              <input id="firstName" v-model="form.firstName" :class="[field, errors.firstName ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800']" placeholder="Enter your first name" />
              <p v-if="errors.firstName" class="mt-1 text-xs text-red-600">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="lastName" class="mb-1.5 block text-sm font-medium">Last name</label>
              <input id="lastName" v-model="form.lastName" :class="[field, errors.lastName ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800']" placeholder="Enter your last name" />
              <p v-if="errors.lastName" class="mt-1 text-xs text-red-600">{{ errors.lastName }}</p>
            </div>
          </div>

          <div>
            <label for="phone" class="mb-1.5 block text-sm font-medium">Phone</label>
            <div class="flex">
              <span class="flex items-center rounded-l border border-r-0 border-neutral-200 bg-white px-3 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">+855</span>
              <input id="phone" v-model="form.phone" type="tel" :class="[field, 'rounded-l-none border-neutral-200 dark:border-neutral-800']" placeholder="Enter your phone" />
            </div>
          </div>

          <div>
            <label for="email" class="mb-1.5 block text-sm font-medium">Email</label>
            <input id="email" v-model="form.email" type="email" :class="[field, errors.email ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800']" placeholder="Enter your email" />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="checkIn" class="mb-1.5 block text-sm font-medium">Check-in</label>
              <input id="checkIn" v-model="form.checkIn" type="date" :class="[field, 'border-neutral-200 dark:border-neutral-800']" />
            </div>
            <div>
              <label for="checkOut" class="mb-1.5 block text-sm font-medium">Check-out</label>
              <input id="checkOut" v-model="form.checkOut" type="date" :min="form.checkIn" :class="[field, 'border-neutral-200 dark:border-neutral-800']" />
            </div>
          </div>

          <div>
            <label for="inquiry" class="mb-1.5 block text-sm font-medium">Inquiry</label>
            <select id="inquiry" v-model="form.inquiry" :class="[field, 'border-neutral-200 dark:border-neutral-800']">
              <option v-for="t in inquiryTypes" :key="t">{{ t }}</option>
            </select>
          </div>

          <div>
            <label for="message" class="mb-1.5 block text-sm font-medium">Message</label>
            <textarea id="message" v-model="form.message" rows="4" :class="[field, 'resize-y border-neutral-200 dark:border-neutral-800']" placeholder="Tell us about your stay" />
          </div>

          <p v-if="status === 'error'" class="text-sm text-red-600" role="alert">
            We couldn’t send your message. Check your connection and try again.
          </p>

          <button
            type="submit"
            :disabled="status === 'sending'"
            class="rounded-full bg-[#151a18] py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {{ status === 'sending' ? 'Sending…' : 'Send message' }}
          </button>
        </div>
      </form>
    </main>
    </div>
  </div>
</template>