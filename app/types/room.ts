// app/types/room.ts
export interface RoomImage {
  id: number
  image: string
  caption: string
  order: number
}

export interface Room {
  id: number
  name: string
  slug: string
  description: string
  price_per_night: number | string
  total_rooms: number
  max_adults: number
  max_children: number
  size_sqm: number | null
  bed_type: string
  amenities: string[]
  cover_image: string | null
  images?: RoomImage[]
  is_active: boolean
  created_at?: string
  updated_at?: string
}