export interface HeroSection {
  id: number
  page: string
  page_label: string
  eyebrow: string
  title: string
  subtitle: string
  description: string
  background_image: string | null
  cta_text: string
  cta_link: string
  is_active: boolean
  updated_at?: string
}