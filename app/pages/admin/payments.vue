<!-- app/pages/admin/payments/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Payments Manager',
})

interface PaymentRecord {
  id: number
  reference: string
  booking_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  amount: string | number
  currency: 'USD' | 'KHR'
  method: 'khqr' | 'bank_transfer' | 'cash' | 'card'
  method_label?: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  status_label?: string
  receipt?: string | null
  note?: string
  created_at: string
  updated_at: string
}

const R2_URL = 'https://pub-0c542abde828459785e3d8da1a74270d.r2.dev'
const { getPayments, verifyPayment } = useApi()

const normalizeReceiptUrl = (raw: unknown): string => {
  if (!raw || typeof raw !== 'string') return ''
  let url = raw.trim()
  while (url.startsWith('https://https://')) url = url.replace('https://https://', 'https://')
  while (url.startsWith('http://https://')) url = url.replace('http://https://', 'https://')
  if (/^https?:\/\//i.test(url)) return url
  return `${R2_URL}/${url.replace(/^\/+/, '')}`
}

const statusFilter = ref<'all' | 'pending' | 'paid' | 'failed' | 'refunded'>('all')
const methodFilter = ref<'all' | 'khqr' | 'bank_transfer' | 'cash' | 'card'>('all')
const searchQuery = ref('')

const { data: payments, pending, refresh } = await useAsyncData<PaymentRecord[]>(
  'admin-payments',
  async () => {
    try {
      const res: any = await getPayments({
        status: statusFilter.value,
        method: methodFilter.value,
      })
      const list = Array.isArray(res) ? res : (res?.results || [])
      return list.map((row: any) => ({
        ...row,
        receipt: normalizeReceiptUrl(row?.receipt),
      }))
    } catch {
      return []
    }
  },
  {
    watch: [statusFilter, methodFilter],
    default: () => [],
  }
)

const filteredPayments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return payments.value
  return payments.value.filter((p) =>
    [p.reference, p.booking_id, p.guest_name, p.guest_email, p.guest_phone]
      .filter(Boolean)
      .some((val) => String(val).toLowerCase().includes(q))
  )
})

const stats = computed(() => {
  const all = payments.value
  const paidUsd = all
    .filter((p) => p.status === 'paid' && p.currency === 'USD')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
  return {
    total: all.length,
    pending: all.filter((p) => p.status === 'pending').length,
    paid: all.filter((p) => p.status === 'paid').length,
    revenueUsd: paidUsd,
  }
})

const processingId = ref<number | null>(null)
const selectedReceipt = ref<PaymentRecord | null>(null)
const statusMessage = ref('')
const errorMessage = ref('')

const formatAmount = (amount: string | number, currency: 'USD' | 'KHR') => {
  const num = Number(amount || 0)
  return currency === 'KHR' ? `${num.toLocaleString()} ៛` : `$${num.toFixed(2)}`
}

