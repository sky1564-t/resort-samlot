<!-- app/pages/admin/gallery/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: 'Gallery',
})

useHead({
  title: 'Gallery Admin | Samlot Diamond Resort',
})

interface PreviewMediaItem {
  id?: string | number
  title: string
  type: 'image' | 'video'
  src: string
  category?: string
  fileName?: string
  fileSize?: string
  addedAt?: string
  source?: 'api' | 'local' | 'r2'
}

interface AdminGalleryRecord extends PreviewMediaItem {
  id: string | number
  title: string
  type: 'image' | 'video'
  src: string
  category: string
  addedAt: string
  source: 'api' | 'local' | 'r2'
}

const R2_BASE = 'https://pub-0c542abde828459785e3d8da1a74270d.r2.dev'
const HISTORY_STORAGE_KEY = 'samlot_diamond_gallery_history_v2'

// Show 4 rows on desktop (4 cols -> 16 items) or 5 rows on larger screens, toggleable via "See More"
const INITIAL_VISIBLE_ROWS = 4
const showAllMedia = ref<boolean>(false)
const viewportWidth = ref<number>(1280)

const updateViewportWidth = () => {
  if (import.meta.client) {
    viewportWidth.value = window.innerWidth
  }
}

const gridColumnsCount = computed(() => {
  if (viewportWidth.value >= 1280) return 4
  if (viewportWidth.value >= 640) return 2
  return 1
})

const initialMediaLimit = computed(() => INITIAL_VISIBLE_ROWS * gridColumnsCount.value)

const normalizeMediaUrl = (raw: unknown): string => {
  if (!raw || typeof raw !== 'string') return ''
  let url = raw.trim()
  while (url.startsWith('https://https://')) {
    url = url.replace('https://https://', 'https://')
  }
  while (url.startsWith('http://https://')) {
    url = url.replace('http://https://', 'https://')
  }
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  return `${R2_BASE}/${url.replace(/^\/+/, '')}`
}

const detectMediaType = (urlOrName: string, explicitType?: unknown, mimeType?: string): 'image' | 'video' => {
  if (mimeType?.startsWith('video/')) return 'video'
  if (explicitType === 'video' || explicitType === 'mp4' || explicitType === 'mov') return 'video'
  return /\.(mp4|mov|m4v|webm|ogg)(\?.*)?$/i.test(urlOrName) ? 'video' : 'image'
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const val = bytes / Math.pow(1024, idx)
  return `${val.toFixed(val >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`
}

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const buildCloudflareSeedMedia = (): AdminGalleryRecord[] => {
  const featured: Array<{ type: 'image' | 'video'; path: string; title: string; category: string }> = [
    { type: 'image', path: 'image/f1.jpg', title: 'Tropical Paradise', category: 'Resort' },
    { type: 'video', path: 'video/v2.mp4', title: 'Resort Walkthrough', category: 'Videos' },
    { type: 'video', path: 'video/v3.mp4', title: 'Ocean Views', category: 'Videos' },
    { type: 'image', path: 'image/f4.jpg', title: 'Luxury Villa', category: 'Villas' },
    { type: 'image', path: 'image/f8.jpg', title: 'Evening Dining', category: 'Dining' },
    { type: 'image', path: 'image/f13.jpg', title: 'Poolside View', category: 'Resort' },
    { type: 'video', path: 'video/v4.mp4', title: 'Spa Experience', category: 'Videos' },
    { type: 'image', path: 'image/f14.jpg', title: 'Interior Suite', category: 'Villas' },
    { type: 'image', path: 'image/f15.jpg', title: 'Spa & Wellness', category: 'Wellness' },
    { type: 'image', path: 'image/f17.jpg', title: 'Garden Walkway', category: 'Nature' },
    { type: 'video', path: 'video/v5.mp4', title: 'Resort Activities', category: 'Videos' },
    { type: 'video', path: 'video/v6.mp4', title: 'Garden Walkthrough 6', category: 'Videos' },
    { type: 'video', path: 'video/v7.mp4', title: 'Garden Walkthrough 7', category: 'Videos' },
    { type: 'video', path: 'video/v8.mp4', title: 'Garden Walkthrough 8', category: 'Videos' },
    { type: 'video', path: 'video/v9.mp4', title: 'Garden Walkthrough 9', category: 'Videos' },
  ]

  const list: AdminGalleryRecord[] = featured.map((item, index) => ({
    id: `r2-seed-${index}`,
    title: item.title,
    type: item.type,
    category: item.category,
    src: `${R2_BASE}/${item.path}`,
    addedAt: '2026-11-19T12:00:00.000Z',
    source: 'r2',
  }))

  for (let i = 1; i <= 35; i++) {
    list.push({
      id: `r2-view-${i}`,
      title: `Resort View ${i}`,
      type: 'image',
      category: 'Resort',
      src: `${R2_BASE}/image/${i}.jpg`,
      addedAt: '2026-11-19T12:00:00.000Z',
      source: 'r2',
    })
  }

  return list
}

