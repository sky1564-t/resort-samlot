import type { Room } from '~/types/room'

export const useRooms = () => {
  const api = useApi()

  const availability = ref<{
    available: number
    units: string[]
  } | null>(null)

  const availabilityStatus = ref<
    | 'idle'
    | 'checking'
    | 'available'
    | 'unavailable'
    | 'error'
  >('idle')

  const getRooms = async () => {
    return await api.getRooms() as Room[]
  }

  const checkAvailability = async (
    roomId: number,
    checkIn: string,
    checkOut: string
  ) => {
    try {
      availabilityStatus.value =
        'checking'

      const response: any =
        await api.checkAvailability(
          roomId,
          checkIn,
          checkOut
        )

      availability.value =
        response

      availabilityStatus.value =
        Number(response?.available) > 0
          ? 'available'
          : 'unavailable'

      return response

    } catch (error) {
      console.error(error)

      availabilityStatus.value =
        'error'

      throw error
    }
  }

  const resetAvailability = () => {
    availability.value = null

    availabilityStatus.value =
      'idle'
  }

  return {
    availability,
    availabilityStatus,

    getRooms,

    checkAvailability,
    resetAvailability
  }
}