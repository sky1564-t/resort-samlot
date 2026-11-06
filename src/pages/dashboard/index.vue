<script setup lang="ts">
import { STATUS_LABEL, useBookingDashboard } from '~/composables/useBookingDashboard'
import type { BookingStatus, DashboardBooking } from '~/composables/useBookingDashboard'

definePageMeta({ layout: false })
useHead({ title: 'Dashboard · Samlot Diamond Resort' })

const { today, rooms, stats, bookings, loading, error, load, setStatus } = useBookingDashboard()

const filter = ref<'all' | BookingStatus>('all')
const search = ref('')
const sortBy = ref<'check_in' | 'total' | 'guest'>('check_in')
const selected = ref<DashboardBooking | null>(null)
const nextStatus = ref<BookingStatus>('pending')
const toast = ref('')
const saving = ref(false)

onMounted(load)

const statuses = Object.keys(STATUS_LABEL) as BookingStatus[]
const DAYS = 14
const DAY = 86400000

const start = computed(() => new Date((today.value || new Date().toISOString().slice(0, 10)) + 'T00:00:00'))
const days = computed(() => Array.from({ length: DAYS }, (_, i) => new Date(start.value.getTime() + i * DAY)))

const fmt = (v: string | Date) => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const usd = (n: number) => '$' + n.toLocaleString()
const initials = (n: string) => n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

const live = computed(() => bookings.value.filter((b) => b.status !== 'cancelled'))
const arrivals = computed(() => live.value.filter((b) => b.check_in === today.value))
const departures = computed(() => live.value.filter((b) => b.check_out === today.value))

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  const list = bookings.value.filter(
    (b) => (filter.value === 'all' || b.status === filter.value) && `${b.guest}${b.room}${b.code}`.toLowerCase().includes(q),
  )
  return list.sort((a, b) =>
    sortBy.value === 'total' ? b.total - a.total : sortBy.value === 'guest' ? a.guest.localeCompare(b.guest) : a.check_in.localeCompare(b.check_in),
  )
})

const count = (s: 'all' | BookingStatus) => (s === 'all' ? bookings.value.length : bookings.value.filter((b) => b.status === s).length)

function barsFor(room: string) {
  return live.value
    .filter((b) => b.room === room)
    .map((b) => {
      const s = Math.round((new Date(b.check_in + 'T00:00:00').getTime() - start.value.getTime()) / DAY)
      return { b, from: Math.max(s, 0), to: Math.min(s + b.nights, DAYS) }
    })
    .filter((x) => x.to > x.from)
}

function open(b: DashboardBooking) {
  selected.value = b
  nextStatus.value = b.status
}

function notify(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 2600)
}

async function save() {
  if (!selected.value) return
  saving.value = true
  try {
    await setStatus(selected.value.id, nextStatus.value)
    selected.value = bookings.value.find((b) => b.id === selected.value!.id) ?? null
    notify('Status saved')
  } catch {
    notify('Could not save. Sign in as staff and try again.')
  } finally {
    saving.value = false
  }
}

