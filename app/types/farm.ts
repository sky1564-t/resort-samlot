// app/types/farm.ts
export interface FarmFeature {
  id: number
  title: string
  description: string
  image: string
  button_text: string
  button_link: string
  order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}