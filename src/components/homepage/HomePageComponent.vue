<template>
  <section class="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden bg-slate-900">
      <!-- Image Container -->
      <div class="relative w-full h-full overflow-hidden bg-black">
      <!-- HERO IMAGE -->
      <img 
        src="/picture/1.jpg" 
        alt="Samlot Resort Background" 
        class="block w-full h-full object-cover animate-[imageFadeIn_1.5s_ease-out_forwards]"
      />

        <!-- TEXT OVERLAY -->
        <div class="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
        
        <!-- Removed opacity-0 and replaced the broken animation with text-fade-up -->
        <div class="p-5 text-center text-white -mt-[30px] md:-mt-[50px] [text-shadow:0px_4px_10px_rgba(0,0,0,0.5)] text-fade-up">
            
            <h1 class="mb-2.5 font-['Cinzel'] text-[16px] sm:text-[24px] md:text-[60px] lg:text-[80px] font-light tracking-normal lg:tracking-[-1px]">
            Samlot Diamond Resort
            </h1>
            
            <p class="font-['Inter','Verdana',sans-serif] text-[12px] sm:text-[14px] md:text-[16px] font-normal tracking-[1px] text-white opacity-90">
            Unlock to enjoy the view of Forest and Mountain
            </p>
            
            <!-- DECORATIVE DIVIDER -->
            <div class="mx-auto mt-[15px] md:mt-5 flex w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] items-center justify-center">
            <div class="h-[1px] flex-1 bg-gradient-to-l from-white/80 to-transparent"></div>
            
            <div class="mx-[15px] grid rotate-45 grid-cols-2 gap-[3px]">
                <div class="h-[5px] w-[5px] border border-white/80 bg-transparent"></div>
                <div class="h-[5px] w-[5px] border border-white/80 bg-transparent"></div>
                <div class="h-[5px] w-[5px] border border-white/80 bg-transparent"></div>
                <div class="h-[5px] w-[5px] border border-white/80 bg-transparent"></div>
            </div>
            
            <div class="h-[1px] flex-1 bg-gradient-to-r from-white/80 to-transparent"></div>
            </div>

        </div>
        </div>
      
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePageComponent"
};
</script>

<style scoped>
/* Tailwind Preflight handles the body margin and box-sizing resets automatically. */
/* Custom keyframes are preserved here to be triggered by Tailwind's arbitrary animate-[...] classes in the template. */

@keyframes imageFadeIn {
  0% { opacity: 0; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.text-fade-up {
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
  animation-delay: 0.2s;
}

</style>