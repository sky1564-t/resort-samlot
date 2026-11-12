export interface GuestPayload {
  first_name: string
  last_name: string
  email: string
  phone: string
  nationality?: string
}

export interface BookingPayload {
  room_id: number
  check_in: string
  check_out: string
  adults: number
  children: number
  guest: GuestPayload
}

export interface AvailabilityPayload {
  accommodation_type_id: number
  check_in: string
  check_out: string
}

export interface RoomOption {
  id: number
  name: string
  price_per_night: number
  capacity: number
}

export interface BookingForm {
  room: string
  roomId: number | null

  checkIn: string
  checkOut: string

  adults: number
  children: number

  firstName: string
  lastName: string

  email: string
  phone: string
  nationality: string

  notes: string
}

export interface BookingErrors {
  room: string
  checkIn: string
  checkOut: string
  adults: string
  firstName: string
  lastName: string
  email: string
}