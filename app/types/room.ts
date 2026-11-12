export interface Amenity {
  id: number
  name: string
  icon: string
}

export interface RoomImage {
  id: number
  accommodation: number
  image: string
  is_featured: boolean
  created_at: string
}

export interface Room {
  id: number
  name: string
  slug: string
  category: string
  description: string
  max_guests: number
  base_price: number
  is_active: boolean
}

export interface RoomDetail extends Room {
  amenities: Amenity[]
  images: RoomImage[]
}