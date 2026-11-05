<template>
  <div class="w-full relative">
    
    <!-- OPTIONAL: High-End Photo/Instagram Grid above footer -->
    <!-- <div class="hidden sm:flex w-full h-[100px] md:h-[120px] lg:h-[150px]">
      <div v-for="n in 6" :key="n" class="flex-1 relative overflow-hidden cursor-pointer group">
        <img :src="`/picture/grid-${n}.jpg`" alt="Resort Gallery" class="w-full h-full object-cover transition-transform duration-500 ease-in-out bg-[#1a1a1a] group-hover:scale-110" />
        <div class="absolute inset-0 bg-[rgba(0,191,255,0.6)] flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <i class="fab fa-instagram text-white text-[24px]"></i>
        </div>
      </div>
    </div> -->

    <footer class="bg-black/70 backdrop-blur-[15px] [-webkit-backdrop-filter:blur(15px)] text-white pt-[50px] md:pt-[60px] lg:pt-[80px] px-4 md:px-5 pb-[20px] md:pb-[30px] lg:pb-[40px] font-['Inter',sans-serif] border-t border-white/10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr] gap-10 md:gap-[50px] lg:gap-[40px] max-w-[1200px] mx-auto">
        
        <!-- 1. Brand & Copyright -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <div @click="$router.push('/')" class="flex flex-col items-center md:items-start cursor-pointer text-white mb-5">
            <div class="w-[100px] h-[100px] flex items-center justify-center text-[12px] mb-1">
              <img src="/logo/logo.png" alt="Logo" />
            </div>
            <!-- <div class="text-[24px] font-normal tracking-[1px] leading-[1.1]">CHAMNAB</div>
            <div class="text-[8px] tracking-[3px] uppercase opacity-60">Resort</div> -->
          </div>
          <p class="text-[0.85rem] leading-[1.8] text-white/70 mt-5">
            &copy; 2026 Samlot Diamond Resort. <br>All rights reserved.
          </p>
        </div>

        <!-- 2. Quick Links -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 class="text-[1rem] lg:text-[1.1rem] font-medium mb-[15px] lg:mb-[25px] text-white uppercase tracking-[1px]">Explore</h4>
          <ul class="list-none p-0 m-0">
            <li class="mb-3 text-[0.95srem]">
              <router-link to="/" class="text-white/70 no-underline transition-colors duration-300 hover:text-[#00bfff]">Home</router-link>
            </li>
            <li class="mb-3 text-[0.95rem]">
              <router-link to="/rooms" class="text-white/70 no-underline transition-colors duration-300 hover:text-[#00bfff]">Rooms & Suites</router-link>
            </li>
            <li class="mb-3 text-[0.95rem]">
              <router-link to="/booking" class="text-white/70 no-underline transition-colors duration-300 hover:text-[#00bfff]">Book a Room</router-link>
            </li>
          </ul>
        </div>
        
        <!-- 3. Contact Information -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 class="text-[1rem] lg:text-[1.1rem] font-medium mb-[15px] lg:mb-[25px] text-white uppercase tracking-[1px]">Get in Touch</h4>
          <p class="text-[0.95rem] leading-[1.8] text-white/70 mb-[15px]">
            Chamkar Ta Chambat, near Checkpoint 400, Vireak Chey Village, Samlout Commune, Samlout District,
            Battambang Province. 
          </p>
          <p class="text-[0.95rem] leading-[1.8] text-white/70 mb-[15px]">
            <a href="mailto:reservations@montanaresort.com" class="text-white/70 no-underline transition-colors duration-300 hover:text-[#00bfff]">voeun_chamnab168@yahoo.com</a><br>
            <a href="tel:+855 96 553 3359" class="text-white/70 no-underline transition-colors duration-300 hover:text-[#00bfff]">096 553 3359</a>
          </p>
        </div>

        <!-- 4. Newsletter & Socials -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 class="text-[1rem] lg:text-[1.1rem] font-medium mb-[15px] lg:mb-[25px] text-white uppercase tracking-[1px]">Newsletter</h4>
          <!-- <p class="text-[0.95rem] leading-[1.8] text-white/70 mb-[20px]!">Subscribe to receive exclusive offers and mountain retreat inspiration.</p> -->
          
          <form class="flex flex-col sm:flex-row w-full max-w-[400px] md:max-w-none mb-[30px] mx-auto md:mx-0" @submit.prevent>
            <input 
              type="email" 
              placeholder="Your email address" 
              required 
              class="flex-1 bg-transparent border border-white/20 py-3 px-[15px] text-white font-['Inter',sans-serif] text-[0.9rem] outline-none rounded-[4px] sm:rounded-r-none mb-[10px] sm:mb-0 transition-colors duration-300 focus:border-[#00bfff] placeholder:text-white/40" 
            />
            <button 
              type="submit" 
              class="bg-[#00bfff] text-white border-none py-[14px] sm:py-0 px-5 font-['Inter',sans-serif] font-medium text-[0.9rem] cursor-pointer rounded-[4px] sm:rounded-l-none w-full sm:w-auto transition-colors duration-300 hover:bg-[#009ce0]"
            >
              Subscribe
            </button>
          </form>

          <div class="flex gap-[15px]">
            <a href="#" target="_blank" class="inline-flex items-center justify-center w-[40px] h-[40px] bg-white/5 text-white rounded-full transition-all duration-300 hover:bg-[#00bfff] hover:text-white hover:-translate-y-[3px]">
              <img src="/picture/facebook.png" alt=""  /><i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" class="inline-flex items-center justify-center w-[40px] h-[40px] bg-white/5 text-white rounded-full transition-all duration-300 hover:bg-[#00bfff] hover:text-white hover:-translate-y-[3px]">
              <img src="/picture/instagram.png" alt=""  /><i class="fab fa-instagram"></i>
            </a>
            <a href="#" target="_blank" class="inline-flex items-center justify-center w-[40px] h-[40px] bg-white/5 text-white rounded-full transition-all duration-300 hover:bg-[#00bfff] hover:text-white hover:-translate-y-[3px]">
              <img src="/picture/telegram.png" alt=""  /><i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>

      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterPage",
};
</script>