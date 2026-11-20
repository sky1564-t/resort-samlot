// app/types/gallery.ts
export interface GalleryImage {
  id: number
  title: string
  category: 'food' | 'rooms' | 'nature' | 'pool' | 'events'
  category_label?: string
  image: string
  order: number
  is_active: boolean
  created_at?: string
}