const seedMedia = buildCloudflareSeedMedia()
const apiMedia = ref<AdminGalleryRecord[]>([])
const addHistory = ref<AdminGalleryRecord[]>([])
const activeFilter = ref<'all' | 'image' | 'video'>('all')
const isLoading = ref<boolean>(true)
const isSubmitting = ref<boolean>(false)
const statusBanner = ref<{ tone: 'success' | 'warning'; message: string } | null>(null)
const previewTarget = ref<PreviewMediaItem | null>(null)

// Multi-file & repeated add form state
const titlePrefix = ref<string>('')
const selectedKind = ref<'image' | 'video' | 'auto'>('auto')
const categoryName = ref<string>('Resort')
const queuedFiles = ref<Array<{ file: File; previewUrl: string; type: 'image' | 'video' }>>([])
const fileInputEl = ref<HTMLInputElement | null>(null)

const loadSavedHistory = () => {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      addHistory.value = parsed.map((entry: any) => ({
        ...entry,
        src: normalizeMediaUrl(entry?.src),
      }))
    }
  } catch {
    // Ignore malformed localStorage data
  }
}

const persistHistory = () => {
  if (!import.meta.client) return
  try {
    const clean = addHistory.value.map((entry) => ({
      ...entry,
      src: entry.src?.startsWith('blob:') ? '' : entry.src,
    }))
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(clean))
  } catch {
    // Ignore storage quota issues
  }
}

const pushToHistory = (record: AdminGalleryRecord) => {
  addHistory.value = [record, ...addHistory.value.filter((item) => item.id !== record.id)]
  persistHistory()
}

const removeFromHistory = (id: string | number) => {
  addHistory.value = addHistory.value.filter((item) => item.id !== id)
  persistHistory()
}

const clearHistory = () => {
  addHistory.value = []
  persistHistory()
}

const handleFilesPicked = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length === 0) return

  const added = files.map((file) => {
    const inferredType =
      selectedKind.value === 'auto'
        ? detectMediaType(file.name, undefined, file.type)
        : selectedKind.value
    return {
      file,
      previewUrl: URL.createObjectURL(file),
      type: inferredType,
    }
  })

  // Append newly picked files so user can add more images/videos in batches
  queuedFiles.value = [...queuedFiles.value, ...added]

  if (fileInputEl.value) {
    fileInputEl.value.value = ''
  }
}

const removeQueuedFile = (index: number) => {
  const target = queuedFiles.value[index]
  if (target?.previewUrl?.startsWith('blob:')) {
    URL.revokeObjectURL(target.previewUrl)
  }
  queuedFiles.value = queuedFiles.value.filter((_, idx) => idx !== index)
}

const clearQueuedFiles = () => {
  queuedFiles.value.forEach((q) => {
    if (q.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(q.previewUrl)
    }
  })
  queuedFiles.value = []
  titlePrefix.value = ''
  if (fileInputEl.value) {
    fileInputEl.value.value = ''
  }
}

const loadApiItems = async () => {
  isLoading.value = true
  try {
    const { getGallery } = useApi()
    const rows = await getGallery()
    if (Array.isArray(rows)) {
      apiMedia.value = rows
        .map((row: any, idx: number): AdminGalleryRecord | null => {
          const rawSrc = row?.image || row?.file || row?.url || row?.src || row?.media_url || ''
          const src = normalizeMediaUrl(rawSrc)
          if (!src) return null
          const type = detectMediaType(src, row?.type || row?.media_type)
          return {
            id: row?.id ?? `api-${idx}`,
            title: row?.title || row?.caption || `Gallery Media ${idx + 1}`,
            type,
            category: row?.category || (type === 'video' ? 'Videos' : 'Resort'),
            src,
            addedAt: row?.created_at || row?.uploaded_at || new Date().toISOString(),
            source: 'api',
          }
        })
        .filter((x): x is AdminGalleryRecord => x !== null)
    }
  } catch {
    // Keep seed/history items active when backend is offline
  } finally {
    isLoading.value = false
  }
}

