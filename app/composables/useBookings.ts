// app/composables/useBooking.ts
import type { Room } from '~/types/room'
import type { Booking, BookingPayload } from '~/types/booking'

export const useBooking = () => {
  const route = useRoute()
  const { getRooms, checkAvailability, createBooking } = useApi()

  const { data: rooms } = useAsyncData<Room[]>(
    'booking-rooms',
    () => getRooms(),
    { default: () => [] }
  )

  const form = reactive({
    room: (route.query.room as string) || '',
    checkIn: (route.query.checkIn as string) || '',
    checkOut: (route.query.checkOut as string) || '',
    adults: 2,
    children: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    notes: ''
  })

  // Pre-fill guests if passed from the Rooms page widget
  if (route.query.guests === '1 Adult') {
    form.adults = 1
    form.children = 0
  } else if (route.query.guests === 'Family (2A + 2C)') {
    form.adults = 2
    form.children = 2
  }

  const errors = reactive<Record<string, string>>({})
  const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const serverError = ref('')
  const available = ref<boolean | null>(null)
  const bookingCode = ref('')

  const selectedRoom = computed(() =>
    rooms.value.find((r) => r.name === form.room) || null
  )

  const nights = computed(() => {
    if (!form.checkIn || !form.checkOut) return 0
    const start = new Date(form.checkIn)
    const end = new Date(form.checkOut)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  })

  const rate = computed(() => {
    return selectedRoom.value ? Number(selectedRoom.value.price_per_night) : 0
  })

  const total = computed(() => {
    return nights.value * rate.value
  })

  // Live availability check whenever room or dates change
  watch(
    () => [selectedRoom.value?.id, form.checkIn, form.checkOut],
    async ([roomId, checkIn, checkOut]) => {
      available.value = null
      if (!roomId || !checkIn || !checkOut || nights.value <= 0) return

      try {
        const res: any = await checkAvailability(Number(roomId), String(checkIn), String(checkOut))
        available.value = Boolean(res?.available)
      } catch {
        available.value = null
      }
    }
  )

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])

    if (!form.room || !selectedRoom.value) {
      errors.room = 'Please select a room.'
    }
    if (!form.checkIn) {
      errors.checkIn = 'Please select a check-in date.'
    }
    if (!form.checkOut) {
      errors.checkOut = 'Please select a check-out date.'
    } else if (form.checkIn && nights.value <= 0) {
      errors.checkOut = 'Check-out must be after check-in.'
    }
    if (!form.firstName.trim()) {
      errors.firstName = 'First name is required.'
    }
    if (!form.lastName.trim()) {
      errors.lastName = 'Last name is required.'
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required.'
    }
    if (available.value === false) {
      errors.room = 'This room is not available for the selected dates.'
    }

    return Object.keys(errors).length === 0
  }

  const submit = async () => {
    serverError.value = ''
    if (!validate() || !selectedRoom.value) return

    status.value = 'sending'
    try {
      const payload: BookingPayload = {
        accommodation_type_id: selectedRoom.value.id,
        check_in: form.checkIn,
        check_out: form.checkOut,
        adults: form.adults,
        children: form.children,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        nationality: form.nationality.trim(),
        notes: form.notes.trim()
      }

      const res = (await createBooking(payload)) as Booking
      bookingCode.value = res.booking_code
      status.value = 'sent'
    } catch (err: any) {
      serverError.value =
        err?.data?.detail ||
        err?.data?.check_out?.[0] ||
        'Unable to submit your reservation. Please try again.'
      status.value = 'error'
    }
  }

  const reset = () => {
    status.value = 'idle'
    serverError.value = ''
    bookingCode.value = ''
    available.value = null
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  return {
    form,
    rooms,
    errors,
    status,
    serverError,
    available,
    nights,
    rate,
    total,
    bookingCode,
    reset,
    submit
  }
}