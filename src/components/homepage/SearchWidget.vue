<template>
  <!-- Wrapper to position the widget overlapping two sections -->
  <div class="relative z-20 flex w-full justify-center px-5 -mt-[50px] md:px-5 md:-mt-[50px] max-md:-mt-[30px]">
    
    <!-- Outer Container -->
    <div class="flex w-full max-w-[1000px] items-center gap-[15px] rounded-[16px] bg-[#f3f4ec] p-[12px_12px_12px_20px] shadow-[0_15px_35px_rgba(0,0,0,0.08)] max-lg:flex-col max-lg:rounded-[24px] max-lg:p-[15px] max-sm:rounded-[16px] max-sm:p-[10px]">
      
      <!-- Inner White Bar -->
      <div class="flex flex-1 items-center rounded-[16px] bg-white p-[6px_10px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] max-lg:w-full max-lg:flex-col max-lg:rounded-[16px] max-lg:p-[10px] max-sm:p-[5px]">
        
        <!-- 1. Location -->
        <div class="relative flex flex-1 items-center gap-[12px] p-[10px_20px] max-lg:w-full max-lg:justify-between max-md:p-[12px_15px] max-sm:gap-[8px] max-sm:p-[10px]">
          <i class="fas fa-map-marker-alt text-[16px] text-[#4e733c]"></i>
          <select v-model="location" class="w-full cursor-pointer appearance-none bg-transparent font-['Inter',sans-serif] text-[14px] text-[#555555] outline-none max-md:text-[13px]">
            <option value="" disabled selected>Select Location</option>
            <option value="mountain">Mountain View</option>
            <option value="lake">Lake Side</option>
          </select>
          <i class="fas fa-chevron-down pointer-events-none text-[12px] text-[#aaaaaa]"></i>
        </div>
        
        <!-- Divider -->
        <div class="h-[30px] w-[1px] bg-[#eaeaea] max-lg:my-[5px] max-lg:h-[1px] max-lg:w-full"></div>

        <!-- 2. Property Type -->
        <div class="relative flex flex-1 items-center gap-[12px] p-[10px_20px] max-lg:w-full max-lg:justify-between max-md:p-[12px_15px] max-sm:gap-[8px] max-sm:p-[10px]">
          <select v-model="propertyType" class="w-full cursor-pointer appearance-none bg-transparent font-['Inter',sans-serif] text-[14px] text-[#555555] outline-none max-md:text-[13px]">
            <option value="" disabled selected>Property Type</option>
            <option value="chalet">Luxury Chalet</option>
            <option value="suite">Mountain Suite</option>
          </select>
          <i class="fas fa-chevron-down pointer-events-none text-[12px] text-[#aaaaaa]"></i>
        </div>

        <!-- Divider -->
        <div class="h-[30px] w-[1px] bg-[#eaeaea] max-lg:my-[5px] max-lg:h-[1px] max-lg:w-full"></div>

        <!-- 3. Price Range -->
        <div class="relative flex flex-1 items-center gap-[12px] p-[10px_20px] max-lg:w-full max-lg:justify-between max-md:p-[12px_15px] max-sm:gap-[8px] max-sm:p-[10px]">
          <select v-model="priceRange" class="w-full cursor-pointer appearance-none bg-transparent font-['Inter',sans-serif] text-[14px] text-[#555555] outline-none max-md:text-[13px]">
            <option value="" disabled selected>Price Range</option>
            <option value="low">$100 - $300</option>
            <option value="high">$300 - $800+</option>
          </select>
          <i class="fas fa-chevron-down pointer-events-none text-[12px] text-[#aaaaaa]"></i>
        </div>

        <!-- Divider -->
        <div class="h-[30px] w-[1px] bg-[#eaeaea] max-lg:my-[5px] max-lg:h-[1px] max-lg:w-full"></div>

        <!-- 4. User Profile & Search Button -->
        <div class="relative flex items-center gap-[12px] p-[10px_20px] pr-[5px] max-lg:w-full max-lg:justify-center max-lg:pt-[15px] max-md:p-[12px_15px] max-sm:gap-[8px] max-sm:p-[10px]">
          <i class="fas fa-user mr-[15px] cursor-pointer text-[16px] text-[#555555] max-sm:mr-[10px] max-sm:text-[14px]"></i>
          <button class="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#4e733c] text-white transition-all duration-200 ease-in-out hover:scale-105 hover:bg-[#3b5a2d] max-sm:h-[34px] max-sm:w-[34px]">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
      </div>

      <!-- Main CTA Button -->
      <button class="flex items-center gap-[10px] whitespace-nowrap rounded-[14px] bg-[#4e733c] px-[32px] py-[16px] font-['Inter',sans-serif] text-[15px] font-medium text-white transition-colors duration-300 ease-in-out hover:bg-[#3b5a2d] max-lg:w-full max-lg:justify-center max-md:px-[24px] max-md:py-[14px] max-md:text-[14px]">
        Find Property <i class="fas fa-arrow-right"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const location = ref("")
const propertyType = ref("")
const priceRange = ref("")
</script>