const handleAddQueuedMedia = async () => {
  statusBanner.value = null

  if (queuedFiles.value.length === 0) {
    statusBanner.value = {
      tone: 'warning',
      message: 'Please choose one or more image or video files first.',
    }
    return
  }

  isSubmitting.value = true
  const { uploadGalleryImage } = useApi()
  let successCount = 0
  let fallbackCount = 0

  for (let i = 0; i < queuedFiles.value.length; i++) {
    const entry = queuedFiles.value[i]
    if (!entry) continue
    const file = entry.file
    const mediaType =
      selectedKind.value === 'auto' ? entry.type : selectedKind.value
    const baseTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
    const itemTitle = titlePrefix.value.trim()
      ? queuedFiles.value.length > 1
        ? `${titlePrefix.value.trim()} ${i + 1}`
        : titlePrefix.value.trim()
      : baseTitle || `Resort ${mediaType} ${i + 1}`
    const itemCategory = categoryName.value.trim() || (mediaType === 'video' ? 'Videos' : 'Resort')
    const nowIso = new Date().toISOString()

    try {
      const formData = new FormData()
      formData.append('title', itemTitle)
      formData.append('category', itemCategory)
      formData.append('type', mediaType)
      formData.append('media_type', mediaType)
      formData.append('image', file)
      formData.append('file', file)

      const created: any = await uploadGalleryImage(formData)
      const returnedUrl = normalizeMediaUrl(
        created?.image || created?.file || created?.url || created?.src || created?.media_url || ''
      )
      const resolvedSrc = returnedUrl || entry.previewUrl

      const record: AdminGalleryRecord = {
        id: created?.id ?? `api-added-${Date.now()}-${i}`,
        title: created?.title || itemTitle,
        type: detectMediaType(resolvedSrc || file.name, created?.type || created?.media_type || mediaType, file.type),
        category: created?.category || itemCategory,
        src: resolvedSrc,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        addedAt: created?.created_at || nowIso,
        source: 'api',
      }

      if (record.src && !record.src.startsWith('blob:')) {
        apiMedia.value = [record, ...apiMedia.value]
      }
      pushToHistory(record)
      successCount += 1
    } catch {
      const localRecord: AdminGalleryRecord = {
        id: `local-added-${Date.now()}-${i}`,
        title: itemTitle,
        type: mediaType,
        category: itemCategory,
        src: entry.previewUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        addedAt: nowIso,
        source: 'local',
      }
      pushToHistory(localRecord)
      fallbackCount += 1
    }
  }

  isSubmitting.value = false

  if (successCount > 0 && fallbackCount === 0) {
    statusBanner.value = {
      tone: 'success',
      message: `Added ${successCount} media item(s) and recorded all of them in Add History.`,
    }
  } else {
    statusBanner.value = {
      tone: 'warning',
      message: `Added ${successCount + fallbackCount} item(s) to Add History (${successCount} saved to API, ${fallbackCount} kept in local preview/history).`,
    }
  }

  clearQueuedFiles()
  await loadApiItems()
}

