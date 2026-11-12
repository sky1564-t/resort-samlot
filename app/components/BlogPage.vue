<script setup lang="ts">
const route = useRoute()

useHead({
  title: 'Journal Article | Samlot Diamond Resort'
})
</script>

<template>
  <div>

    <section class="relative h-[60vh] overflow-hidden">

      <img
        src="/picture/34.jpg"
        alt="Blog"
        class="absolute inset-0 h-full w-full object-cover"
      >

      <div class="absolute inset-0 bg-black/50" />

      <div class="relative flex h-full items-center justify-center text-center text-white">

        <div>

          <p class="mb-4 uppercase tracking-[6px] text-[#D4AF37]">
            Article
          </p>

          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            {{ route.params.slug }}
          </h1>

        </div>

      </div>

    </section>

    <section class="bg-white py-24">

      <div class="mx-auto max-w-4xl px-6">

        <h2 class="mb-8 font-['Cinzel'] text-5xl">
          Sample Article Title
        </h2>

        <div class="space-y-6 leading-8 text-neutral-600">

          <p>
            This page will later load real content from Django CMS.
          </p>

          <p>
            For now it acts as the blog detail template.
          </p>

          <p>
            Once API integration starts, all content will be loaded dynamically.
          </p>

        </div>

      </div>

    </section>

  </div>
</template>