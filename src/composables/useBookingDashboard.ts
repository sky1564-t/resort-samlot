
// frontend/src/composables/useBookingDashboard.ts

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'

export interface DashboardBooking {
  id: number
  code: string
  guest: string
  room: string
  check_in: string
  check_out: string
  nights: number
  total: number
  status: BookingStatus
}

export interface DashboardStats {
  arrivals_today: number
  departures_today: number
  pending: number
  occupancy_percent: number
}

interface DashboardResponse {
  today: string
  rooms: string[]
  stats: DashboardStats
  bookings: DashboardBooking[]
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked in',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function useBookingDashboard() {
  const config = useRuntimeConfig()

  const base = (
    (config.public.apiBase as string) || ''
  ).replace(/\/+$/, '')

  // Initialize the cookie once.
  const token = useCookie<string | null>('token')

  const today = ref('')
  const rooms = ref<string[]>([])

  const stats = ref<DashboardStats>({
    arrivals_today: 0,
    departures_today: 0,
    pending: 0,
    occupancy_percent: 0,
  })

  const bookings = ref<DashboardBooking[]>([])

  const loading = ref(false)
  const updating = ref<number | null>(null)
  const error = ref('')
  const updateError = ref('')

  const headers = computed((): Record<string, string> => {
    return token.value
      ? { Authorization: `Token ${token.value}` }
      : {}
  })

  async function load() {
    loading.value = true
    error.value = ''

    try {
      const data = await $fetch<DashboardResponse>(
        `${base}/api/dashboard/bookings/`,
        { headers: headers.value }
      )

      today.value = data.today
      rooms.value = data.rooms
      stats.value = data.stats
      bookings.value = data.bookings

    } catch (e: any) {
      error.value =
        e?.data?.detail ||
        'Unable to load bookings. Please check your login and API server.'
    } finally {
      loading.value = false
    }
  }

  async function setStatus(
    id: number,
    status: BookingStatus
  ) {
    updating.value = id
    updateError.value = ''

    try {
      await $fetch<DashboardBooking>(
        `${base}/api/dashboard/bookings/${id}/status/`,
        {
          method: 'PATCH',
          body: { status },
          headers: headers.value,
        }
      )

      await load()

    } catch (e: any) {
      updateError.value =
        e?.data?.detail ||
        'Unable to update booking status.'

      throw e
    } finally {
      updating.value = null
    }
  }

  return {
    today,
    rooms,
    stats,
    bookings,
    loading,
    updating,
    error,
    updateError,
    load,
    setStatus,
  }
}
