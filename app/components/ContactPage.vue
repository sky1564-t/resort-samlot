<script setup lang="ts">
useHead({
  title: 'Contact | Samlot Diamond Resort'
})

const form = reactive({
  name: '',
  phone: '',
  email: '',
  inquiry: 'General Inquiry',
  checkIn: '',
  checkOut: '',
  message: '',
  agree: false
})

const inquiryTypes = [
  'General Inquiry',
  'Room Reservation',
  'Wedding Event',
  'Corporate Retreat'
]

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  checkIn: '',
  checkOut: '',
  agree: '',
  backend: ''
})

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

const isReservation = computed(() =>
  form.inquiry === 'Room Reservation'
)

const label =
  'mb-2 block text-[13px] text-neutral-600'

const input =
  'w-full rounded-xl border border-transparent bg-[#f1efeb] px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-neutral-900'

const validate = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let valid = true

  if (!form.name) {
    errors.name = 'Name is required'
    valid = false
  }

  if (!form.phone) {
    errors.phone = 'Phone is required'
    valid = false
  }

  if (!form.email) {
    errors.email = 'Email is required'
    valid = false
  }

  if (!form.agree) {
    errors.agree = 'Please accept the policy'
    valid = false
  }

  return valid
}

const submitContact = async () => {
  if (!validate()) return

  try {
    status.value = 'sending'

    setTimeout(() => {
      status.value = 'success'
    }, 1200)
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat"
    style="background-image:url('/picture/34.jpg')"
  >
    <div class="mx-auto max-w-7xl px-5 py-16">

      <div class="mt-24 grid gap-10 md:grid-cols-2">

        <!-- Left -->

        <section>
          <span
            class="inline-flex items-center rounded-xl bg-white/20 px-4 py-2 text-xs font-medium text-white backdrop-blur"
          >
            Get In Touch
          </span>

          <h1 class="mt-6 text-5xl font-medium text-white md:text-6xl">
            Contact Us
          </h1>

          <p class="mt-4 max-w-md text-white/80">
            We are here to help you plan your stay
            in the beautiful mountains of Samlot.
          </p>

          <div class="mt-12 space-y-8 text-white">

            <div>
              <h3 class="mb-2 font-semibold">
                Resort Location
              </h3>

              <p class="text-white/80">
                Samlot District, Battambang Province, Cambodia
              </p>
            </div>

            <div>
              <h3 class="mb-2 font-semibold">
                Phone
              </h3>

              <p class="text-white/80">
                +855 96 553 3359
              </p>
            </div>

            <div>
              <h3 class="mb-2 font-semibold">
                Email
              </h3>

              <a
                href="mailto:info@samlotdiamondresort.com"
                class="text-white/80"
              >
                info@samlotdiamondresort.com
              </a>
            </div>

          </div>
        </section>

        <!-- Form -->

        <form
          class="rounded-3xl bg-white/80 p-6 backdrop-blur-lg"
          @submit.prevent="submitContact"
        >
          <div
            v-if="status === 'success'"
            class="py-24 text-center"
          >
            <h2 class="text-3xl font-semibold">
              Thank You
            </h2>

            <p class="mt-3 text-neutral-600">
              We will reply shortly.
            </p>
          </div>

          <div
            v-else
            class="grid gap-4"
          >

            <div>
              <label :class="label">
                Full Name
              </label>

              <input
                v-model="form.name"
                :class="input"
              >

              <p
                v-if="errors.name"
                class="mt-1 text-xs text-red-600"
              >
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label :class="label">
                Phone Number
              </label>

              <input
                v-model="form.phone"
                :class="input"
              >
            </div>

            <div>
              <label :class="label">
                Email
              </label>

              <input
                v-model="form.email"
                type="email"
                :class="input"
              >
            </div>

            <div>
              <label :class="label">
                Inquiry Type
              </label>

              <select
                v-model="form.inquiry"
                :class="input"
              >
                <option
                  v-for="type in inquiryTypes"
                  :key="type"
                >
                  {{ type }}
                </option>
              </select>
            </div>

            <div
              v-if="isReservation"
              class="grid gap-4 sm:grid-cols-2"
            >
              <input
                v-model="form.checkIn"
                type="date"
                :class="input"
              >

              <input
                v-model="form.checkOut"
                type="date"
                :class="input"
              >
            </div>

            <textarea
              v-model="form.message"
              rows="4"
              placeholder="Message"
              :class="input"
            />

            <label
              class="flex items-center gap-3 text-sm"
            >
              <input
                v-model="form.agree"
                type="checkbox"
              >

              <span>
                I agree to the Privacy Policy.
              </span>
            </label>

            <p
              v-if="errors.agree"
              class="text-xs text-red-600"
            >
              {{ errors.agree }}
            </p>

            <button
              type="submit"
              :disabled="status === 'sending'"
              class="rounded-xl bg-[#151515] py-4 text-white transition hover:opacity-90"
            >
              {{ status === 'sending' ? 'Sending...' : 'Submit' }}
            </button>

          </div>

        </form>

      </div>

    </div>
  </div>
</template>