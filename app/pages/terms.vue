<script setup lang="ts">
useHead({
  title: 'Terms & Conditions | Samlot Diamond Resort'
})
</script>

<template>
  <div>
    <section class="relative h-[50vh] overflow-hidden">
      <img src="/picture/43.jpg" alt="Terms & Conditions" class="absolute inset-0 h-full w-full object-cover">
      <div class="absolute inset-0 bg-black/50"></div>

      <div class="relative flex h-full items-center justify-center text-center text-white">
        <div>
          <p class="mb-4 uppercase tracking-[6px] text-[#D4AF37]">
            Policies
          </p>

          <h1 class="font-['Cinzel'] text-5xl md:text-7xl">
            Terms & Conditions
          </h1>
        </div>
      </div>
    </section>

    <section class="bg-white py-24">
      <div class="mx-auto max-w-4xl px-6">

        <div class="mb-12">
          <h2 class="mb-6 font-['Cinzel'] text-4xl">
            Reservations
          </h2>

          <p class="leading-8 text-neutral-600">
            Reservations are subject to availability and confirmation by Samlot Diamond Resort. Guests will receive a confirmation email after the booking request has been reviewed.
          </p>
        </div>

        <div class="mb-12">
          <h2 class="mb-6 font-['Cinzel'] text-4xl">
            Check-In & Check-Out
          </h2>

          <p class="leading-8 text-neutral-600">
            Check-in begins at 2:00 PM. Check-out must be completed by 12:00 PM unless otherwise agreed with resort management.
          </p>
        </div>

        <div class="mb-12">
          <h2 class="mb-6 font-['Cinzel'] text-4xl">
            Cancellation Policy
          </h2>

          <p class="leading-8 text-neutral-600">
            Cancellation policies vary depending on booking type and seasonal availability. Guests should review booking details before confirming a reservation.
          </p>
        </div>

        <div class="mb-12">
          <h2 class="mb-6 font-['Cinzel'] text-4xl">
            Guest Responsibilities
          </h2>

          <p class="leading-8 text-neutral-600">
            Guests are responsible for respecting resort property, facilities and other guests during their stay.
          </p>
        </div>

        <div>
          <h2 class="mb-6 font-['Cinzel'] text-4xl">
            Liability
          </h2>

          <p class="leading-8 text-neutral-600">
            The resort is not responsible for loss, theft or damage to personal belongings unless required by applicable law.
          </p>
        </div>

      </div>
    </section>

    <section class="bg-[#F8F7F4] py-20">
      <div class="mx-auto max-w-4xl px-6 text-center">

        <h2 class="mb-6 font-['Cinzel'] text-4xl">
          Need More Information?
        </h2>

        <p class="mb-8 text-neutral-600">
          If you have any questions regarding reservations or resort policies, please contact our team.
        </p>

        <NuxtLink
          to="/contact"
          class="inline-flex rounded-full bg-[#1D3527] px-8 py-4 text-white transition hover:bg-[#2c5139]"
        >
          Contact Us
        </NuxtLink>

      </div>
    </section>
  </div>
</template>