<!-- app/pages/admin/bookings/index.vue -->
<script setup lang="ts">
import type { Booking, BookingPayload } from '~/types/booking'
import type { Room } from '~/types/room'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Bookings & Reservations'
})

const {
  getBookings,
  getRooms,
  createBooking,
  checkAvailability,
  checkInBooking,
  checkOutBooking
} = useApi()

const { data: bookings, pending, error, refresh } = await useAsyncData<Booking[]>(
  'admin-bookings',
  async () => {
    const res: any = await getBookings()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)

const { data: rooms } = await useAsyncData<Room[]>(
  'admin-booking-rooms',
  () => getRooms(),
  { default: () => [] }
)

/* Filters */
const activeStatus = ref<string>('all')
const searchQuery = ref('')
const actionLoadingId = ref<number | null>(null)

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'checked_in', label: 'Checked In' },
  { key: 'checked_out', label: 'Checked Out' },
  { key: 'cancelled', label: 'Cancelled' }
]

const getGuestFullName = (b: Booking) => {
  if (b.guest_name) return b.guest_name
  return `${b.first_name || ''} ${b.last_name || ''}`.trim() || 'Guest'
}

const getRoomLabel = (b: Booking) => {
  return b.room_name || b.accommodation_type_name || '-'
}

const filteredBookings = computed(() => {
  return bookings.value.filter((b) => {
    const matchesStatus = activeStatus.value === 'all' || b.status === activeStatus.value
    const q = searchQuery.value.trim().toLowerCase()
    if (!q) return matchesStatus

    const haystack = [
      b.booking_code,
      getGuestFullName(b),
      getRoomLabel(b),
      b.email,
      b.phone
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return matchesStatus && haystack.includes(q)
  })
})

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-emerald-100 text-emerald-800',
    checked_out: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return map[status] || 'bg-slate-100 text-slate-700'
}

/* Check-in / Check-out Actions */
const handleCheckIn = async (booking: Booking) => {
  if (!confirm(`Check in ${getGuestFullName(booking)} (${booking.booking_code})?`)) return
  actionLoadingId.value = booking.id
  try {
    await checkInBooking(booking.id)
    await refresh()
  } catch (err: any) {
    alert(err?.data?.detail || 'Failed to check in booking.')
  } finally {
    actionLoadingId.value = null
  }
}

const handleCheckOut = async (booking: Booking) => {
  if (!confirm(`Check out ${getGuestFullName(booking)} (${booking.booking_code})?`)) return
  actionLoadingId.value = booking.id
  try {
    await checkOutBooking(booking.id)
    await refresh()
  } catch (err: any) {
    alert(err?.data?.detail || 'Failed to check out booking.')
  } finally {
    actionLoadingId.value = null
  }
}

/* View Details Modal */
const selectedBooking = ref<Booking | null>(null)

/* Create Walk-in Booking Modal */
const showCreateModal = ref(false)
const creating = ref(false)
const availabilityMessage = ref('')
const isAvailable = ref<boolean | null>(null)
const formError = ref('')

const newBooking = reactive({
  accommodation_type_id: 0,
  check_in: '',
  check_out: '',
  adults: 2,
  children: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  nationality: '',
  notes: ''
})

const openCreateModal = () => {
  newBooking.accommodation_type_id = rooms.value[0]?.id || 0
  newBooking.check_in = ''
  newBooking.check_out = ''
  newBooking.adults = 2
  newBooking.children = 0
  newBooking.first_name = ''
  newBooking.last_name = ''
  newBooking.email = ''
  newBooking.phone = ''
  newBooking.nationality = ''
  newBooking.notes = ''
  availabilityMessage.value = ''
  isAvailable.value = null
  formError.value = ''
  showCreateModal.value = true
}

