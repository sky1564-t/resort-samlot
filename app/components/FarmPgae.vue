<template>
  <div class="w-full min-h-screen bg-[#FDFBF7] py-24 font-sans text-gray-900">
    
    <!-- Page Header -->
    <div class="max-w-3xl mx-auto text-center px-4 mb-24">
      <h1 class="text-4xl md:text-5xl font-serif mb-6 text-[#2C2B29]">The Resort Farm</h1>
      <p class="text-sm md:text-base text-gray-600 leading-relaxed font-light">
        Our collection of organic herbs, seasonal vegetables, and mountain fruits is designed to add freshness, nutrition, and authentic taste to your plate. From the soil directly to Ankhusa Restaurant.
      </p>
    </div>

    <!-- Alternating Grid Container -->
    <div class="max-w-6xl mx-auto px-4 md:px-8 space-y-24 md:space-y-32">
      
      <!-- Farm Feature 1 (Image Left, Text Right) -->
      <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div class="w-full md:w-3/5">
          <!-- Rounded corners matching the lamp reference -->
          <img src="/picture/23.jpg" alt="Organic Vegetables" class="w-full h-[300px] md:h-[400px] object-cover rounded-[2rem] shadow-sm" />
        </div>
        <div class="w-full md:w-2/5">
          <h2 class="text-2xl md:text-3xl font-serif mb-4 text-[#2C2B29]">Seasonal Harvesting</h2>
          <p class="text-sm text-gray-600 leading-relaxed mb-6 font-light">
            Our farming practices respect the mountain climate, ensuring we only grow what nature intended for the season, adding vibrant color and deep flavor to your meals.
          </p>
          <button class="text-xs font-bold uppercase tracking-widest text-[#2C2B29] flex items-center gap-2 hover:text-green-700 transition-colors">
            Learn More <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
      </div>

      <!-- Farm Feature 2 (Text Left, Image Right) -->
      <div class="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
        <div class="w-full md:w-3/5">
          <img src="/picture/24.jpg" alt="Herb Garden" class="w-full h-[300px] md:h-[400px] object-cover rounded-[2rem] shadow-sm" />
        </div>
        <div class="w-full md:w-2/5 md:text-right flex flex-col md:items-end">
          <h2 class="text-2xl md:text-3xl font-serif mb-4 text-[#2C2B29]">Samlot Durian Season</h2>
          <p class="text-sm text-gray-600 leading-relaxed mb-6 font-light md:ml-auto">
            Experience the crown jewel of the Samlot harvest. Grown in our region's famous mineral-rich red soil, the resort farm yields some of Cambodia's most sought-after premium durian, offering guests an exclusive, farm-to-table tasting of this celebrated tropical delicacy.
          </p>
          <button class="text-xs font-bold uppercase tracking-widest text-[#2C2B29] flex items-center gap-2 hover:text-green-700 transition-colors">
            View Durain <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
      </div>

      <!-- Farm Feature 3 (Image Left, Text Right) -->
      <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div class="w-full md:w-3/5">
          <img src="/picture/25.jpg" alt="Farm Tour" class="w-full h-[300px] md:h-[400px] object-cover rounded-[2rem] shadow-sm" />
        </div>
        <div class="w-full md:w-2/5">
          <h2 class="text-2xl md:text-3xl font-serif mb-4 text-[#2C2B29]">Guided Farm Tours</h2>
          <p class="text-sm text-gray-600 leading-relaxed mb-6 font-light">
            Join our resident agriculturist for a morning walk through the terraces. Learn about sustainable farming techniques and hand-pick ingredients for your own cooking class.
          </p>
          <button class="text-xs font-bold uppercase tracking-widest text-[#2C2B29] flex items-center gap-2 hover:text-green-700 transition-colors">
            Book a Tour <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
      </div>

    </div>

    <!-- Bottom Action Button -->
    <div class="mt-32 flex justify-center">
      <button class="bg-[#2C2B29] text-white px-8 py-3 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center gap-3 hover:bg-gray-800 transition-colors shadow-lg">
        Explore Dining <span class="bg-white text-[#2C2B29] rounded-full p-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: "FarmPage"
}
</script>