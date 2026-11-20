// app/composables/useApi.ts
import type { BookingPayload } from '~/types/booking'
import type { Room } from '~/types/room'
import type { AsyncData, NuxtError, UseFetchOptions } from 'nuxt/app'
import type { FarmFeature } from '~/types/farm'
import type { HeroSection } from '~/types/hero'
import type { GalleryImage } from '~/types/gallery'

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type ListOrPaginated<T> = T[] | PaginatedResponse<T>

function unwrapList<T>(data: ListOrPaginated<T> | null | undefined): T[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  return Array.isArray(data.results) ? data.results : []
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const accessToken = useCookie<string | null>('access_token')
  const refreshToken = useCookie<string | null>('refresh_token')

  const baseURL = String(config.public.apiBase || 'http://127.0.0.1:8000/api').replace(/\/+$/, '')

  const client = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers)
      headers.set('Accept', 'application/json')

      // Do not force application/json when sending FormData so multipart boundary is preserved
      const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
      if (!isFormData && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }

      if (accessToken.value) {
        headers.set('Authorization', `Bearer ${accessToken.value}`)
      }

      options.headers = headers
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        accessToken.value = null
        refreshToken.value = null
        if (import.meta.client) {
          await navigateTo('/admin/login')
        }
      }
    },
  })

  const useApiFetch = <T>(
    url: string | (() => string),
    options: UseFetchOptions<T, T, any, T> = {}
  ): AsyncData<T, NuxtError | undefined> => {
    return useFetch<T>(url, {
      ...options,
      $fetch: client as any,
    } as any) as AsyncData<T, NuxtError | undefined>
  }
  const getPayments = (params?: { status?: string; method?: string }) => {
  return client('/payments/', { params })
}

const createPayment = (formData: FormData) => {
  return client('/payments/', {
    method: 'POST',
    body: formData,
  })
}

