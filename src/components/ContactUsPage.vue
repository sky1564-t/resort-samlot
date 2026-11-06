<script setup lang="ts">
import { useContact } from '~/composables/useContact'

useHead({ title: 'Contact – Samlot Diamond Resort' })

// Fetch logic and state from the composable
const { form, errors, status, inquiryTypes, isReservation, submitContact } = useContact()

// Shared classes for form inputs
const label = 'mb-2 block text-[13px] text-neutral-600 dark:text-neutral-400'
const input =
  'w-full rounded-xl border border-transparent bg-[#f1efeb] px-4 py-3.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-100'
</script>

<template>
  <div class="min-h-screen text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
    style="background-image: url('/picture/34.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;"
  >
    <div class="mx-auto w-full max-w-8xl px-5 py-12 sm:px-8 md:py-16">
      <!-- Top: intro + form -->
      <div class="grid gap-10 md:grid-cols-2 md:gap-16 mt-20">
        <!-- Left: Contact Info -->
        <section class="flex flex-col justify-between gap-12">
          <div>
            <span
              class="inline-flex items-center gap-2 rounded-xl bg-[#e6e3dd] px-3 py-1.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
                <path d="M9 11h6M9 14h4" />
              </svg>
              Get in Touch
            </span>
            <h1 class="mt-6 text-5xl font-medium tracking-tight md:text-6xl">Contact Us</h1>
            <p class="mt-4 max-w-sm text-lg text-neutral-600 dark:text-neutral-400">
              We’re here to help you plan your stay in the forest and mountains of Samlot.
            </p>
          </div>

          <ul class="space-y-5">
            <li class="flex items-center gap-4">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e6e3dd] dark:bg-neutral-800">
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
              </span>
              <div>
                <p class="text-sm font-medium">Resort Location</p>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">Samlot District, Battambang, Cambodia</p>
              </div>
            </li>
            <li class="flex items-center gap-4">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e6e3dd] dark:bg-neutral-800">
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                </svg>
              </span>
              <div>
                <p class="text-sm font-medium">Phone</p>
                <p class="text-sm text-neutral-600 dark:text-neutral-400">Daily, 8:00 AM to 8:00 PM</p>
              </div>
            </li>
            <li class="flex items-center gap-4">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e6e3dd] dark:bg-neutral-800">
                <svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div>
                <p class="text-sm font-medium">Email</p>
                <a href="mailto:reservations@samlotdiamond.com" class="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                  reservations@samlotdiamond.com
                </a>
              </div>
            </li>
          </ul>
        </section>

        <!-- Right: form card -->
        <form
          class="self-start rounded-xl bg-white/70 backdrop-blur-md p-5 sm:p-6"
          novalidate
          @submit.prevent="submitContact"
        >
          <div v-if="status === 'success'" class="py-20 text-center" role="status">
            <div class="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#e6e3dd] dark:bg-neutral-800">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            </div>
            <h2 class="mt-4 text-2xl font-medium tracking-tight">Thank you</h2>
            <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">We’ve received your message and will reply within one day.</p>
          </div>

          <div v-else class="grid gap-4">
            <div>
              <label for="name" :class="label">Full Name</label>
              <input id="name" v-model="form.name" autocomplete="name" placeholder="Your name" :class="[input, errors.name && '!border-red-500']" />
              <p v-if="errors.name" class="mt-1.5 px-4 text-xs text-red-600">{{ errors.name }}</p>
            </div>

            <div>
              <label for="phone" :class="label">Phone Number</label>
              <input id="phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="Your phone number" :class="[input, errors.phone && '!border-red-500']" />
              <p v-if="errors.phone" class="mt-1.5 px-4 text-xs text-red-600">{{ errors.phone }}</p>
            </div>

            <div>
              <label for="email" :class="label">Email</label>
              <input id="email" v-model="form.email" type="email" autocomplete="email" placeholder="Your email" :class="[input, errors.email && '!border-red-500']" />
              <p v-if="errors.email" class="mt-1.5 px-4 text-xs text-red-600">{{ errors.email }}</p>
            </div>

            <div>
              <label for="inquiry" :class="label">Inquiry Type</label>
              <div class="relative">
                <select id="inquiry" v-model="form.inquiry" :class="[input, 'appearance-none pr-10']">
                  <option v-for="t in inquiryTypes" :key="t">{{ t }}</option>
                </select>
                <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-700 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <!-- Optional Date Fields for Reservations -->
            <div v-if="isReservation" class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="checkIn" :class="label">Check-in</label>
                <input id="checkIn" v-model="form.checkIn" type="date" :class="[input, errors.checkIn && '!border-red-500']" />
                <p v-if="errors.checkIn" class="mt-1.5 px-4 text-xs text-red-600">{{ errors.checkIn }}</p>
              </div>
              <div>
                <label for="checkOut" :class="label">Check-out</label>
                <input id="checkOut" v-model="form.checkOut" type="date" :min="form.checkIn" :class="[input, errors.checkOut && '!border-red-500']" />
                <p v-if="errors.checkOut" class="mt-1.5 px-4 text-xs text-red-600">{{ errors.checkOut }}</p>
              </div>
            </div>

            <div>
              <label for="message" :class="label">Message (Optional)</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="4"
                placeholder="Tell us more about your stay."
                :class="[input, 'resize-y rounded-xl text-left']"
              />
            </div>

            <!-- Backend Error Rendering -->
            <p v-if="status === 'error'" class="text-sm text-red-600" role="alert">
              {{ errors.backend || "We couldn’t send your message. Check your connection and try again." }}
            </p>

            <button
              type="submit"
              :disabled="status === 'sending'"
              class="rounded-xl bg-[#151515] py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900 dark:focus-visible:outline-neutral-100"
            >
              {{ status === 'sending' ? 'Sending…' : 'Submit' }}
            </button>

            <div>
              <label class="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                <input
                  v-model="form.agree"
                  type="checkbox"
                  class="h-4 w-4 shrink-0 rounded border-0 bg-[#e6e3dd] accent-[#151515] dark:bg-neutral-800 dark:accent-neutral-100"
                />
                <span>
                  By submitting this form, I agree to the
                  <a href="/privacy" class="font-medium text-neutral-900 dark:text-neutral-100">Privacy Policy.</a>
                </span>
              </label>
              <p v-if="errors.agree" class="mt-1.5 text-xs text-red-600">{{ errors.agree }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>