const formatDate = (iso: string) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const badgeClass = (status: PaymentRecord['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-800'
    case 'pending':
      return 'bg-amber-100 text-amber-800'
    case 'failed':
      return 'bg-red-100 text-red-700'
    case 'refunded':
      return 'bg-slate-200 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const handleVerify = async (payment: PaymentRecord, newStatus: 'paid' | 'failed' | 'refunded') => {
  const actionLabel =
    newStatus === 'paid' ? 'Approve' : newStatus === 'failed' ? 'Reject' : 'Refund'
  if (!confirm(`${actionLabel} payment ${payment.reference} (${formatAmount(payment.amount, payment.currency)})?`)) {
    return
  }

  processingId.value = payment.id
  errorMessage.value = ''
  statusMessage.value = ''

  try {
    await verifyPayment(payment.id, newStatus)
    statusMessage.value = `Payment ${payment.reference} marked as ${newStatus}.`
    if (selectedReceipt.value?.id === payment.id) {
      selectedReceipt.value = null
    }
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || `Failed to update payment ${payment.reference}.`
  } finally {
    processingId.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">Payments Manager</h2>
        <p class="text-sm text-slate-500">
          Review guest KHQR receipts, bank transfers, and resort payments.
        </p>
      </div>

      <button
        type="button"
        @click="refresh()"
        class="rounded-full border border-slate-300 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        Refresh
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Records</p>
        <p class="mt-1 text-2xl font-bold text-[#1D3527]">{{ stats.total }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Pending Review</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">{{ stats.pending }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Verified Paid</p>
        <p class="mt-1 text-2xl font-bold text-emerald-700">{{ stats.paid }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Paid Revenue (USD)</p>
        <p class="mt-1 text-2xl font-bold text-[#1D3527]">${{ stats.revenueUsd.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="statusMessage"
      class="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      <span>{{ statusMessage }}</span>
      <button type="button" @click="statusMessage = ''" class="text-xs font-semibold hover:underline cursor-pointer">
        Dismiss
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in [
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'failed', label: 'Rejected' },
            { value: 'refunded', label: 'Refunded' },
          ]"
          :key="tab.value"
          type="button"
          @click="statusFilter = tab.value as any"
          :class="[
            'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
            statusFilter === tab.value
              ? 'bg-[#1D3527] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="methodFilter"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          <option value="all">All Methods</option>
          <option value="khqr">ABA / KHQR</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cash">Pay at Resort</option>
          <option value="card">Card</option>
        </select>

        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search ref, guest, phone..."
          class="w-52 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="n in 5" :key="n" class="h-16 animate-pulse rounded-xl bg-slate-200" />
    </div>

    <!-- Payments Table -->
    <div v-else-if="filteredPayments.length" class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th class="px-4 py-3">Reference</th>
            <th class="px-4 py-3">Guest</th>
            <th class="px-4 py-3">Amount</th>
            <th class="px-4 py-3">Method</th>
            <th class="px-4 py-3">Receipt</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-slate-50/70">
            <td class="px-4 py-3">
              <p class="font-mono text-xs font-semibold text-slate-900">{{ payment.reference }}</p>
              <p class="text-[11px] text-slate-400">{{ formatDate(payment.created_at) }}</p>
            </td>

            <td class="px-4 py-3">
              <p class="font-medium text-slate-800">{{ payment.guest_name }}</p>
              <p class="text-xs text-slate-500">{{ payment.guest_phone || payment.guest_email || '—' }}</p>
            </td>

            <td class="px-4 py-3 font-semibold text-[#1D3527]">
              {{ formatAmount(payment.amount, payment.currency) }}
            </td>

            <td class="px-4 py-3 text-xs text-slate-700">
              {{ payment.method_label || payment.method }}
            </td>

            <td class="px-4 py-3">
              <button
                v-if="payment.receipt"
                type="button"
                @click="selectedReceipt = payment"
                class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-[#1D3527] hover:bg-slate-100 cursor-pointer"
              >
                View Receipt
              </button>
              <span v-else class="text-xs text-slate-400">No file</span>
            </td>

            <td class="px-4 py-3">
              <span :class="['inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize', badgeClass(payment.status)]">
                {{ payment.status_label || payment.status }}
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-1.5">
                <button
                  v-if="payment.status === 'pending'"
                  type="button"
                  :disabled="processingId === payment.id"
                  @click="handleVerify(payment, 'paid')"
                  class="rounded-lg bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                >
                  Approve
                </button>
                <button
                  v-if="payment.status === 'pending'"
                  type="button"
                  :disabled="processingId === payment.id"
                  @click="handleVerify(payment, 'failed')"
                  class="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                >
                  Reject
                </button>
                <button
                  v-if="payment.status === 'paid'"
                  type="button"
                  :disabled="processingId === payment.id"
                  @click="handleVerify(payment, 'refunded')"
                  class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                >
                  Refund
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      No payment records match your filter.
    </div>

    <!-- Receipt Preview Modal -->
    <div
      v-if="selectedReceipt"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      @click.self="selectedReceipt = null"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-serif text-lg font-bold text-[#1D3527]">
              Receipt — {{ selectedReceipt.reference }}
            </h3>
            <p class="text-xs text-slate-500">
              {{ selectedReceipt.guest_name }} · {{ formatAmount(selectedReceipt.amount, selectedReceipt.currency) }}
            </p>
          </div>
          <button
            type="button"
            @click="selectedReceipt = null"
            class="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <img
            v-if="selectedReceipt.receipt"
            :src="selectedReceipt.receipt"
            alt="Payment Receipt"
            class="max-h-[60vh] w-full object-contain"
          />
        </div>

        <p v-if="selectedReceipt.note" class="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <span class="font-semibold text-slate-800">Note:</span> {{ selectedReceipt.note }}
        </p>

        <div v-if="selectedReceipt.status === 'pending'" class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            :disabled="processingId === selectedReceipt.id"
            @click="handleVerify(selectedReceipt, 'failed')"
            class="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Reject
          </button>
          <button
            type="button"
            :disabled="processingId === selectedReceipt.id"
            @click="handleVerify(selectedReceipt, 'paid')"
            class="rounded-lg bg-[#1D3527] px-5 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#2b4e38] cursor-pointer"
          >
            Approve Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>