const allLibraryItems = computed<AdminGalleryRecord[]>(() => {
  const activeHistoryWithPreview = addHistory.value.filter((item) => Boolean(item.src))
  const combined = [...activeHistoryWithPreview, ...apiMedia.value, ...seedMedia]
  const seen = new Set<string>()
  return combined.filter((item) => {
    const key = `${item.type}:${item.src}`
    if (!item.src || seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const filteredLibraryItems = computed<AdminGalleryRecord[]>(() => {
  if (activeFilter.value === 'all') return allLibraryItems.value
  return allLibraryItems.value.filter((item) => item.type === activeFilter.value)
})

const hasMoreRows = computed(() => filteredLibraryItems.value.length > initialMediaLimit.value)

const displayedLibraryItems = computed<AdminGalleryRecord[]>(() => {
  if (showAllMedia.value || !hasMoreRows.value) {
    return filteredLibraryItems.value
  }
  return filteredLibraryItems.value.slice(0, initialMediaLimit.value)
})

watch(activeFilter, () => {
  showAllMedia.value = false
})

const totalImages = computed(() => allLibraryItems.value.filter((x) => x.type === 'image').length)
const totalVideos = computed(() => allLibraryItems.value.filter((x) => x.type === 'video').length)

onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
  loadSavedHistory()
  loadApiItems()
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', updateViewportWidth)
  }
  queuedFiles.value.forEach((q) => {
    if (q.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(q.previewUrl)
    }
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Add More Images & Videos Panel -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">Add Images &amp; Videos</h2>
            <p class="text-xs text-slate-500">
              Select one or multiple images and videos at once, or add more batches anytime. Every addition is saved to history.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
            Images: {{ totalImages }}
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/70 font-medium">
            Videos: {{ totalVideos }}
          </span>
          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200/70 font-medium">
            History: {{ addHistory.length }}
          </span>
        </div>
      </div>

      <!-- Status Banner -->
      <div
        v-if="statusBanner"
        :class="[
          'mt-4 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 border',
          statusBanner.tone === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : 'bg-amber-50 text-amber-950 border-amber-200',
        ]"
      >
        <span>{{ statusBanner.message }}</span>
        <button
          type="button"
          aria-label="Close message"
          @click="statusBanner = null"
          class="p-1 rounded hover:bg-black/5 cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleAddQueuedMedia" class="mt-5 space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Type Mode -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Media Type Mode
            </label>
            <div class="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                @click="selectedKind = 'auto'"
                :class="[
                  'py-2 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  selectedKind === 'auto' ? 'bg-emerald-950 text-amber-300' : 'text-slate-600 hover:text-slate-900',
                ]"
              >
                Auto
              </button>
              <button
                type="button"
                @click="selectedKind = 'image'"
                :class="[
                  'py-2 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  selectedKind === 'image' ? 'bg-emerald-950 text-amber-300' : 'text-slate-600 hover:text-slate-900',
                ]"
              >
                Image
              </button>
              <button
                type="button"
                @click="selectedKind = 'video'"
                :class="[
                  'py-2 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer',
                  selectedKind === 'video' ? 'bg-emerald-950 text-amber-300' : 'text-slate-600 hover:text-slate-900',
                ]"
              >
                Video
              </button>
            </div>
          </div>

          <!-- Category -->
          <div>
            <label for="admin-gallery-category" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Category
            </label>
            <input
              id="admin-gallery-category"
              v-model="categoryName"
              type="text"
              placeholder="Resort, Villas, Dining, Videos"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <!-- Title / Batch Prefix -->
          <div>
            <label for="admin-gallery-title" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Title (Optional)
            </label>
            <input
              id="admin-gallery-title"
              v-model="titlePrefix"
              type="text"
              placeholder="Defaults to file name if blank"
              class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-700"
            />
          </div>
        </div>

        <!-- File Picker + Add More Queue -->
        <div class="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-emerald-800 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div>
                <p class="text-sm font-medium text-slate-800">
                  Choose images or videos ({{ queuedFiles.length }} queued)
                </p>
                <p class="text-xs text-slate-500">
                  Supports JPG, PNG, WebP, MP4, MOV, and WebM. Pick again to add more files to the queue.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input
                ref="fileInputEl"
                type="file"
                multiple
                accept="image/*,video/*"
                @change="handleFilesPicked"
                class="hidden"
              />
              <button
                type="button"
                @click="fileInputEl?.click()"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Select Files</span>
              </button>

              <button
                type="submit"
                :disabled="isSubmitting || queuedFiles.length === 0"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-emerald-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>{{ isSubmitting ? 'Saving...' : `Add ${queuedFiles.length || ''} to Gallery` }}</span>
              </button>
            </div>
          </div>

          <!-- Queued Files Strip -->
          <div v-if="queuedFiles.length > 0" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
            <div
              v-for="(q, idx) in queuedFiles"
              :key="q.previewUrl"
              class="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video group"
            >
              <video
                v-if="q.type === 'video'"
                :src="q.previewUrl"
                class="w-full h-full object-cover"
                muted
                playsinline
                preload="metadata"
              />
              <img
                v-else
                :src="q.previewUrl"
                :alt="q.file.name"
                class="w-full h-full object-cover"
              />
              <span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-amber-300 uppercase">
                {{ q.type }}
              </span>
              <button
                type="button"
                aria-label="Remove queued file"
                @click="removeQueuedFile(idx)"
                class="absolute top-1.5 right-1.5 p-1 rounded bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>

    <!-- Add History Table -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <svg class="w-5 h-5 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-slate-900">Add History</h2>
            <p class="text-xs text-slate-500">Every image and video added in this admin panel is logged here.</p>
          </div>
        </div>

        <button
          v-if="addHistory.length > 0"
          type="button"
          @click="clearHistory"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/70 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          <span>Clear History</span>
        </button>
      </div>

      <div v-if="addHistory.length === 0" class="py-8 text-center text-sm text-slate-500">
        No additions recorded yet. Add images or videos above to see their full history.
      </div>

      <div v-else class="overflow-x-auto mt-4">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <th class="py-2.5 pr-4">Title</th>
              <th class="py-2.5 px-3">Type</th>
              <th class="py-2.5 px-3">Category</th>
              <th class="py-2.5 px-3">File / Size</th>
              <th class="py-2.5 px-3">Status</th>
              <th class="py-2.5 px-3">Added At</th>
              <th class="py-2.5 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="entry in addHistory" :key="entry.id" class="hover:bg-slate-50/80">
              <td class="py-3 pr-4 font-medium text-slate-900 truncate max-w-[220px]">{{ entry.title }}</td>
              <td class="py-3 px-3">
                <span
                  :class="[
                    'inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize',
                    entry.type === 'video' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900',
                  ]"
                >
                  {{ entry.type }}
                </span>
              </td>
              <td class="py-3 px-3 text-slate-600">{{ entry.category }}</td>
              <td class="py-3 px-3 text-xs text-slate-500">
                <div>{{ entry.fileName || '—' }}</div>
                <div class="text-slate-400">{{ entry.fileSize || '' }}</div>
              </td>
              <td class="py-3 px-3">
                <span
                  :class="[
                    'inline-block px-2 py-0.5 rounded text-xs font-medium',
                    entry.source === 'api'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200',
                  ]"
                >
                  {{ entry.source === 'api' ? 'API Saved' : 'Local Session' }}
                </span>
              </td>
              <td class="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">{{ formatTimestamp(entry.addedAt) }}</td>
              <td class="py-3 pl-3 text-right whitespace-nowrap">
                <div class="inline-flex items-center gap-2.5">
                  <button
                    v-if="entry.src"
                    type="button"
                    @click="previewTarget = entry"
                    class="text-xs font-medium text-emerald-800 hover:underline cursor-pointer"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    @click="removeFromHistory(entry.id)"
                    class="text-xs font-medium text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Gallery Media Grid with "See More" After 4-5 Rows -->
    <section class="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-base sm:text-lg font-semibold text-slate-900">Gallery Library</h2>
          <p class="text-xs text-slate-500">
            Showing {{ displayedLibraryItems.length }} of {{ filteredLibraryItems.length }} items
            ({{ INITIAL_VISIBLE_ROWS }} rows initially).
          </p>
        </div>

        <div class="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
          <button
            type="button"
            @click="activeFilter = 'all'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeFilter === 'all' ? 'bg-emerald-950 text-amber-300' : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            All ({{ allLibraryItems.length }})
          </button>
          <button
            type="button"
            @click="activeFilter = 'image'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeFilter === 'image' ? 'bg-emerald-950 text-amber-300' : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            Images ({{ totalImages }})
          </button>
          <button
            type="button"
            @click="activeFilter = 'video'"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeFilter === 'video' ? 'bg-emerald-950 text-amber-300' : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            Videos ({{ totalVideos }})
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        <div v-for="n in 8" :key="n" class="h-48 rounded-xl bg-slate-100 animate-pulse" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
        <button
          v-for="item in displayedLibraryItems"
          :key="item.id"
          type="button"
          @click="previewTarget = item"
          class="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 text-left hover:border-amber-400 transition-all cursor-pointer"
        >
          <div class="aspect-video w-full overflow-hidden bg-slate-900">
            <img
              v-if="item.type === 'image'"
              :src="item.src"
              :alt="item.title"
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <video
              v-else
              :key="item.src"
              :src="item.src"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              muted
              loop
              playsinline
              preload="metadata"
              @mouseenter="($event.target as HTMLVideoElement)?.play()?.catch(() => {})"
              @mouseleave="($event.target as HTMLVideoElement)?.pause()"
            />
          </div>

          <span
            :class="[
              'absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold',
              item.type === 'video' ? 'bg-amber-400 text-emerald-950' : 'bg-black/65 text-white',
            ]"
          >
            {{ item.type === 'video' ? 'Video' : 'Image' }}
          </span>

          <div class="p-3 bg-white border-t border-slate-100">
            <p class="text-sm font-semibold text-slate-900 truncate">{{ item.title }}</p>
            <p class="text-xs text-slate-500">{{ item.category }}</p>
          </div>
        </button>
      </div>

      <!-- See More / Show Less Button -->
      <div v-if="hasMoreRows" class="mt-6 flex justify-center">
        <button
          type="button"
          @click="showAllMedia = !showAllMedia"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-amber-300 text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <span>
            {{
              showAllMedia
                ? 'Show Less'
                : `See More (${filteredLibraryItems.length - displayedLibraryItems.length} more)`
            }}
          </span>
          <svg
            :class="['w-4 h-4 transition-transform duration-200', showAllMedia ? 'rotate-180' : '']"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </section>

    <!-- Gallery Preview Modal -->
    <GalleryPreview :item="previewTarget" @close="previewTarget = null" />
  </div>
</template>