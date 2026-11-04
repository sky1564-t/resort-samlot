<template>
  <div 
    :class="isNight ? 'bg-[#121413] text-gray-100' : 'bg-[#f9f8f6] text-gray-900'"
    class="relative w-full min-h-screen font-sans pb-32 transition-colors duration-1000 ease-in-out"
  >
    <!-- Day/Night Toggle Switch -->
     <!-- Day/Night Toggle Switch -->
    <div class="absolute top-8 right-8 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-gray-500/30 shadow-lg">
      <span class="text-xs font-semibold uppercase tracking-widest" :class="isNight ? 'text-gray-500' : 'text-gray-900'">Day</span>
      <button 
        @click="isNight = !isNight"
        class="relative w-12 h-6 rounded-full transition-colors duration-500"
        :class="isNight ? 'bg-green-700' : 'bg-gray-300'"
      >
        <span 
          class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-500 shadow-sm"
          :class="isNight ? 'left-7' : 'left-1'"
        ></span>
      </button>
      <span class="text-xs font-semibold uppercase tracking-widest" :class="isNight ? 'text-white' : 'text-gray-400'">Night</span>
    </div>

    <!-- Top Section -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 pt-32">
      
      <!-- Text Header (Left Aligned) -->
      <div class="max-w-2xl mb-16 md:mb-0 md:pr-12">
        <h1 class="text-4xl md:text-5xl font-serif mb-6 leading-tight transition-colors duration-1000">
          We understood slow living, before it became a trend.
        </h1>
        <p class="text-sm md:text-base leading-relaxed opacity-70 transition-opacity duration-1000">
          Everything tastes better, smells distinctly, and draws more attention here. In the mountains, we live slowly and don't look back. We know rest means looking at the sky and experiencing the natural rhythm of the forest.
        </p>
      </div>

      <!-- Asymmetrical Image Collage (Shifted Right) -->
      <div class="w-full md:w-3/4 ml-auto mt-12 md:-mt-10 relative">
        <div class="grid grid-cols-3 gap-2 md:gap-4 items-end relative z-10">
          
          <!-- Image 1: Tall Vertical -->
          <div class="relative aspect-[3/4] overflow-hidden rounded-sm">
            <img :src="images.day.collage1" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-0' : 'opacity-100'" alt="Day View" />
            <img :src="images.night.collage1" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-100' : 'opacity-0'" alt="Night View" />
          </div>
          
          <!-- Image 2: Tall Vertical (Slightly Offset) -->
          <div class="relative aspect-[3/4] overflow-hidden rounded-sm mb-8">
            <img :src="images.day.collage2" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-0' : 'opacity-100'" alt="Day Cabin" />
            <img :src="images.night.collage2" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-100' : 'opacity-0'" alt="Night Cabin" />
          </div>
          
          <!-- Image 3: Wide Horizontal -->
          <div class="relative aspect-[4/3] overflow-hidden rounded-sm">
            <img :src="images.day.collage3" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-0' : 'opacity-100'" alt="Day Landscape" />
            <img :src="images.night.collage3" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-100' : 'opacity-0'" alt="Night Landscape" />
            
            <!-- Topographic Graphic Overlay -->
            <div class="absolute -bottom-8 -left-8 w-40 h-40 opacity-30 pointer-events-none transition-colors duration-1000 text-white">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1"><path d="M10,90 Q30,70 50,80 T90,60 M20,100 Q40,80 60,90 T100,70 M0,80 Q20,60 40,70 T80,50" /></svg>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Bottom Section -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 mt-32 md:mt-48">
      
      <!-- Centered Header -->
      <h2 class="text-3xl md:text-4xl font-serif text-center max-w-4xl mx-auto mb-20 leading-tight transition-colors duration-1000">
        One day we wanted to create a place in the mountains where you can feel this climate on your own skin.
      </h2>

      <!-- Split Layout: Images Left, Text Right -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        <!-- Left: Split Image Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="relative aspect-[3/5] overflow-hidden rounded-sm">
            <img :src="images.day.bottom1" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-0' : 'opacity-100'" alt="Day Detail" />
            <img :src="images.night.bottom1" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-100' : 'opacity-0'" alt="Night Detail" />
          </div>
          <div class="relative aspect-[4/5] overflow-hidden rounded-sm mt-12">
            <img :src="images.day.bottom2" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-0' : 'opacity-100'" alt="Day Detail" />
            <img :src="images.night.bottom2" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" :class="isNight ? 'opacity-100' : 'opacity-0'" alt="Night Detail" />
          </div>
        </div>

        <!-- Right: Text Block -->
        <div class="max-w-lg">
          <p class="text-sm leading-relaxed opacity-70 mb-10 transition-opacity duration-1000">
            We invite you to our secluded resort. We created a space where you wake up to bird songs and fall asleep under a canopy of stars. Whether it's the bright warmth of the afternoon sun or the quiet crackle of the fire pit at night, every moment is designed to connect you deeply with nature.
          </p>
          <button 
            class="px-8 py-3 text-xs font-bold uppercase tracking-widest border transition-colors duration-500 rounded-sm"
            :class="isNight ? 'border-gray-500 text-gray-200 hover:bg-white hover:text-black' : 'border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white'"
          >
            See Cabin Details
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResortView",
  data() {
    return {
      isNight: false,
      images: {
        // You will replace these with actual Chamnab Resort image paths
        day: {
          collage1: "/picture/16.jpg",      
          collage2: "/picture/18.jpg",    
          collage3: "/picture/19.jpg",    
          bottom1: "/picture/21.jpg",      
          bottom2: "/picture/22.jpg",      
        },
        night: {
          collage1: "/picture/11.jpg",   
          collage2: "/picture/12.jpg", 
          collage3: "/picture/13.jpg", 
          bottom1: "/picture/14.jpg",   
          bottom2: "/picture/15.jpg",   
        }
      }
    };
  }
};
</script>