const verifyPayment = (id: number, status: 'paid' | 'failed' | 'refunded') => {
  return client(`/payments/${id}/verify/`, {
    method: 'POST',
    body: { status },
  })
}

  return {
    client,
    useApiFetch,
    getPayments,
    createPayment,
    verifyPayment,

    /* Experiences */
    async getExperiences(): Promise<Experience[]> {
      const res = await client<ListOrPaginated<Experience>>('/cms/experiences/')
      return unwrapList(res)
    },

    createExperience(formData: FormData): Promise<Experience> {
      return client<Experience>('/cms/experiences/', {
        method: 'POST',
        body: formData,
      })
    },

    updateExperience(id: number, formData: FormData): Promise<Experience> {
      return client<Experience>(`/cms/experiences/${id}/`, {
        method: 'PATCH',
        body: formData,
      })
    },

    deleteExperience(id: number): Promise<void> {
      return client<void>(`/cms/experiences/${id}/`, {
        method: 'DELETE',
      })
    },

    /* Farm Features */
    async getFarmFeatures(): Promise<FarmFeature[]> {
      const res = await client<ListOrPaginated<FarmFeature>>('/cms/farm/')
      return unwrapList(res)
    },

    createFarmFeature(formData: FormData): Promise<FarmFeature> {
      return client<FarmFeature>('/cms/farm/', {
        method: 'POST',
        body: formData,
      })
    },

    updateFarmFeature(id: number, formData: FormData): Promise<FarmFeature> {
      return client<FarmFeature>(`/cms/farm/${id}/`, {
        method: 'PATCH',
        body: formData,
      })
    },

    deleteFarmFeature(id: number): Promise<void> {
      return client<void>(`/cms/farm/${id}/`, {
        method: 'DELETE',
      })
    },

    /* Rooms / Accommodations */
    async getRooms(): Promise<Room[]> {
      const res = await client<ListOrPaginated<Room>>('/rooms/accommodations/')
      return unwrapList(res)
    },

    getRoom(slug: string): Promise<Room> {
      return client<Room>(`/rooms/${slug}/`)
    },

    createRoom(formData: FormData): Promise<Room> {
      return client<Room>('/rooms/accommodations/', {
        method: 'POST',
        body: formData,
      })
    },

    updateRoom(id: number, formData: FormData): Promise<Room> {
      return client<Room>(`/rooms/accommodations/${id}/`, {
        method: 'PATCH',
        body: formData,
      })
    },

    deleteRoom(id: number): Promise<void> {
      return client<void>(`/rooms/accommodations/${id}/`, {
        method: 'DELETE',
      })
    },

    /* Heroes */
    async getHeroes(): Promise<HeroSection[]> {
      const res = await client<ListOrPaginated<HeroSection>>('/website/heroes/')
      return unwrapList(res)
    },

    async getHeroByPage(page: string): Promise<HeroSection | null> {
      try {
        return await client<HeroSection>(`/website/heroes/page/${page}/`)
      } catch {
        const list = await client<ListOrPaginated<HeroSection>>('/website/heroes/', {
          query: { page },
        })
        const items = unwrapList(list)
        return items[0] ?? null
      }
    },

    createHero(formData: FormData): Promise<HeroSection> {
      return client<HeroSection>('/website/heroes/', {
        method: 'POST',
        body: formData,
      })
    },

    updateHero(id: number, formData: FormData): Promise<HeroSection> {
      return client<HeroSection>(`/website/heroes/${id}/`, {
        method: 'PATCH',
        body: formData,
      })
    },

    deleteHero(id: number): Promise<void> {
      return client<void>(`/website/heroes/${id}/`, {
        method: 'DELETE',
      })
    },

    /* Bookings */
    async getBookings() {
      const res = await client<ListOrPaginated<any>>('/bookings/')
      return unwrapList(res)
    },

    createBooking(payload: BookingPayload) {
      return client('/bookings/create/', {
        method: 'POST',
        body: payload,
      })
    },

    checkAvailability(roomId: number, checkIn: string, checkOut: string) {
      return client('/bookings/availability/', {
        method: 'GET',
        query: {
          accommodation_type_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
        },
      })
    },

    checkInBooking(id: number) {
      return client(`/bookings/${id}/check-in/`, {
        method: 'POST',
      })
    },

    checkOutBooking(id: number) {
      return client(`/bookings/${id}/check-out/`, {
        method: 'POST',
      })
    },

    /* Contact Inquiries */
    async getContacts() {
      const res = await client<ListOrPaginated<any>>('/cms/contacts/')
      return unwrapList(res)
    },

    submitContact(payload: Record<string, any>) {
      return client('/cms/contacts/', {
        method: 'POST',
        body: payload,
      })
    },

    updateContactStatus(id: number, status: string) {
      return client(`/cms/contacts/${id}/`, {
        method: 'PATCH',
        body: { status },
      })
    },

    deleteContact(id: number) {
      return client(`/cms/contacts/${id}/`, {
        method: 'DELETE',
      })
    },

    /* Restaurant */
    async getRestaurantItems() {
      const res = await client<ListOrPaginated<any>>('/cms/restaurant/')
      return unwrapList(res)
    },

    createRestaurantItem(formData: FormData) {
      return client('/cms/restaurant/', { method: 'POST', body: formData })
    },

    updateRestaurantItem(id: number, formData: FormData) {
      return client(`/cms/restaurant/${id}/`, { method: 'PATCH', body: formData })
    },

    deleteRestaurantItem(id: number) {
      return client(`/cms/restaurant/${id}/`, { method: 'DELETE' })
    },

    /* Offers */
    async getOffers() {
      const res = await client<ListOrPaginated<any>>('/cms/offers/')
      return unwrapList(res)
    },

    createOffer(formData: FormData) {
      return client('/cms/offers/', { method: 'POST', body: formData })
    },

    updateOffer(id: number, formData: FormData) {
      return client(`/cms/offers/${id}/`, { method: 'PATCH', body: formData })
    },

    deleteOffer(id: number) {
      return client(`/cms/offers/${id}/`, { method: 'DELETE' })
    },

    /* Events */
    async getEvents() {
      const res = await client<ListOrPaginated<any>>('/cms/events/')
      return unwrapList(res)
    },

    createEvent(formData: FormData) {
      return client('/cms/events/', { method: 'POST', body: formData })
    },

    updateEvent(id: number, formData: FormData) {
      return client(`/cms/events/${id}/`, { method: 'PATCH', body: formData })
    },

    deleteEvent(id: number) {
      return client(`/cms/events/${id}/`, { method: 'DELETE' })
    },

    /* Gallery */
    async getGallery(category?: string): Promise<GalleryImage[]> {
      const res = await client<ListOrPaginated<GalleryImage>>('/gallery/', {
        query: category ? { category } : undefined,
      })
      return unwrapList(res)
    },

    uploadGalleryImage(formData: FormData): Promise<GalleryImage> {
      return client<GalleryImage>('/gallery/', {
        method: 'POST',
        body: formData,
      })
    },

    updateGalleryImage(id: number, formData: FormData): Promise<GalleryImage> {
      return client<GalleryImage>(`/gallery/${id}/`, {
        method: 'PATCH',
        body: formData,
      })
    },

    deleteGalleryImage(id: number): Promise<void> {
      return client<void>(`/gallery/${id}/`, {
        method: 'DELETE',
      })
    },
    
  }
}