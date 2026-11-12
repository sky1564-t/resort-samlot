<template>
  <section class="relative w-full bg-[#fcfcfc] overflow-hidden py-12 md:py-20 font-sans">
    
    <!-- Abstract Background Watermark Pattern -->
    <div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
      <!-- Decorative flowing SVG imitating the watermark -->
      <svg viewBox="0 0 800 800" class="w-[150%] md:w-[80%] h-auto rotate-12">
        <path fill="currentColor" d="M399.5,123.3c-66.2-7.8-135.5,16.5-181.7,64.2c-56,57.7-65.5,148-35.3,222.1c29.1,71.7,95.5,126.8,171.1,146.4 c83.9,21.8,177.3,1.3,243.6-53.5c60.3-49.8,87.7-133,70.9-209.6c-17.7-80.4-86.2-143.6-165.7-160.7C468.9,124.9,433.8,127.3,399.5,123.3z M495.2,467.5c-48.4,41.9-122.9,51.8-181.3,21.6c-54.3-28.1-92.4-84.6-96-146.1c-3.2-56.1,25-110.1,70.3-142.1 c46.8-33,110.6-42.5,165.6-21.2c56.8,22.1,102.7,73.5,114.8,133.5C581.4,377.2,546.9,422.7,495.2,467.5z"/>
      </svg>
    </div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
      
      <!-- 1. Featured Room Carousel Section -->
      <div class="relative w-full h-[50vh] md:h-[70vh] min-h-[400px] mb-24 rounded-sm overflow-hidden group">
        <img src="/picture/2.jpg" alt="Featured Suite" class="absolute inset-0 w-full h-full object-cover" />
        
        <!-- Subtle Gradient for text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        <!-- Carousel Navigation (Visual only for layout) -->
        <button class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/40 transition opacity-0 group-hover:opacity-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/40 transition opacity-0 group-hover:opacity-100">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <!-- Room Info Overlay -->
        <div class="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-xl pr-4">
          <h2 class="text-2xl md:text-3xl font-medium text-white mb-2 drop-shadow-md">Suite twin forest view with public infinity pool</h2>
          <p class="text-gray-200 text-xs md:text-sm mb-5 line-clamp-2 drop-shadow leading-relaxed">
            Suite twin forest view with public infinity pool is featured with twin bedroom, daybed, bathroom with bathtub and balcony flow to the forest.
          </p>
          <button class="px-6 py-2 border border-white/60 text-white text-sm rounded-full hover:bg-white hover:text-black transition duration-300"
          @click="$router.push('/booking')"
          >
            Book now
          </button>
        </div>
      </div>

      <!-- 2. Split Details Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
        <!-- Image Left -->
        <div class="h-[400px] md:h-[600px] rounded-sm overflow-hidden shadow-xl">
          <img src="/picture/5.jpg" alt="Suite Interior" class="w-full h-full object-cover hover:scale-105 transition duration-700" />
        </div>
        
        <!-- Details Right -->
        <div class="flex flex-col justify-center px-4 md:px-0">
          <!-- Benefits -->
          <h4 class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Benefit Stay:</h4>
          <ul class="text-sm text-gray-600 space-y-2 mb-10 list-disc list-inside leading-relaxed">
            <li>Romantic stay at suite pool view or suite forest view</li>
            <li>Pool romantic rose petal on the bed on arrival</li>
            <li>Romantic flower with candle light decoration in the floor</li>
            <li>Romantic flower decoration in the bathtub</li>
            <li>1x 60 minutes balinese massage for 2 persons</li>
            <li>1x dinner for 2 persons at exclusive restaurant</li>
            <li>1x floating breakfast in the public infinity pool</li>
            <li>Complimentary unlimited wi-fi (unlimited quota)</li>
            <li>Complimentary daily bottled of mineral water</li>
          </ul>

          <!-- Terms -->
          <h4 class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">Term and Conditions:</h4>
          <ul class="text-sm text-gray-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>Minimum 2 nights stay is required</li>
            <li>The rate is valid for couple</li>
            <li>Reservation is required in advance</li>
            <li>Nonrefundable with full payment in advance</li>
            <li>Cannot be combined with other existing package or promotion</li>
          </ul>
        </div>
      </div>

      <!-- 3. Special Offers Section -->
      <div class="w-full max-w-5xl mx-auto">
        <div class="text-center mb-16 md:mb-24">
          <h3 class="text-2xl md:text-3xl text-gray-800 font-medium tracking-wide">Special offers</h3>
        </div>

        <!-- Offer 1 (Text Left, Image Right) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-20 md:mb-32">
          <div class="text-center md:text-right order-2 md:order-1 flex flex-col items-center md:items-end px-4 md:px-0">
            <h4 class="text-lg md:text-xl font-medium text-gray-800 mb-4">Romantic decoration</h4>
            <p class="text-xs md:text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
              Surprised your spouse by selected our romantic decoration. Our beloved one absolutely love the way we treat him/her and why not to give a memorable experience like romantic candle light in the pool and an array of romantic decoration during your stay.
            </p>
            <button class="px-8 py-2 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition duration-300">
              Detail
            </button>
          </div>
          <div class="h-[250px] md:h-[350px] rounded-sm overflow-hidden shadow-lg order-1 md:order-2">
            <img src="/picture/4.jpg" alt="Romantic Decoration" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Offer 2 (Image Left, Text Right) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div class="h-[250px] md:h-[350px] rounded-sm overflow-hidden shadow-lg">
            <img src="/picture/3.jpg" alt="Royal Villa" class="w-full h-full object-cover" />
          </div>
          <div class="text-center md:text-left flex flex-col items-center md:items-start px-4 md:px-0">
            <h4 class="text-lg md:text-xl font-medium text-gray-800 mb-4">Royal one bedroom villa with private infinity pool</h4>
            <p class="text-xs md:text-sm text-gray-500 leading-relaxed mb-6 max-w-sm">
              Royal one bedroom villa with private infinity pool is complemented with large bedroom, daybed, ensuite bathroom with bathtub, gazebo and private pool which is suitable for honeymooners to spend their intimate time.
            </p>
            <button class="px-8 py-2 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition duration-300">
              Detail
            </button>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: "IntroHomeEditorial"
}
</script>