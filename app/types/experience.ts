// app/types/experience.ts
export interface Experience {
  id: number
  title: string
  description: string
  image: string
  order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}