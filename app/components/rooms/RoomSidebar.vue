<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RoomDetail } from '~/types/room'
import { useRooms } from '~/composables/useRooms'
// Import the custom datepicker to match the booking page
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


const props = defineProps<{
  room: RoomDetail
}>()

const {
  availability,
  availabilityStatus,
  checkAvailability
} = useRooms()

const checkIn = ref('')
const checkOut = ref('')
const adults = ref(
  props.room.max_guests > 0 ? 1 : 0
)

const handleAvailability = async () => {
  if (!checkIn.value || !checkOut.value) {
    return
  }
  await checkAvailability(
    props.room.id,
    checkIn.value,
    checkOut.value
  )
}

const bookingLink = computed(() => {
  const query = new URLSearchParams({
    room: String(props.room.id),
    check_in: checkIn.value,
    check_out: checkOut.value,
    adults: String(adults.value)
  })
  return `/booking?${query.toString()}`
})

// Glassmorphism styling classes for standard inputs
const inputClass = "w-full rounded-xl sm:rounded-2xl bg-black/20 border border-white/10 p-3 sm:p-4 text-sm sm:text-base text-white outline-none transition-all placeholder:text-white/40 focus:border-white/30 focus:bg-black/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md"
const labelClass = "mb-1 sm:mb-2 block text-xs sm:text-sm font-medium text-white/80 ml-1 sm:ml-2"
</script>

<template>
  <aside
    class="sticky top-6 sm:top-8 h-fit rounded-3xl sm:rounded-[2.5rem] bg-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl border border-white/10 text-white"
  >
    <!-- Header: Price -->
    <div class="text-sm text-white/60">
      Starting from
    </div>
    <div class="mt-2 font-serif text-4xl sm:text-5xl text-[#D4AF37]">
      ${{ room.base_price }}
    </div>
    <div class="text-sm text-white/60">
      per night
    </div>

    <!-- Details: Capacity & Category -->
    <div class="my-6 sm:my-8 border-t border-b border-white/10 py-5 sm:py-6">
      <div class="flex items-center justify-between text-sm sm:text-base">
        <span class="text-white/60">Capacity</span>
        <span class="font-medium">{{ room.max_guests }} Guests</span>
      </div>
      <div class="mt-4 flex items-center justify-between text-sm sm:text-base">
        <span class="text-white/60">Category</span>
        <span class="font-medium">{{ room.category }}</span>
      </div>
    </div>

    <!-- Form: Availability -->
    <div class="space-y-4 sm:space-y-5">
      
    <!-- Custom Check In Datepicker -->
      <div>
        <label :class="labelClass">Check In</label>
        <ClientOnly>
          <VueDatePicker 
            v-model="checkIn" 
            :enable-time-picker="false"
            auto-apply
            dark
            model-type="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
            <!-- Custom Tailwind Input Slot -->
            <template #dp-input="{ value }">
              <div class="relative group cursor-pointer">
                
                <!-- Interactive Calendar Icon -->
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-black transition-colors duration-300 ">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <!-- Glassmorphism Input Field -->
                <input 
                  type="text" 
                  :value="value" 
                  readonly
                  placeholder="Select check-in date"
                  class="w-full cursor-pointer rounded-xl sm:rounded-2xl bg-black/20 border border-white/10 py-3 sm:py-4 pl-12 pr-4 text-sm sm:text-base text-white outline-none transition-all placeholder:text-white/40 focus:border-white/30 focus:bg-black/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md group-hover:bg-black/30"
                >
                
              </div>
            </template>
          </VueDatePicker>
        </ClientOnly>
      </div>
    <!-- Custom Check Out Datepicker -->
      <div>
            <label :class="labelClass">Check Out</label>
            <ClientOnly>
              <VueDatePicker 
                v-model="checkOut" 
                :enable-time-picker="false"
                auto-apply
                dark
                model-type="yyyy-MM-dd"
                format="yyyy-MM-dd"
              >
                <!-- Custom Tailwind Input Slot -->
                <template #dp-input="{ value }">
                  <div class="relative group cursor-pointer">
                    
                <!-- Interactive Calendar Icon -->
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-black transition-colors duration-300 ">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <!-- Glassmorphism Input Field -->
                <input 
                  type="text" 
                  :value="value" 
                  readonly
                  placeholder="Select checkout date"
                  class="w-full cursor-pointer rounded-xl sm:rounded-2xl bg-black/20 border border-white/10 py-3 sm:py-4 pl-12 pr-4 text-sm sm:text-base text-white outline-none transition-all placeholder:text-white/40 focus:border-white/30 focus:bg-black/40 focus:ring-1 focus:ring-white/30 backdrop-blur-md group-hover:bg-black/30"
                >
                
              </div>
            </template>
          </VueDatePicker>
        </ClientOnly>
      </div>

      <!-- Adults -->
      <div>
        <label :class="labelClass">Adults</label>
        <input
          v-model.number="adults"
          type="number"
          min="1"
          :max="room.max_guests"
          :class="inputClass"
        >
      </div>

      <!-- Check Availability Button -->
      <button
        type="button"
        class="mt-2 w-full rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 py-3 sm:py-4 text-sm sm:text-base font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
        @click="handleAvailability"
      >
        Check Availability
      </button>

      <!-- Glass Status Alerts -->
      <div
        v-if="availabilityStatus === 'checking'"
        class="text-center text-sm text-white/60 pt-2"
      >
        Checking availability...
      </div>

      <div
        v-else-if="availabilityStatus === 'available'"
        class="rounded-xl sm:rounded-2xl border border-green-500/30 bg-green-500/20 p-4 text-sm sm:text-base text-green-200 backdrop-blur-md"
      >
        {{ availability?.available }} unit(s) available for your selected dates.
      </div>

      <div
        v-else-if="availabilityStatus === 'unavailable'"
        class="rounded-xl sm:rounded-2xl border border-red-500/30 bg-red-500/20 p-4 text-sm sm:text-base text-red-200 backdrop-blur-md"
      >
        No units available for the selected dates.
      </div>

      <div
        v-else-if="availabilityStatus === 'error'"
        class="rounded-xl sm:rounded-2xl border border-red-500/30 bg-red-500/20 p-4 text-sm sm:text-base text-red-200 backdrop-blur-md"
      >
        Unable to check availability.
      </div>

    </div>

    <!-- Final Booking Link -->
    <NuxtLink
      :to="bookingLink"
      class="mt-6 sm:mt-8 block w-full rounded-xl sm:rounded-2xl bg-[#D4AF37] py-3 sm:py-4 text-center text-sm sm:text-base font-semibold text-black transition-all hover:bg-[#c89c2b] active:scale-[0.98]"
    >
      Book This Room
    </NuxtLink>

  </aside>
