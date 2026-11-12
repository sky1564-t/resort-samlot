import type { BookingPayload } from '~/types/booking'

export const useCreateBooking = () => {
  const api = useApi()

  const createBooking = async (
    payload: BookingPayload
  ) => {
    return await api.createBooking(
      payload
    )
  }

  return {
    createBooking
  }
}