import type {
  BookingPayload,
  RoomOption
} from '~/types/booking'

export const useBooking = () => {
  const api = useApi()
  const route = useRoute()

  const reset = () => {
    status.value = 'idle'
    serverError.value = ''
    bookingCode.value = ''
  }
  const selectedRoomId = computed(() => {
    const id = Number(route.query.room)

    return Number.isNaN(id)
      ? null
      : id
  })

  const today = new Date()
    .toISOString()
    .split('T')[0]

  const form = reactive({
    room: '',
    roomId: null as number | null,

    checkIn:
      (route.query.check_in as string) || '',

    checkOut:
      (route.query.check_out as string) || '',

    adults:
      Number(route.query.adults) || 2,

    children:
      Number(route.query.children) || 0,

    firstName: '',
    lastName: '',

    email: '',
    phone: '',

    nationality: '',

    notes: ''
  })

  const rooms = ref<RoomOption[]>([])

  const status = ref<
    'idle' |
    'sending' |
    'sent' |
    'error'
  >('idle')

  const serverError = ref('')

  const bookingCode = ref('')

  const available = ref<boolean | null>(null)

  const errors = reactive({
    room: '',
    checkIn: '',
    checkOut: '',
    adults: '',
    firstName: '',
    lastName: '',
    email: ''
  })

  onMounted(async () => {
    try {
      const data: any =
        await api.getRooms()

      const list = Array.isArray(data)
        ? data
        : data?.results || []

      rooms.value = list.map(
        (room: any) => ({
          id: room.id,

          name: room.name,

          price_per_night: Number(
            room.base_price
          ),

          capacity: Number(
            room.max_guests
          )
        })
      )

      if (selectedRoomId.value) {
        const selectedRoom =
          rooms.value.find(
            room =>
              room.id === selectedRoomId.value
          )

        if (selectedRoom) {
          form.room =
            selectedRoom.name

          form.roomId =
            selectedRoom.id
        }
      } else {
        const firstRoom =
          rooms.value[0]

        if (firstRoom) {
          form.room =
            firstRoom.name

          form.roomId =
            firstRoom.id
        }
      }
    } catch (error) {
      console.error(
        'Failed to load rooms:',
        error
      )

      rooms.value = []
    }
  })

  watch(
    () => form.room,
    () => {
      const selected =
        rooms.value.find(
          room =>
            room.name === form.room
        )

      form.roomId =
        selected?.id || null
    }
  )

  const nights = computed(() => {
    if (
      !form.checkIn ||
      !form.checkOut
    ) {
      return 0
    }

    const start =
      new Date(form.checkIn)

    const end =
      new Date(form.checkOut)

    const diff =
      Math.ceil(
        (end.getTime() -
          start.getTime()) /
        (1000 * 60 * 60 * 24)
      )

    return diff > 0
      ? diff
      : 0
  })

  const selectedRoom = computed(() =>
    rooms.value.find(
      room =>
        room.name === form.room
    )
  )

  const rate = computed(
    () =>
      selectedRoom.value
        ?.price_per_night || 0
  )

  const total = computed(
    () =>
      nights.value * rate.value
  )

  watch(
    () => [
      form.roomId,
      form.checkIn,
      form.checkOut
    ],
    async () => {
      if (
        !form.roomId ||
        !form.checkIn ||
        !form.checkOut
      ) {
        available.value = null
        return
      }

      try {
        const response: any =
          await api.checkAvailability(
            form.roomId,
            form.checkIn,
            form.checkOut
          )

        available.value =
          Number(
            response?.available
          ) > 0

      } catch {
        available.value = null
      }
    }
  )

  const validate = () => {
    errors.room = ''
    errors.checkIn = ''
    errors.checkOut = ''
    errors.adults = ''
    errors.firstName = ''
    errors.lastName = ''
    errors.email = ''

    let hasError = false

    if (!form.room) {
      errors.room =
        'Please select a room'

      hasError = true
    }

    if (!form.checkIn) {
      errors.checkIn =
        'Please select check-in date'

      hasError = true
    }

    if (!form.checkOut) {
      errors.checkOut =
        'Please select check-out date'

      hasError = true
    }

    if (!form.firstName.trim()) {
      errors.firstName =
        'First name is required'

      hasError = true
    }

    if (!form.lastName.trim()) {
      errors.lastName =
        'Last name is required'

      hasError = true
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (
      !emailRegex.test(
        form.email
      )
    ) {
      errors.email =
        'Please enter a valid email'

      hasError = true
    }

    return !hasError
  }

  const submit = async () => {
    if (!validate()) {
      return
    }

    if (!form.roomId) {
      serverError.value =
        'Please select a room.'

      return
    }

    const payload: BookingPayload = {
      room_id:
        form.roomId,

      check_in:
        form.checkIn,

      check_out:
        form.checkOut,

      adults:
        form.adults,

      children:
        form.children,

      guest: {
        first_name:
          form.firstName,

        last_name:
          form.lastName,

        email:
          form.email,

        phone:
          form.phone,

        nationality:
          form.nationality
      }
    }

    try {
      status.value = 'sending'
      serverError.value = ''

      const response: any =
        await api.createBooking(
          payload
        )

      bookingCode.value =
        response?.booking_code || ''

      status.value = 'sent'

    } catch (err: any) {
      console.error(err)

      status.value = 'error'

      serverError.value =
        err?.data?.detail ||
        err?.data?.message ||
        err?.message ||
        'Unable to submit booking request.'
    }
  }

  return {
    form,
    rooms,

    errors,

    status,
    serverError,

    available,

    bookingCode,

    today,

    nights,
    rate,
    total,
    reset,

    submit
  }
}