const verifyAvailability = async () => {
  if (!newBooking.accommodation_type_id || !newBooking.check_in || !newBooking.check_out) return
  availabilityMessage.value = 'Checking availability...'
  isAvailable.value = null
  try {
    const res: any = await checkAvailability(
      newBooking.accommodation_type_id,
      newBooking.check_in,
      newBooking.check_out
    )
    isAvailable.value = Boolean(res?.available ?? true)
    availabilityMessage.value = isAvailable.value
      ? 'Room is available for these dates.'
      : (res?.message || 'Selected room is not available for these dates.')
  } catch (err: any) {
    isAvailable.value = false
    availabilityMessage.value = err?.data?.detail || 'Could not verify availability.'
  }
}

watch(
  () => [newBooking.accommodation_type_id, newBooking.check_in, newBooking.check_out],
  () => {
    if (newBooking.accommodation_type_id && newBooking.check_in && newBooking.check_out) {
      verifyAvailability()
    }
  }
)

const handleCreateBooking = async () => {
  formError.value = ''
  if (!newBooking.accommodation_type_id || !newBooking.check_in || !newBooking.check_out) {
    formError.value = 'Room, Check-in, and Check-out dates are required.'
    return
  }
  if (!newBooking.first_name.trim() || !newBooking.last_name.trim()) {
    formError.value = 'Guest first name and last name are required.'
    return
  }

  creating.value = true
  try {
    const payload: BookingPayload = {
      accommodation_type_id: newBooking.accommodation_type_id,
      check_in: newBooking.check_in,
      check_out: newBooking.check_out,
      adults: newBooking.adults,
      children: newBooking.children,
      first_name: newBooking.first_name.trim(),
      last_name: newBooking.last_name.trim(),
      email: newBooking.email.trim(),
      phone: newBooking.phone.trim(),
      nationality: newBooking.nationality.trim(),
      notes: newBooking.notes.trim()
    }
    await createBooking(payload)
    showCreateModal.value = false
    await refresh()
  } catch (err: any) {
    formError.value = err?.data?.detail || 'Failed to create booking. Check your fields and try again.'
  } finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">
          Bookings & Reservations
        </h2>
        <p class="text-sm text-slate-500">
          Manage guest reservations, check-ins, check-outs, and walk-in bookings.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="refresh()"
          class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
        <button
          @click="openCreateModal"
          class="rounded-lg bg-[#1D3527] px-5 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38]"
        >
          + New Booking
        </button>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Failed to load bookings from <code>/bookings/</code>.
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in statusTabs"
          :key="tab.key"
          @click="activeStatus = tab.key"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
            activeStatus === tab.key
              ? 'bg-[#1D3527] text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search code, guest, room, phone..."
        class="w-full sm:w-72 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
      >
    </div>

    <!-- Bookings Table -->
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th class="px-5 py-3 font-medium">Code</th>
              <th class="px-5 py-3 font-medium">Guest</th>
              <th class="px-5 py-3 font-medium">Room</th>
              <th class="px-5 py-3 font-medium">Dates</th>
              <th class="px-5 py-3 font-medium">Guests</th>
              <th class="px-5 py-3 font-medium">Total</th>
              <th class="px-5 py-3 font-medium">Status</th>
              <th class="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="pending">
              <td colspan="8" class="px-5 py-8 text-center text-slate-400">
                Loading bookings...
              </td>
            </tr>

            <tr v-else-if="!filteredBookings.length">
              <td colspan="8" class="px-5 py-8 text-center text-slate-400">
                No bookings match your filter.
              </td>
            </tr>

            <tr v-for="b in filteredBookings" :key="b.id" class="hover:bg-slate-50">
              <td class="px-5 py-3 font-mono text-xs font-semibold text-slate-700">
                {{ b.booking_code }}
              </td>
              <td class="px-5 py-3">
                <p class="font-medium text-slate-900">{{ getGuestFullName(b) }}</p>
                <p class="text-xs text-slate-500">{{ b.phone || b.email }}</p>
              </td>
              <td class="px-5 py-3 text-slate-700">{{ getRoomLabel(b) }}</td>
              <td class="px-5 py-3 text-xs text-slate-600">
                <div>In: {{ b.check_in }}</div>
                <div>Out: {{ b.check_out }}</div>
              </td>
              <td class="px-5 py-3 text-xs text-slate-600">
                {{ b.adults }}A / {{ b.children }}C
              </td>
              <td class="px-5 py-3 font-semibold text-slate-900">
                ${{ Number(b.total_amount || 0).toLocaleString() }}
              </td>
              <td class="px-5 py-3">
                <span :class="['rounded-full px-2.5 py-1 text-xs font-medium capitalize', statusBadge(b.status)]">
                  {{ b.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="b.status === 'pending' || b.status === 'confirmed'"
                    @click="handleCheckIn(b)"
                    :disabled="actionLoadingId === b.id"
                    class="rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-800 disabled:opacity-50"
                  >
                    Check In
                  </button>
                  <button
                    v-if="b.status === 'checked_in'"
                    @click="handleCheckOut(b)"
                    :disabled="actionLoadingId === b.id"
                    class="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-600 disabled:opacity-50"
                  >
                    Check Out
                  </button>
                  <button
                    @click="selectedBooking = b"
                    class="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div
      v-if="selectedBooking"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="font-serif text-xl font-bold text-[#1D3527]">
              Booking {{ selectedBooking.booking_code }}
            </h3>
            <p class="text-xs text-slate-500">Created {{ selectedBooking.created_at || '-' }}</p>
          </div>
          <button @click="selectedBooking = null" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-500">Guest</span>
            <span class="font-medium text-slate-900">{{ getGuestFullName(selectedBooking) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Email</span>
            <span>{{ selectedBooking.email || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Phone</span>
            <span>{{ selectedBooking.phone || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Nationality</span>
            <span>{{ selectedBooking.nationality || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Room</span>
            <span class="font-medium">{{ getRoomLabel(selectedBooking) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Stay</span>
            <span>{{ selectedBooking.check_in }} → {{ selectedBooking.check_out }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Guests</span>
            <span>{{ selectedBooking.adults }} Adults, {{ selectedBooking.children }} Children</span>
          </div>
          <div class="flex justify-between border-t border-slate-100 pt-3">
            <span class="font-medium text-slate-700">Total Amount</span>
            <span class="text-lg font-bold text-[#1D3527]">
              ${{ Number(selectedBooking.total_amount || 0).toLocaleString() }}
            </span>
          </div>
          <div v-if="selectedBooking.notes" class="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <p class="mb-1 font-semibold text-slate-700">Special Request:</p>
            <p>{{ selectedBooking.notes }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="selectedBooking = null"
            class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- New Booking Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">
            New Walk-in / Phone Booking
          </h3>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div v-if="formError" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ formError }}
        </div>

        <form @submit.prevent="handleCreateBooking" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">Room / Villa</label>
              <select
                v-model.number="newBooking.accommodation_type_id"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
              >
                <option v-for="r in rooms" :key="r.id" :value="r.id">
                  {{ r.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Check In</label>
              <input
                v-model="newBooking.check_in"
                type="date"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Check Out</label>
              <input
                v-model="newBooking.check_out"
                type="date"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
              >
            </div>

            <div
              v-if="availabilityMessage"
              :class="[
                'sm:col-span-2 rounded-lg px-3 py-2 text-xs font-medium',
                isAvailable === true
                  ? 'bg-emerald-50 text-emerald-800'
                  : isAvailable === false
                    ? 'bg-red-50 text-red-700'
                    : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ availabilityMessage }}
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Adults</label>
              <input
                v-model.number="newBooking.adults"
                type="number"
                min="1"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Children</label>
              <input
                v-model.number="newBooking.children"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">First Name</label>
              <input
                v-model="newBooking.first_name"
                type="text"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Last Name</label>
              <input
                v-model="newBooking.last_name"
                type="text"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Email</label>
              <input
                v-model="newBooking.email"
                type="email"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Phone</label>
              <input
                v-model="newBooking.phone"
                type="text"
                required
                placeholder="+855"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">Nationality</label>
              <input
                v-model="newBooking.nationality"
                type="text"
                placeholder="e.g. Cambodian"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">Special Request</label>
              <textarea
                v-model="newBooking.notes"
                rows="3"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating || isAvailable === false"
              class="rounded-lg bg-[#1D3527] px-5 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38] disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create Booking' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>