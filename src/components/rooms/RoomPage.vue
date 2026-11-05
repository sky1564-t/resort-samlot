<template>
  <div class="bg-[#fcfcfc] text-neutral-900 font-sans min-h-screen">
    
    <!-- SECTION 1: HERO HEADER -->
    <header class="relative w-full h-[70vh] md:h-[85vh] overflow-hidden bg-slate-900 flex flex-col justify-end">
      <!-- High-resolution mountain background -->
      <img 
        src="/picture/1.jpg" 
        alt="Breathtaking sunset views of Samlot Diamond Resort" 
        class="absolute inset-0 w-full h-full object-cover opacity-80 zoom-fade-effect"
      />
      <!-- Gradient over lay for text readability -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 pointer-events-none"></div>

      <!-- Hero contents -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full pb-12 md:pb-20 text-white animate-fade-in-up">
        <span class="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#d4af37] uppercase mb-3 block">
          Luxury Stays • Unforgettable Experiences
        </span>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight mb-4">
          More Than a Stay <br>
          <span class="italic font-normal text-amber-50">It’s an Experience</span>
        </h1>
        <p class="max-w-xl text-neutral-300 text-sm md:text-base leading-relaxed mb-8">
          Discover the perfect blend of comfort, elegance, and world-class hospitality at Samlot Diamond Resort. Your next mountain getaway begins here.
        </p>

        <!-- Dynamic Booking widget -->
        <div class="bg-white/95 text-neutral-900 rounded-2xl md:rounded-full p-4 md:p-2 shadow-2xl flex flex-col md:flex-row gap-4 md:gap-2 items-stretch md:items-center max-w-4xl">
          <div class="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 py-2 border-b md:border-b-0 md:border-r border-neutral-200">
            <div>
              <label class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Check In</label>
              <input type="date" value="2026-04-26" class="w-full text-xs font-semibold bg-transparent focus:outline-none" />
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Check Out</label>
              <input type="date" value="2026-04-29" class="w-full text-xs font-semibold bg-transparent focus:outline-none" />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label class="block text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">Guests</label>
              <select class="w-full text-xs font-semibold bg-transparent focus:outline-none">
                <option>2 Adults</option>
                <option>1 Adult</option>
                <option>Family (2A + 2C)</option>
              </select>
            </div>
          </div>
          <button class="bg-[#4e733c] hover:bg-[#3b5a2d] text-white px-8 py-4 rounded-xl md:rounded-full font-medium transition duration-300 text-sm md:text-base whitespace-nowrap self-stretch md:self-auto">
            Check Availability →
          </button>
        </div>
      </div>
    </header>

    <!-- Value Badges -->
    <div class="bg-[#1e2e1a] text-[#ebd8b7] border-b border-[#2d4228] py-8">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div class="flex flex-col items-center gap-2">
          <span class="text-xl"></span>
          <p class="text-xs uppercase tracking-wider font-semibold">Best Price Guarantee</p>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xl"></span>
          <p class="text-xs uppercase tracking-wider font-semibold">Free WiFi Everywhere</p>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xl"></span>
          <p class="text-xs uppercase tracking-wider font-semibold">24/7 Room Service</p>
        </div>
        <div class="flex flex-col items-center gap-2">
          <span class="text-xl"></span>
          <p class="text-xs uppercase tracking-wider font-semibold">Luxury Facilities</p>
        </div>
      </div>
    </div>

    <!-- SECTION 2: ACCOMMODATIONS GRID -->
    <section class="max-w-7xl mx-auto px-6 py-20">
      <div class="grid lg:grid-cols-4 gap-12 items-start mb-16">
        <div class="lg:col-span-1">
          <span class="text-xs font-bold uppercase tracking-widest text-[#4e733c]">Our Rooms & Suites</span>
          <h2 class="text-3xl md:text-4xl font-serif leading-tight mt-2 mb-4">Elegance in Every Detail</h2>
          <p class="text-neutral-600 text-sm leading-relaxed mb-6">
            Each room is designed for comfort, featuring modern amenities, breathtaking mountain views, and a serene, untouched atmosphere.
          </p>
          <button class="inline-flex items-center gap-2 border border-neutral-300 hover:border-[#4e733c] hover:text-[#4e733c] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition duration-300">
            View All Rooms →
          </button>
        </div>

        <div class="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card 1: Deluxe Forest Room -->
          <div class="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group">
            <div class="relative h-48 overflow-hidden">
              <img src="/picture/13.jpg" alt="Deluxe Forest Room" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold mb-1">Deluxe Forest Room</h3>
                <p class="text-xs text-neutral-500 mb-4">King Bed • 2 Guests • 30 m²</p>
              </div>
              <div class="flex items-center justify-between border-t border-neutral-100 pt-4 mt-4">
                <div>
                  <span class="text-xs text-neutral-500">From</span>
                  <span class="text-lg font-bold text-[#4e733c] ml-1">$10</span><span class="text-xs text-neutral-500"> /night</span>
                </div>
                <button class="bg-[#ebd8b7] text-[#4e733c] hover:bg-[#4e733c] hover:text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition duration-300">
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: Mountain View Suite -->
          <div class="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group">
            <div class="relative h-48 overflow-hidden">
              <img src="/picture/18.jpg" alt="Mountain View Suite" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold mb-1">Mountain View Suite</h3>
                <p class="text-xs text-neutral-500 mb-4">King Bed • 2 Guests • 45 m²</p>
              </div>
              <div class="flex items-center justify-between border-t border-neutral-100 pt-4 mt-4">
                <div>
                  <span class="text-xs text-neutral-500">From</span>
                  <span class="text-lg font-bold text-[#4e733c] ml-1">$10</span><span class="text-xs text-neutral-500"> /night</span>
                </div>
                <button class="bg-[#ebd8b7] text-[#4e733c] hover:bg-[#4e733c] hover:text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition duration-300">
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Card 3: Luxury Diamond Villa -->
          <div class="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group">
            <div class="relative h-48 overflow-hidden">
              <img src="/picture/3.jpg" alt="Luxury Diamond Villa" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold mb-1">Luxury Diamond Villa</h3>
                <p class="text-xs text-neutral-500 mb-4">2 King Beds • 4 Guests • 120 m²</p>
              </div>
              <div class="flex items-center justify-between border-t border-neutral-100 pt-4 mt-4">
                <div>
                  <span class="text-xs text-neutral-500">From</span>
                  <span class="text-lg font-bold text-[#4e733c] ml-1">$10</span><span class="text-xs text-neutral-500"> /night</span>
                </div>
                <button class="bg-[#ebd8b7] text-[#4e733c] hover:bg-[#4e733c] hover:text-white h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition duration-300">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: WORLD-CLASS AMENITIES -->
    <section class="bg-[#1a2b16] text-[#ebd8b7] py-24">
      <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <!-- Landscape Immersive Image -->
        <div class="relative rounded-3xl overflow-hidden aspect-video max-h-96 md:max-h-none shadow-2xl">
          <img src="/picture/1.jpg" alt="Infinity pool over looking mountain range" class="w-full h-full object-cover" />
        </div>
        
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Hotel Amenities</span>
          <h2 class="text-3xl md:text-5xl font-serif leading-tight mt-2 mb-6">World-Class Amenities<br>for a Perfect Stay</h2>
          <p class="text-neutral-300 text-sm md:text-base leading-relaxed mb-8">
            From fine dining to relaxing spa treatments, enjoy a range of premium amenities designed to make your stay truly unforgettable.
          </p>
          <button class="bg-[#4e733c] hover:bg-[#3b5a2d] text-white px-8 py-4 rounded-full font-medium transition duration-300 text-sm flex items-center gap-2">
            Explore Amenities →
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.zoom-fade-effect {
  animation: bgZoomFade 2s ease-out forwards;
}

.animate-fade-in-up {
  opacity: 0;
  animation: slideUp 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
  animation-delay: 0.1s;
}

@keyframes bgZoomFade {
  0% { transform: scale(1.05); opacity: 0.5; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>