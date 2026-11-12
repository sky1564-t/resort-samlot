<script setup lang="ts">

import '@vuepic/vue-datepicker/dist/main.css'

// If used on the home page, you might want to redirect to /booking on submit.
// If used directly on the booking page, it simply updates the composable state.
const { form } = useBooking()

const handleSearch = () => {
  // If you place this on the Home page, redirect to the booking page:
  // navigateTo('/booking')
  
  // If it's already on the booking page, you can scroll down to the form:
  document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })
}

const inputClass = "w-full bg-transparent p-3 text-sm sm:text-base text-white outline-none transition-all placeholder:text-white/50 focus:bg-white/5"
const labelClass = "block text-xs font-medium uppercase tracking-wider text-[#D4AF37] mb-1 px-3 pt-3"
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-4 sm:px-6">
    
    <form 
      @submit.prevent="handleSearch"
      class="flex flex-col overflow-hidden rounded-3xl sm:rounded-full bg-white/10 shadow-2xl backdrop-blur-2xl border border-white/10 md:flex-row md:items-center"
    >
      
      <!-- Check In -->
      <div class="flex-1 border-b border-white/10 md:border-b-0 md:border-r">
        <label :class="labelClass">Check In</label>
        <ClientOnly>
          <VueDatePicker 
            v-model="form.checkIn" 
            :enable-time-picker="false"
            auto-apply
            dark
            model-type="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="Add date"
            hide-input-icon
            class="search-datepicker"
          />
        </ClientOnly>
      </div>

      <!-- Check Out -->
      <div class="flex-1 border-b border-white/10 md:border-b-0 md:border-r">
        <label :class="labelClass">Check Out</label>
        <ClientOnly>
          <VueDatePicker 
            v-model="form.checkOut" 
            :enable-time-picker="false"
            auto-apply
            dark
            model-type="yyyy-MM-dd"
            format="yyyy-MM-dd"
            placeholder="Add date"
            hide-input-icon
            class="search-datepicker"
          />
        </ClientOnly>
      </div>

      <!-- Guests (Adults) -->
      <div class="flex-1 border-b border-white/10 md:border-b-0 md:border-r">
        <label :class="labelClass">Guests</label>
        <select v-model.number="form.adults" :class="inputClass" style="appearance: none;">
          <option value="1" class="bg-neutral-900 text-white">1 Adult</option>
          <option value="2" class="bg-neutral-900 text-white">2 Adults</option>
          <option value="3" class="bg-neutral-900 text-white">3 Adults</option>
          <option value="4" class="bg-neutral-900 text-white">4 Adults</option>
          <option value="5" class="bg-neutral-900 text-white">5+ Adults</option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="p-2 md:p-3">
        <button 
          type="submit"
          class="w-full rounded-2xl sm:rounded-full bg-[#D4AF37] px-8 py-4 sm:py-3 text-sm font-semibold text-black transition-all hover:bg-[#c89c2b] active:scale-95 md:w-auto"
        >
          Check Availability
        </button>
      </div>

    </form>
    
  </div>
</template>

<style scoped>
/* Strip the borders and backgrounds from the datepicker to make it seamless inside the search bar */
:deep(.search-datepicker .dp__input) {
  background-color: transparent !important;
  border: none !important;
  color: white !important;
  font-size: 1rem !important;
  padding: 0.75rem !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

:deep(.search-datepicker .dp__input:focus) {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Inherit the beautiful dark popup theme we built earlier */
:deep(.dp__menu) {
  background: rgba(20, 20, 20, 0.75) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 1rem !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

:deep(.dp__theme_dark) {
  --dp-background-color: transparent;
  --dp-text-color: #ffffff;
  --dp-hover-color: rgba(255, 255, 255, 0.1);
  --dp-hover-text-color: #ffffff;
  --dp-primary-color: #D4AF37;
  --dp-primary-text-color: #000000;
}
</style>