<script setup lang="ts">
import { useHead } from '#imports'

// import { useBooking } from '~/composables/useBooking'

useHead({
  title: 'Book Your Stay | Samlot Diamond Resort'
})

const {
  form,
  rooms,
  errors,
  status,
  serverError,
  available,
  nights,
  rate,
  total,
  bookingCode,
  reset,
  submit
} = useBooking()

const inputClass = "w-full rounded-xl sm:rounded-2xl bg-black/20 border border-white/10 p-3 sm:p-4 text-sm sm:text-base text-white outline-none transition-all placeholder:text-white/40 focus:border-white/30 focus:bg-black/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md"
const labelClass = "mb-1 sm:mb-2 block text-xs sm:text-sm font-medium text-white/80 ml-1 sm:ml-2"
</script>

<template>
  <div class="relative min-h-screen bg-neutral-950 font-sans selection:bg-white/30 text-white">
    
    <!-- Fixed Background Image -->
    <div class="fixed inset-0 z-0">
      <img
        src="/picture/43.jpg"
        alt="Background"
        class="h-full w-full object-cover"
      >
      <div class="absolute inset-0 bg-neutral-900/60 mix-blend-multiply" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
    </div>

    <!-- Main Content -->
    <div class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-12 sm:px-6 md:pb-16 lg:px-8 lg:pb-20">
      
      <!-- HERO -->
      <header class="mb-12 pt-[100px] text-center sm:mb-16 lg:mb-20 lg:pt-[140px]">
        <p class="mb-2 sm:mb-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/60">
          Reservation
        </p>
        <h1 class="font-serif text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Book Your Stay
        </h1>
      </header>
      
      <!-- SUCCESS -->
      <div
        v-if="status === 'sent'"
        class="rounded-[28px] md:rounded-[32px] xl:rounded-[36px] border border-white/20 bg-white/90 p-8 md:p-12 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.12)]"
      >
        <!-- your existing success content -->
      </div>

      <!-- LOADING -->
      <div
        v-else-if="status === 'sending'"
        class="rounded-3xl sm:rounded-[2.5rem] bg-white/10 p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl border border-white/10 text-center"
      >
        <h2 class="font-serif text-xl sm:text-2xl md:text-3xl">
          Processing Reservation
        </h2>
        <p class="mt-4 text-white/60">
          Please wait while we submit your reservation request.
        </p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="status === 'error'"
        class="rounded-3xl sm:rounded-[2.5rem] bg-white/10 p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl border border-red-500/20 text-center"
      >
        <h2 class="font-serif text-xl sm:text-2xl md:text-3xl">
          Reservation Failed
        </h2>
        <p class="mt-4 text-red-300">
          {{ serverError }}
        </p>
        <button
          type="button"
          class="mt-8 w-full sm:w-auto rounded-xl sm:rounded-2xl bg-[#D4AF37] px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-black transition-all hover:bg-[#c89c2b]"
          @click="reset"
        >
          Try Again
        </button>
      </div>

      <div class="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_400px] lg:gap-10 xl:gap-12 lg:items-start">
  
        <!-- Form -->
        <form
          class="rounded-3xl sm:rounded-[2.5rem] bg-white/10 p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl border border-white/10"
          @submit.prevent="submit"
        >
          <h2 class="mb-6 sm:mb-8 font-serif text-xl sm:text-2xl md:text-3xl">
            Reservation Details
          </h2>

          <div class="grid gap-4 sm:gap-6 sm:grid-cols-2">

            <!-- Room -->
            <div class="col-span-1 sm:col-span-2">
              <label :class="labelClass">Room</label>
              <select v-model="form.room" :class="inputClass">
                <option value="" disabled class="bg-neutral-900 text-white ">Select a room...</option>
                <option v-for="room in rooms" :key="room.id" :value="room.name" class="bg-neutral-900 text-white">
                  {{ room.name }}
                </option>
              </select>
              <p v-if="errors.room" class="mt-1 sm:mt-2 ml-1 text-xs sm:text-sm text-red-400">{{ errors.room }}</p>
            </div>

            <!-- Native HTML Check In Datepicker -->
            <div class="col-span-1">
              <label :class="labelClass">Check In</label>
              <div class="relative group cursor-pointer">
                <!-- Custom Gold Hover Icon -->
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 transition-colors duration-300 group-hover:text-[#D4AF37]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <!-- Native Input Field (Forces light popup) -->
                <input 
                  v-model="form.checkIn"
                  type="date" 
                  class="native-date-input w-full cursor-pointer rounded-xl sm:rounded-2xl bg-black/20 border border-white/10 py-3 sm:py-4 pl-12 pr-4 text-sm sm:text-base text-white outline-none transition-all focus:border-white/30 focus:bg-black/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md group-hover:bg-black/30 [color-scheme:light]"
                >
              </div>
              <p v-if="errors.checkIn" class="mt-1 sm:mt-2 ml-1 text-xs sm:text-sm text-red-400">{{ errors.checkIn }}</p>
            </div>

            <!-- Native HTML Check Out Datepicker -->
            <div class="col-span-1">
              <label :class="labelClass">Check Out</label>
              <div class="relative group cursor-pointer">
                <!-- Custom Gold Hover Icon -->
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/40 transition-colors duration-300 group-hover:text-[#D4AF37]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <!-- Native Input Field (Forces light popup) -->
                <input 
                  v-model="form.checkOut"
                  type="date" 
                  class="native-date-input w-full cursor-pointer rounded-xl sm:rounded-2xl bg-black/20 border border-white/10 py-3 sm:py-4 pl-12 pr-4 text-sm sm:text-base text-white outline-none transition-all focus:border-white/30 focus:bg-black/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md group-hover:bg-black/30 [color-scheme:light]"
                >
              </div>
              <p v-if="errors.checkOut" class="mt-1 sm:mt-2 ml-1 text-xs sm:text-sm text-red-400">{{ errors.checkOut }}</p>
            </div>

            <!-- Adults -->
            <div class="col-span-1">
              <label :class="labelClass">Adults</label>
              <input v-model.number="form.adults" type="number" min="1" :class="inputClass">
            </div>

            <!-- Children -->
            <div class="col-span-1">
              <label :class="labelClass">Children</label>
              <input v-model.number="form.children" type="number" min="0" :class="inputClass">
            </div>

            <!-- First Name -->
            <div class="col-span-1">
              <label :class="labelClass">First Name</label>
              <input v-model="form.firstName" type="text" placeholder="John" :class="inputClass">
            </div>

            <!-- Last Name -->
            <div class="col-span-1">
              <label :class="labelClass">Last Name</label>
              <input v-model="form.lastName" type="text" placeholder="Doe" :class="inputClass">
            </div>

            <!-- Email -->
            <div class="col-span-1">
              <label :class="labelClass">Email</label>
              <input v-model="form.email" type="email" placeholder="john@example.com" :class="inputClass">
            </div>

            <!-- Phone -->
            <div class="col-span-1">
              <label :class="labelClass">Phone</label>
              <input v-model="form.phone" type="text" placeholder="+855" :class="inputClass">
            </div>

            <!-- Nationality -->
            <div class="col-span-1 sm:col-span-2">
              <label :class="labelClass">Nationality</label>
              <input v-model="form.nationality" type="text" placeholder="e.g. Cambodian" :class="inputClass">
            </div>

            <!-- Notes -->
            <div class="col-span-1 sm:col-span-2">
              <label :class="labelClass">Special Request</label>
              <textarea v-model="form.notes" rows="4" placeholder="Any special requests..." :class="inputClass" />
            </div>
          </div>

          <!-- Errors & Submit -->
          <div v-if="serverError" class="mt-4 sm:mt-6 rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-red-200">
            {{ serverError }}
          </div>

          <div class="mt-6 sm:mt-8 flex justify-end">
            <button
              type="submit"
              :disabled="status === 'sending'"
              class="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-[#D4AF37] px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-black transition-all hover:bg-[#c89c2b] active:scale-[0.98] disabled:opacity-50"
            >
              {{ status === 'sending' ? 'Submitting...' : 'Confirm Booking' }}
            </button>
          </div>
        </form>

        <!-- Sidebar Summary -->
        <aside class="sticky top-6 sm:top-8 h-fit rounded-3xl sm:rounded-[2.5rem] bg-white/10 p-5 sm:p-8 shadow-2xl backdrop-blur-2xl border border-white/10">
          <h3 class="font-serif text-xl sm:text-2xl md:text-3xl">Summary</h3>
          <div class="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div class="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-4 text-sm sm:text-base">
              <p class="text-white/60">Room</p>
              <p class="font-medium text-right max-w-[120px] sm:max-w-[150px] truncate">{{ form.room || 'None selected' }}</p>
            </div>
            <div class="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-4 text-sm sm:text-base">
              <p class="text-white/60">Check In</p>
              <p class="font-medium">{{ form.checkIn || '-' }}</p>
            </div>
            <div class="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-4 text-sm sm:text-base">
              <p class="text-white/60">Check Out</p>
              <p class="font-medium">{{ form.checkOut || '-' }}</p>
            </div>
            <div class="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-4 text-sm sm:text-base">
              <p class="text-white/60">Nights</p>
              <p class="font-medium">{{ nights }}</p>
            </div>
            <div class="flex justify-between items-center border-b border-white/10 pb-3 sm:pb-4 text-sm sm:text-base">
              <p class="text-white/60">Rate</p>
              <p class="font-medium">${{ rate }} <span class="text-xs font-normal text-white/50">/ night</span></p>
            </div>
          </div>

          <div class="mt-6 rounded-xl sm:rounded-2xl bg-black/20 p-5 sm:p-6 border border-white/5 backdrop-blur-md">
            <div class="flex items-center justify-between">
              <span class="text-base sm:text-lg text-white/80">Total</span>
              <span class="font-serif text-2xl sm:text-3xl md:text-4xl text-[#D4AF37]">
                ${{ total }}
              </span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hides the default browser calendar icon but stretches its clickable area over the entire input */
.native-date-input::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* Ensures the date text is properly aligned next to our custom SVG icon */
.native-date-input::-webkit-datetime-edit {
  padding-left: 0.25rem;
}
</style>