</template>

<style scoped>
/* ======================================================== */
/* VUE DATEPICKER GLASSMORPHISM OVERRIDES                   */
/* ======================================================== */

/* 1. Global Theme Colors */
:deep(.dp__theme_dark) {
  --dp-background-color: transparent;
  --dp-text-color: #ffffff;
  --dp-hover-color: rgba(255, 255, 255, 0.1);
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #ffffff;
  --dp-primary-color: #D4AF37; /* Resort Gold */
  --dp-primary-text-color: #000000; /* Black text on selected dates */
  --dp-secondary-color: rgba(255, 255, 255, 0.1);
  --dp-border-color: rgba(255, 255, 255, 0.1);
  --dp-menu-border-color: transparent;
  --dp-border-color-hover: rgba(255, 255, 255, 0.3);
  --dp-disabled-color: rgba(255, 255, 255, 0.05);
  --dp-icon-color: rgba(255, 255, 255, 0.6);
}

/* 2. Frosted Glass Popup Menu */
:deep(.dp__menu) {
  background: rgba(20, 24, 22, 0.85) !important; /* Deep translucent black */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 1.25rem !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
  font-family: inherit;
  padding: 0.5rem;
}

/* 3. Input Styles */
:deep(.dp__input) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1rem !important;
  color: white !important;
  font-size: 0.875rem !important;
  transition: all 0.3s !important;
}

@media (min-width: 640px) {
  :deep(.dp__input) {
    border-radius: 1rem !important;
    padding: 1rem 1rem !important;
    font-size: 1rem !important;
  }
}

:deep(.dp__input:focus) {
  border-color: rgba(255, 255, 255, 0.3) !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
}

/* 4. Calendar Headers (Su, Mo, Tu...) */
:deep(.dp__calendar_header_item) {
  color: #D4AF37;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

/* 5. Date Bubbles */
:deep(.dp__cell_inner) {
  border-radius: 0.75rem !important; /* Soft rounded bubbles */
  transition: all 0.2s ease;
}

/* 6. Selected Date (Solid Gold Background, Black Text) */
:deep(.dp__active_date) {
  background-color: #D4AF37 !important;
  color: #000000 !important;
  font-weight: 700;
  border: none !important;
}

/* 7. Fix the Blue "Today" Border -> Make it Gold */
:deep(.dp__today) {
  border: 1px solid #D4AF37 !important;
  background: rgba(212, 175, 55, 0.1) !important;
}

/* 8. Hide the Unwanted Time Picker Clock Icon & Action Row */
:deep(.dp__action_row), 
:deep(.dp__button_icon) {
  display: none !important;
}

/* 9. Hide the top arrow pointer */
:deep(.dp__arrow_top) {
  display: none; 
}
</style>