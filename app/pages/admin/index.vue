<!-- app/pages/admin/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Dashboard Overview',
})

interface DashboardSummary {
  occupancy_rate: number
  today_checkins: number
  active_bookings: number
  monthly_revenue: number
  rooms_status: {
    available: number
    occupied: number
    cleaning: number
    maintenance: number
  }
  recent_bookings: Array<{
    id: number
    booking_code: string
    guest_name: string
    room_name: string
    check_in: string
    check_out: string
    total_amount: number
    status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  }>
}

const { useApiFetch } = useApi()

const { data: summary, pending, error, refresh } = await useApiFetch<DashboardSummary>(
  '/reports/dashboard-summary/',
  {
    default: () => ({
      occupancy_rate: 0,
      today_checkins: 0,
      active_bookings: 0,
      monthly_revenue: 0,
      rooms_status: { available: 0, occupied: 0, cleaning: 0, maintenance: 0 },
      recent_bookings: [],
    }),
  }
)

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-emerald-100 text-emerald-800',
    checked_out: 'bg-slate-100 text-slate-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return styles[status] || 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Actions -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-slate-900">Samlot Diamond Resort Overview</h2>
        <p class="text-sm text-slate-500">Live operational summary from Django REST API</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="refresh()"
          class="px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
        >
          Refresh
        </button>
        <NuxtLink
          to="/admin/bookings"
          class="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-900 text-amber-400 hover:bg-emerald-800"
        >
          + Manage Bookings
        </NuxtLink>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
      Unable to load dashboard summary. Verify your Django endpoint <code>/api/reports/dashboard-summary/</code> is running.
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Occupancy Rate</p>
        <p class="mt-2 text-3xl font-bold text-emerald-900">
          {{ pending ? '...' : `${summary.occupancy_rate}%` }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Today's Check-ins</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">
          {{ pending ? '...' : summary.today_checkins }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Active Bookings</p>
        <p class="mt-2 text-3xl font-bold text-slate-900">
          {{ pending ? '...' : summary.active_bookings }}
        </p>
      </div>

      <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Monthly Revenue</p>
        <p class="mt-2 text-3xl font-bold text-amber-600">
          {{ pending ? '...' : `$${Number(summary.monthly_revenue).toLocaleString()}` }}
        </p>
      </div>
    </div>

    <!-- Room Status Breakdown -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <p class="text-xs font-semibold text-emerald-700 uppercase">Available</p>
        <p class="text-2xl font-bold text-emerald-900 mt-1">{{ summary.rooms_status.available }}</p>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p class="text-xs font-semibold text-blue-700 uppercase">Occupied</p>
        <p class="text-2xl font-bold text-blue-900 mt-1">{{ summary.rooms_status.occupied }}</p>
      </div>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p class="text-xs font-semibold text-amber-700 uppercase">Cleaning</p>
        <p class="text-2xl font-bold text-amber-900 mt-1">{{ summary.rooms_status.cleaning }}</p>
      </div>
      <div class="bg-red-50 border border-red-200 rounded-xl p-4">
        <p class="text-xs font-semibold text-red-700 uppercase">Maintenance</p>
        <p class="text-2xl font-bold text-red-900 mt-1">{{ summary.rooms_status.maintenance }}</p>
      </div>
    </div>

    <!-- Recent Bookings Table -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 class="font-semibold text-slate-800">Recent Bookings</h3>
        <NuxtLink to="/admin/bookings" class="text-sm font-medium text-emerald-800 hover:underline">
          View all →
        </NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th class="px-5 py-3 font-medium">Code</th>
              <th class="px-5 py-3 font-medium">Guest</th>
              <th class="px-5 py-3 font-medium">Room / Villa</th>
              <th class="px-5 py-3 font-medium">Dates</th>
              <th class="px-5 py-3 font-medium">Total</th>
              <th class="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="!summary.recent_bookings.length">
              <td colspan="6" class="px-5 py-8 text-center text-slate-400">
                No recent bookings found.
              </td>
            </tr>
            <tr v-for="b in summary.recent_bookings" :key="b.id" class="hover:bg-slate-50">
              <td class="px-5 py-3 font-mono text-xs font-semibold text-slate-700">{{ b.booking_code }}</td>
              <td class="px-5 py-3 font-medium text-slate-900">{{ b.guest_name }}</td>
              <td class="px-5 py-3 text-slate-600">{{ b.room_name }}</td>
              <td class="px-5 py-3 text-slate-600">{{ b.check_in }} → {{ b.check_out }}</td>
              <td class="px-5 py-3 font-semibold text-slate-900">${{ Number(b.total_amount).toLocaleString() }}</td>
              <td class="px-5 py-3">
                <span :class="['px-2.5 py-1 rounded-full text-xs font-medium capitalize', statusBadge(b.status)]">
                  {{ b.status.replace('_', ' ') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>