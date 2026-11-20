<!-- app/components/PaymentForm.vue -->
<script setup lang="ts">
const props = defineProps<{
  bookingId?: string
  amount: number
  currency?: 'USD' | 'KHR'
}>()

const emit = defineEmits<{
  (e: 'success', payment: any): void
}>()

const { createPayment } = useApi()

const submitting = ref(false)
const errorMessage = ref('')
const paymentResult = ref<any>(null)

const form = reactive({
  guest_name: '',
  guest_email: '',
  guest_phone: '',
  method: 'khqr' as 'khqr' | 'bank_transfer' | 'cash',
  note: '',
  receiptFile: null as File | null,
  receiptPreview: '',
})

const onReceiptChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (form.receiptPreview.startsWith('blob:')) URL.revokeObjectURL(form.receiptPreview)
  form.receiptFile = file
  form.receiptPreview = URL.createObjectURL(file)
}

const handlePay = async () => {
  errorMessage.value = ''

  if (!form.guest_name.trim()) {
    errorMessage.value = 'Please enter your full name.'
    return
  }

  if ((form.method === 'khqr' || form.method === 'bank_transfer') && !form.receiptFile) {
    errorMessage.value = 'Please upload your payment receipt screenshot.'
    return
  }

  const formData = new FormData()
  formData.append('booking_id', props.bookingId || '')
  formData.append('guest_name', form.guest_name.trim())
  formData.append('guest_email', form.guest_email.trim())
  formData.append('guest_phone', form.guest_phone.trim())
  formData.append('amount', String(props.amount))
  formData.append('currency', props.currency || 'USD')
  formData.append('method', form.method)
  formData.append('note', form.note.trim())
  if (form.receiptFile) {
    formData.append('receipt', form.receiptFile)
  }

  submitting.value = true
  try {
    const res = await createPayment(formData)
    paymentResult.value = res
    emit('success', res)
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Payment submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div v-if="paymentResult" class="py-6 text-center space-y-3">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold">
        ✓
      </div>
      <h3 class="font-serif text-xl font-bold text-[#1D3527]">Payment Submitted</h3>
      <p class="text-sm text-slate-600">
        Reference: <span class="font-mono font-semibold text-slate-900">{{ paymentResult.reference }}</span>
      </p>
      <p class="text-xs text-slate-500">
        Our team will verify your payment and confirm your booking shortly.
      </p>
    </div>

    <form v-else @submit.prevent="handlePay" class="space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">Complete Payment</h3>
          <p class="text-xs text-slate-500">Samlot Diamond Resort</p>
        </div>
        <div class="text-right">
          <p class="text-xs uppercase tracking-wider text-slate-400">Total</p>
          <p class="text-xl font-bold text-[#1D3527]">
            {{ props.currency === 'KHR' ? `${props.amount.toLocaleString()} ៛` : `$${props.amount.toFixed(2)}` }}
          </p>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <!-- Payment Method -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="opt in [
            { id: 'khqr', label: 'ABA / KHQR' },
            { id: 'bank_transfer', label: 'Bank Transfer' },
            { id: 'cash', label: 'Pay at Resort' },
          ]"
          :key="opt.id"
          type="button"
          @click="form.method = opt.id as any"
          :class="[
            'rounded-xl border py-2.5 px-3 text-xs font-semibold transition cursor-pointer',
            form.method === opt.id
              ? 'border-[#1D3527] bg-[#1D3527] text-[#D4AF37]'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
          ]"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- KHQR / Bank Details -->
      <div v-if="form.method === 'khqr' || form.method === 'bank_transfer'" class="rounded-xl bg-[#F8F7F4] p-4 text-center space-y-2 border border-slate-200">
        <p class="text-xs font-semibold uppercase tracking-wider text-[#1D3527]">
          Scan KHQR or Transfer To
        </p>
        <p class="text-sm font-medium text-slate-800">ABA Bank — Samlot Diamond Resort</p>
        <p class="font-mono text-sm text-slate-600">Account: 000 123 456</p>
      </div>

      <!-- Guest Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="mb-1 block text-xs font-medium text-slate-700">Full Name *</label>
          <input v-model="form.guest_name" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-700">Phone</label>
          <input v-model="form.guest_phone" type="tel" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-slate-700">Email</label>
          <input v-model="form.guest_email" type="email" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </div>

      <!-- Receipt Upload -->
      <div v-if="form.method !== 'cash'">
        <label class="mb-1 block text-xs font-medium text-slate-700">Upload Payment Receipt *</label>
        <input type="file" accept="image/*" @change="onReceiptChange" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <img
          v-if="form.receiptPreview"
          :src="form.receiptPreview"
          alt="Receipt preview"
          class="mt-3 max-h-48 w-full rounded-xl border border-slate-200 object-contain bg-slate-50"
        />
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full rounded-full bg-[#1D3527] py-3 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38] disabled:opacity-60 cursor-pointer"
      >
        {{ submitting ? 'Submitting...' : 'Confirm Payment' }}
      </button>
    </form>
  </div>
</template>