const icons = {
  in: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
    
    <!-- Sidebar -->
    <aside class="hidden w-56 shrink-0 bg-emerald-950 text-emerald-100 sticky top-0 h-screen md:flex md:flex-col">
      <div class="p-6 border-b border-emerald-800 flex items-center gap-3">
        <img src="/logo/logo.png" alt="Samlot Diamond Resort Logo" class="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm" />
        <div>
          <h1 class="text-lg font-serif font-bold tracking-wider leading-tight text-white">Samlot Admin</h1>
          <p class="text-[10px] text-emerald-300 uppercase tracking-widest">Resort Management</p>
        </div>
      </div>
      <nav class="p-4 space-y-1 flex-1">
        <a class="block px-4 py-2 bg-emerald-800 text-white rounded-lg shadow-inner font-medium" href="/dashboard">Bookings</a>
        <a class="block px-4 py-2 text-emerald-200 hover:bg-emerald-800 rounded-lg transition-colors" href="http://localhost:8000/admin/rooms-dashboard/">Rooms</a>
        <a class="block px-4 py-2 text-emerald-200 hover:bg-emerald-800 rounded-lg transition-colors" href="http://localhost:8000/admin/">Django Admin</a>
        <a class="block px-4 py-2 text-emerald-200 hover:bg-emerald-800 rounded-lg transition-colors" href="/">View Website</a>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 min-w-0 p-6 md:p-8 flex flex-col gap-6">
      
      <!-- Header -->
      <header class="flex justify-between items-end gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Bookings Overview</h1>
          <p class="text-sm text-slate-500 mt-1">{{ start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
        </div>
        <button class="bg-[#14513f] hover:bg-emerald-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-60" :disabled="loading" @click="load">
          {{ loading ? 'Refreshing…' : 'Refresh Data' }}
        </button>
      </header>

      <div v-if="error" class="flex justify-between items-center bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-medium">
        <span>{{ error }}</span>
        <a href="http://localhost:8000/admin/login/?next=/admin/" target="_blank" rel="noopener" class="underline hover:text-red-900">Sign in to Django admin</a>
      </div>

      <!-- KPIs -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <span class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0"><svg class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path :d="icons.in" /></svg></span>
          <div><b class="block text-2xl font-bold leading-tight">{{ stats.arrivals_today }}</b><span class="text-xs text-slate-500 font-medium uppercase tracking-wider">Arrivals Today</span></div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <span class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><svg class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path :d="icons.out" /></svg></span>
          <div><b class="block text-2xl font-bold leading-tight">{{ stats.departures_today }}</b><span class="text-xs text-slate-500 font-medium uppercase tracking-wider">Departures Today</span></div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <span class="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0"><svg class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path :d="icons.clock" /></svg></span>
          <div><b class="block text-2xl font-bold leading-tight">{{ stats.pending }}</b><span class="text-xs text-slate-500 font-medium uppercase tracking-wider">Awaiting Confirmation</span></div>
        </div>
        <div class="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative bg-slate-100" :style="{ background: `conic-gradient(#14513f ${stats.occupancy_percent}%, #f1f5f9 0)` }">
            <div class="absolute inset-[4px] rounded-full bg-white flex items-center justify-center"><span class="text-xs font-bold">{{ stats.occupancy_percent }}%</span></div>
          </div>
          <div><b class="block text-lg font-bold leading-tight">Occupied Tonight</b><span class="text-xs text-slate-500 font-medium">of {{ rooms.length }} room{{ rooms.length === 1 ? '' : 's' }}</span></div>
        </div>
      </section>

      <!-- Timeline & Today Split -->
      <section class="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        
        <!-- 14-Day Timeline -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-w-0">
          <div class="mb-4">
            <h2 class="text-lg font-bold">Next 14 Days</h2>
            <p class="text-sm text-slate-500">Each bar is a stay. Select one to open it.</p>
          </div>
          <div class="overflow-x-auto">
            <div class="min-w-[640px]">
              <!-- Timeline Header -->
              <div class="grid grid-cols-[120px_1fr] border-b border-slate-200 pb-2">
                <span></span>
                <div class="grid grid-cols-[repeat(14,1fr)]">
                  <span v-for="(d, i) in days" :key="i" class="flex flex-col items-center text-[10px] text-slate-400">
                    {{ d.toLocaleDateString('en-GB', { weekday: 'short' }) }}
                    <b :class="['text-xs font-bold mt-1 flex items-center justify-center w-6 h-6 rounded-full', i === 0 ? 'bg-[#14513f] text-white' : 'text-slate-800']">{{ d.getDate() }}</b>
                  </span>
                </div>
              </div>
              <!-- Timeline Rows -->
              <div v-for="room in rooms" :key="room" class="grid grid-cols-[120px_1fr] border-b border-slate-100 last:border-0 relative">
                <span class="py-3 font-semibold text-sm truncate pr-2">{{ room }}</span>
                <div class="grid grid-cols-[repeat(14,1fr)] min-h-[46px] items-center relative" style="background: repeating-linear-gradient(90deg, transparent 0 calc(100%/14 - 1px), #f1f5f9 calc(100%/14 - 1px) calc(100%/14));">
                  <button
                    v-for="x in barsFor(room)" :key="x.b.id"
                    :class="[
                      'h-7 mx-0.5 px-2.5 rounded-md text-xs font-semibold text-left truncate transition-all hover:brightness-110 border-l-4',
                      x.b.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-500' :
                      x.b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-500' :
                      'bg-red-100 text-red-800 border-red-500'
                    ]"
                    :style="{ gridColumn: `${x.from + 1} / ${x.to + 1}` }"
                    :title="`${x.b.guest} · ${fmt(x.b.check_in)} – ${fmt(x.b.check_out)}`"
                    @click="open(x.b)"
                  >
                    {{ x.b.guest }}
                  </button>
                </div>
              </div>
              <p v-if="!rooms.length" class="py-4 text-sm text-slate-500">No rooms yet. Add rooms in Django admin to see the timeline.</p>
            </div>
          </div>
        </div>

        <!-- Today Arrivals/Departures -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div class="mb-4">
            <h2 class="text-lg font-bold">Today</h2>
            <p class="text-sm text-slate-500">Guests arriving and leaving.</p>
          </div>
          
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">Arriving</h3>
          <ul v-if="arrivals.length" class="space-y-1">
            <li v-for="b in arrivals" :key="b.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition" @click="open(b)">
              <span class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">{{ initials(b.guest) }}</span>
              <div><b class="text-sm block leading-tight">{{ b.guest }}</b><small class="text-xs text-slate-500">{{ b.room }} · {{ b.nights }} night{{ b.nights === 1 ? '' : 's' }}</small></div>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-400 py-2">No arrivals today.</p>

          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-6">Leaving</h3>
          <ul v-if="departures.length" class="space-y-1">
            <li v-for="b in departures" :key="b.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition" @click="open(b)">
              <span class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">{{ initials(b.guest) }}</span>
              <div><b class="text-sm block leading-tight">{{ b.guest }}</b><small class="text-xs text-slate-500">{{ b.room }}</small></div>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-400 py-2">No departures today.</p>
        </div>
      </section>

      <!-- Data Table -->
      <section class="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 class="text-lg font-bold">All Reservations</h2>
            <p class="text-sm text-slate-500">{{ filtered.length }} of {{ bookings.length }} shown</p>
          </div>
          <div class="flex gap-2 flex-wrap w-full sm:w-auto">
            <input v-model="search" type="search" placeholder="Search guest, room or code" class="flex-1 sm:w-56 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#14513f]" />
            <select v-model="sortBy" class="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none">
              <option value="check_in">Check-in date</option>
              <option value="total">Total amount</option>
              <option value="guest">Guest name</option>
            </select>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex overflow-x-auto border-b border-slate-200 px-5 gap-2 hide-scrollbar">
          <button v-for="s in ['all', ...statuses]" :key="s" :class="['px-3 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors', filter === s ? 'border-[#14513f] text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700']" @click="filter = s as any">
            {{ s === 'all' ? 'All' : STATUS_LABEL[s as BookingStatus] }}
            <span class="ml-1.5 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{{ count(s as any) }}</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px] text-left">
            <thead class="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th class="px-5 py-3">Guest</th>
                <th class="px-5 py-3">Room</th>
                <th class="px-5 py-3">Stay</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr v-for="b in filtered" :key="b.id" class="hover:bg-slate-50 cursor-pointer transition" tabindex="0" @click="open(b)" @keydown.enter="open(b)">
                <td class="px-5 py-3">
                  <div class="flex items-center gap-3">
                    <span class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">{{ initials(b.guest) }}</span>
                    <div><b class="block font-medium text-slate-900">{{ b.guest }}</b><small class="text-xs text-slate-500">{{ b.code }}</small></div>
                  </div>
                </td>
                <td class="px-5 py-3 text-slate-700">{{ b.room }}</td>
                <td class="px-5 py-3">
                  <span class="block text-slate-900">{{ fmt(b.check_in) }} – {{ fmt(b.check_out) }}</span>
                  <small class="text-xs text-slate-500">{{ b.nights }} night{{ b.nights === 1 ? '' : 's' }}</small>
                </td>
                <td class="px-5 py-3">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', 
                    b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                    b.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  ]">
                    {{ STATUS_LABEL[b.status] }}
                  </span>
                </td>
                <td class="px-5 py-3 text-right font-medium text-slate-900">{{ usd(b.total) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!filtered.length && !loading" class="text-center py-10 text-sm text-slate-500">No bookings match. Clear the search or pick another status.</p>
        </div>
      </section>
    </div>

    <!-- Edit Booking Modal/Drawer -->
    <div v-if="selected" class="fixed inset-0 bg-slate-900/50 z-40 transition-opacity" @click="selected = null"></div>
    <aside v-if="selected" class="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl p-6 overflow-y-auto flex flex-col gap-5" role="dialog" @keydown.esc="selected = null">
      <div class="flex items-center gap-4">
        <span class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">{{ initials(selected.guest) }}</span>
        <div><h2 class="text-xl font-bold leading-tight">{{ selected.guest }}</h2><small class="text-sm text-slate-500">{{ selected.code }}</small></div>
      </div>
      
      <div>
        <span :class="['inline-flex px-3 py-1 rounded-full text-xs font-bold', 
          selected.status === 'pending' ? 'bg-amber-100 text-amber-800' :
          selected.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
          selected.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-slate-100 text-slate-800'
        ]">
          {{ STATUS_LABEL[selected.status] }}
        </span>
      </div>

      <dl class="grid grid-cols-[100px_1fr] gap-y-3 gap-x-2 py-4 border-y border-slate-200 text-sm">
        <dt class="text-slate-500">Room</dt><dd class="font-semibold text-slate-900">{{ selected.room }}</dd>
        <dt class="text-slate-500">Check-in</dt><dd class="font-semibold text-slate-900">{{ fmt(selected.check_in) }}</dd>
        <dt class="text-slate-500">Check-out</dt><dd class="font-semibold text-slate-900">{{ fmt(selected.check_out) }}</dd>
        <dt class="text-slate-500">Nights</dt><dd class="font-semibold text-slate-900">{{ selected.nights }}</dd>
        <dt class="text-slate-500">Total</dt><dd class="font-semibold text-slate-900">{{ usd(selected.total) }}</dd>
      </dl>

      <div class="flex flex-col gap-2">
        <label for="st" class="text-sm font-semibold text-slate-900">Change status</label>
        <select id="st" v-model="nextStatus" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-[#14513f]">
          <option v-for="s in statuses" :key="s" :value="s">{{ STATUS_LABEL[s] }}</option>
        </select>
      </div>

      <div class="flex gap-3 mt-4">
        <button class="flex-1 bg-[#14513f] hover:bg-emerald-800 text-white py-2 rounded-lg font-medium transition disabled:opacity-60" :disabled="saving" @click="save">
          {{ saving ? 'Saving…' : 'Save status' }}
        </button>
        <button class="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg font-medium transition" @click="selected = null">Close</button>
      </div>
    </aside>

    <!-- Global Toast -->
    <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-lg z-50 font-medium text-sm transition-all">
      {{ toast }}
    </div>
  </div>
</template>

<style scoped>
/* Utility class to hide scrollbar across browsers while retaining scroll functionality */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>