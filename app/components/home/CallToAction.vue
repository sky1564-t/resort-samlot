<template>
  <section
    class="relative overflow-hidden py-32"
  >

    <img
      src="/picture/1.jpg"
      alt="Call to Action"
      class="absolute inset-0 h-full w-full object-cover"
    >

    <div
      class="absolute inset-0 bg-black/60"
    />

    <div
      class="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
    >

      <p
        class="mb-4 font-['Cinzel']
        uppercase tracking-[6px]
        text-[#D4AF37]"
      >
        Your Escape Awaits
      </p>

      <h2
        class="font-['Cinzel']
        text-4xl md:text-6xl"
      >
        Experience Samlot Diamond Resort
      </h2>

      <p
        class="mx-auto mt-6 max-w-2xl"
      >
        Relax, explore nature and create
        unforgettable memories.
      </p>

      <NuxtLink
        to="/booking"
        class="mt-10 inline-flex rounded-full
        bg-[#D4AF37]
        px-10 py-4
        font-semibold
        text-black"
      >
        Book Your Stay
      </NuxtLink>

    </div>

  </section>
</template>