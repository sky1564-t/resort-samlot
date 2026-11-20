// app/types/booking.ts
export interface BookingPayload {
  accommodation_type_id?: number
  room?: string
  check_in: string
  check_out: string
  adults: number
  children: number
  first_name: string
  last_name: string
  email: string
  phone: string
  nationality?: string
  notes?: string
}

export interface Booking {
  id: number
  booking_code: string
  room_name?: string
  accommodation_type_name?: string
  guest_name?: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  nationality?: string
  check_in: string
  check_out: string
  nights?: number
  adults: number
  children: number
  total_amount: number | string
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  notes?: string
  created_at?: string
}