<script setup lang="ts">
useHead({ title: 'Book Your Stay – Samlot Diamond Resort' })

// All booking logic lives in composables/useBooking.ts
const { form, rooms, errors, status, serverError, available, today, nights, rate, total, submit } = useBooking()

const field =
  'w-full rounded border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-[#a8895b] dark:bg-neutral-900 dark:text-neutral-100'
const ok = 'border-neutral-200 dark:border-neutral-800'
</script>

<template>
  <div class="bg-[#c9bcae] dark:bg-black">
    <!-- Hero bar -->
    <section class="relative h-[45vh] min-h-[360px] w-full overflow-hidden">
      <img src="/picture/2.jpg" alt="Samlot Diamond Resort" class="hero-image fade absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black/45" />
      <div class="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 class="font-serif text-4xl md:text-6xl">Book Your Stay</h1>
        <p class="mt-3 text-white/80">Choose your dates and room. We confirm every booking by email.</p>
      </div>
    </section>

    <div class="relative -mt-20 px-4 pb-12">
      <div class="mx-auto max-w-5xl bg-white p-5 text-neutral-900 sm:p-8 md:p-12 dark:bg-neutral-950 dark:text-neutral-100">
        <div v-if="status === 'sent'" class="py-16 text-center" role="status">
          <div class="font-serif text-4xl text-[#a8895b]">◇</div>
          <h2 class="mt-2 font-serif text-3xl">Booking request received</h2>
          <p class="mt-2 text-neutral-500">We will email {{ form.email }} within one day to confirm.</p>
          <NuxtLink to="/" class="mt-8 inline-block rounded-full bg-[#151a18] px-8 py-3 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">Back to home</NuxtLink>
        </div>

        <form v-else class="grid gap-8 md:grid-cols-[1fr_320px]" novalidate @submit.prevent="submit">
          <!-- Details -->
          <div class="grid gap-5">
            <div>
              <label for="room" class="mb-1.5 block text-sm font-medium">Room</label>
              <select id="room" v-model="form.room" :class="[field, errors.room ? 'border-red-500' : ok]">
                <option v-if="!rooms?.length" value="" disabled>No rooms available right now</option>
                <option v-for="r in rooms" :key="r.id" :value="r.name">{{ r.name }} · ${{ Number(r.price_per_night) }} / night · sleeps {{ r.capacity }}</option>
              </select>
              <p v-if="errors.room" class="mt-1 text-xs text-red-600">{{ errors.room }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="checkIn" class="mb-1.5 block text-sm font-medium">Check-in</label>
                <input id="checkIn" v-model="form.checkIn" type="date" :min="today" :class="[field, errors.checkIn ? 'border-red-500' : ok]" />
                <p v-if="errors.checkIn" class="mt-1 text-xs text-red-600">{{ errors.checkIn }}</p>
              </div>
              <div>
                <label for="checkOut" class="mb-1.5 block text-sm font-medium">Check-out</label>
                <input id="checkOut" v-model="form.checkOut" type="date" :min="form.checkIn || today" :class="[field, errors.checkOut ? 'border-red-500' : ok]" />
                <p v-if="errors.checkOut" class="mt-1 text-xs text-red-600">{{ errors.checkOut }}</p>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="adults" class="mb-1.5 block text-sm font-medium">Adults</label>
                <input id="adults" v-model.number="form.adults" type="number" min="1" max="10" :class="[field, errors.adults ? 'border-red-500' : ok]" />
                <p v-if="errors.adults" class="mt-1 text-xs text-red-600">{{ errors.adults }}</p>
              </div>
              <div>
                <label for="children" class="mb-1.5 block text-sm font-medium">Children</label>
                <input id="children" v-model.number="form.children" type="number" min="0" max="10" :class="[field, ok]" />
              </div>
            </div>

            <div>
              <label for="name" class="mb-1.5 block text-sm font-medium">Full name</label>
              <input id="name" v-model="form.name" :class="[field, errors.name ? 'border-red-500' : ok]" placeholder="Enter your full name" />
              <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="email" class="mb-1.5 block text-sm font-medium">Email</label>
                <input id="email" v-model="form.email" type="email" :class="[field, errors.email ? 'border-red-500' : ok]" placeholder="Enter your email" />
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
              </div>
              <div>
                <label for="phone" class="mb-1.5 block text-sm font-medium">Phone</label>
                <input id="phone" v-model="form.phone" type="tel" :class="[field, ok]" placeholder="+855" />
              </div>
            </div>

            <div>
              <label for="notes" class="mb-1.5 block text-sm font-medium">Special requests</label>
              <textarea id="notes" v-model="form.notes" rows="3" :class="[field, ok, 'resize-y']" placeholder="Arrival time, dietary needs, celebrations" />
            </div>
          </div>

          <!-- Summary -->
          <aside class="self-start rounded bg-neutral-100 p-6 dark:bg-neutral-900">
            <h2 class="font-serif text-2xl">Your stay</h2>
            <dl class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-neutral-500">Room</dt><dd>{{ form.room || '–' }}</dd></div>
              <div class="flex justify-between"><dt class="text-neutral-500">Rate</dt><dd>${{ rate }} / night</dd></div>
              <div class="flex justify-between"><dt class="text-neutral-500">Nights</dt><dd>{{ nights || '–' }}</dd></div>
              <div class="flex justify-between"><dt class="text-neutral-500">Guests</dt><dd>{{ form.adults }} adults, {{ form.children }} children</dd></div>
            </dl>
            <div class="mt-5 flex items-baseline justify-between border-t border-neutral-300 pt-4 dark:border-neutral-700">
              <span class="text-sm text-neutral-500">Estimated total</span>
              <span class="font-serif text-3xl text-[#a8895b]">{{ nights ? `$${total}` : '–' }}</span>
            </div>
            <p v-if="available === true" class="mt-4 text-sm text-green-700 dark:text-green-500">These dates are available.</p>
            <p v-else-if="available === false" class="mt-4 text-sm text-red-600">These dates are not available for this room.</p>
            <p v-if="status === 'error'" class="mt-4 text-sm text-red-600" role="alert">{{ serverError || 'Please check the highlighted fields and try again.' }}</p>
            <button
              type="submit"
              :disabled="status === 'sending'"
              class="mt-5 w-full rounded-full bg-[#151a18] py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
            >
              {{ status === 'sending' ? 'Sending…' : 'Request booking' }}
            </button>
            <p class="mt-3 text-center text-xs text-neutral-500">No payment now. We confirm availability first.</p>
          </aside>
        </form>
      </div>
    </div>
  </div>
</template>