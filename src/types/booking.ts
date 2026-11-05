export interface Room {
  id: number
  name: string
  slug: string
  description: string
  price_per_night: string
  capacity: number
  image: string | null
}

export interface BookingForm {
  room: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  name: string
  email: string
  phone: string
  notes: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

export interface AvailabilityResponse {
  available: boolean
}