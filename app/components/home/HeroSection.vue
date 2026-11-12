<template>
  <section
    class="relative w-full h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden bg-slate-900"
  >
    <!-- Background Image -->
    <div class="relative h-full w-full overflow-hidden bg-black">

      <img
        src="/picture/h1.jpeg"
        alt="Samlot Diamond Resort"
        class="block h-full w-full object-cover animate-[imageFadeIn_1.5s_ease-out_forwards]"
      >

      <!-- Dark Overlay -->
      <div
        class="absolute inset-0 bg-black/45"
      />

      <!-- Content -->
      <div
        class="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div
          class="text-fade-up mx-auto max-w-5xl px-6 text-center text-white"
        >

          <!-- Small Label -->

          <p
            class="mb-5 font-['Cinzel'] text-xs uppercase tracking-[6px] text-[#D4AF37] md:text-sm"
          >
            Welcome To
          </p>

          <!-- Main Title -->

          <h1
            class="mb-6 font-['Cinzel'] text-[34px] font-light leading-tight sm:text-[50px] md:text-[70px] lg:text-[85px]"
          >
            Samlot Diamond Resort
          </h1>

          <!-- Subtitle -->

          <p
            class="mx-auto max-w-2xl font-['Inter'] text-sm text-white/90 sm:text-base md:text-lg"
          >
            More Than a Stay, It’s an Experience
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Reserved for future CMS integration

/*
Later:

const { data: hero } = await useFetch(
  '/api/v1/website/home/'
)
*/
</script>

<style scoped>
@keyframes imageFadeIn {
  0% {
    opacity: 0;
    transform: scale(1.05);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-fade-up {
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards;
  animation-delay: .3s;
}
</style>