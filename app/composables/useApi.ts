import type { BookingPayload } from '~/types/booking'
import type { Room } from '~/types/room'

export const useApi = () => {
  const config = useRuntimeConfig()

  const client = $fetch.create({
    baseURL: config.public.apiBase,

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })

  return {
    /* Rooms */

    getRooms(): Promise<Room[]> {
      return client('/rooms/accommodations/')
    },

    getRoom(slug: string) {
      return client(`/rooms/${slug}/`)
    },

    /* Bookings */

    getBookings() {
      return client('/bookings/')
    },

    createBooking(
      payload: BookingPayload
    ) {
      return client(
        '/bookings/create/',
        {
          method: 'POST',
          body: payload
        }
      )
    },

    checkAvailability(
      roomId: number,
      checkIn: string,
      checkOut: string
    ) {
      return client(
        '/bookings/availability/',
        {
          method: 'GET',

          query: {
            accommodation_type_id: roomId,
            check_in: checkIn,
            check_out: checkOut
          }
        }
      )
    },

    checkInBooking(
      id: number
    ) {
      return client(
        `/bookings/${id}/check-in/`,
        {
          method: 'POST'
        }
      )
    },

    checkOutBooking(
      id: number
    ) {
      return client(
        `/bookings/${id}/check-out/`,
        {
          method: 'POST'
        }
      )
    },

    /* Dashboard */

    getDashboard() {
      return client('/dashboard/')
    },

    /* Guests */

    getGuests() {
      return client('/guests/')
    },

    /* CMS */

    getCms() {
      return client('/cms/')
    },

    /* Website */

    getWebsite() {
      return client('/website/')
    },

    /* Notifications */

    getNotifications() {
      return client('/notifications/')
    }
  }
}