import type { AvailabilityResponse, BookingForm, BookingStatus, Room } from '~/types/booking'

// Field names the Django API can send errors for
const FIELD_KEYS = ['room', 'checkIn', 'checkOut', 'adults', 'name', 'email']

export function useBooking() {
  // Rooms come from Django: GET /api/rooms
  const { data: rooms } = useFetch<Room[]>('/api/rooms', { default: () => [] })

  const form = reactive<BookingForm>({
    room: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Pick the first room once the list has loaded
  watchEffect(() => {
    const first = rooms.value?.[0]
    if (!form.room && first) form.room = first.name
  })

  const errors = reactive<Record<string, string>>({})
  const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const serverError = ref('')
  const available = ref<boolean | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const nights = computed(() => {
    if (!form.checkIn || !form.checkOut) return 0
    const diff = (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
    return diff > 0 ? Math.round(diff) : 0
  })
  const selectedRoom = computed(() => rooms.value?.find(r => r.name === form.room))
  const rate = computed(() => Number(selectedRoom.value?.price_per_night ?? 0))
  const total = computed(() => nights.value * rate.value)

  // Ask Django whether the room is free: GET /api/availability
  watch(() => [form.room, form.checkIn, form.checkOut], async () => {
    available.value = null
    if (!form.room || nights.value < 1) return
    try {
      const res = await $fetch<AvailabilityResponse>('/api/availability', {
        query: { room: form.room, checkIn: form.checkIn, checkOut: form.checkOut },
      })
      available.value = res.available
    } catch {
      available.value = null
    }
  })

  function validate(): boolean {
    errors.room = form.room ? '' : 'Choose a room.'
    errors.checkIn = form.checkIn ? '' : 'Choose a check-in date.'
    errors.checkOut = nights.value > 0 ? '' : 'Check-out must be after check-in.'
    errors.name = form.name.trim() ? '' : 'Enter your full name.'
    errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email address.'
    errors.adults = ''
    if (available.value === false) errors.checkIn = 'These dates are not available for this room.'
    return !Object.values(errors).some(Boolean)
  }

  // Send the booking: POST /api/booking
  async function submit() {
    if (!validate()) return
    status.value = 'sending'
    serverError.value = ''
    try {
      await $fetch('/api/booking', { method: 'POST', body: { ...form } })
      status.value = 'sent'
    } catch (e) {
      // Django (DRF) answers with { field: ["message"] } for invalid data
      const err = e as { data?: Record<string, unknown>; statusCode?: number }
      for (const [key, val] of Object.entries(err.data ?? {})) {
        const msg = Array.isArray(val) ? String(val[0]) : String(val)
        if (FIELD_KEYS.includes(key)) errors[key] = msg
        else serverError.value = msg
      }
      if (err.statusCode === 429) serverError.value = 'Too many requests. Please try again later.'
      status.value = 'error'
    }
  }

  return { form, rooms, errors, status, serverError, available, today, nights, rate, total, submit }
}