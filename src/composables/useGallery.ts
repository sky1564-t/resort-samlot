import type { MediaItem } from '~/types/gallery'

interface GalleryApiItem {
    id: number
    title: string
    image: string
}

// Shown when the Django gallery is empty or the backend is offline.
// Files live in public/picture (all lowercase .jpg).
const FALLBACK = [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]

export function useMedia() {
    // Photos come from Django: GET /api/gallery
    const { data, status } = useFetch<GalleryApiItem[]>('/api/gallery', { default: () => [] })

    const items = computed<MediaItem[]>(() => {
        if (data.value?.length) {
            return data.value.map(g => ({ id: g.id, src: g.image, alt: g.title || 'Samlot Diamond Resort' }))
        }
        return FALLBACK.map(n => ({ id: n, src: `/picture/${n}.jpg`, alt: `Samlot Diamond Resort photo ${n}` }))
    })

    return { items, loading: computed(() => status.value === 'pending') }
}