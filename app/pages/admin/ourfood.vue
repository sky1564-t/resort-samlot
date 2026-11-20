<!-- app/pages/admin/ourfood/index.vue -->
<script setup lang="ts">
import type { GalleryImage } from '~/types/gallery'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Our Food Manager'
})

const R2_URL = 'https://pub-0c542abde828459785e3d8da1a74270d.r2.dev'
const { getGallery, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } = useApi()

const normalizeImageUrl = (raw: unknown): string => {
  if (!raw || typeof raw !== 'string') return ''
  let url = raw.trim()
  while (url.startsWith('https://https://')) url = url.replace('https://https://', 'https://')
  while (url.startsWith('http://https://')) url = url.replace('http://https://', 'https://')
  if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) return url
  return `${R2_URL}/${url.replace(/^\/+/, '')}`
}

const statusFilter = ref<'all' | 'active' | 'hidden'>('all')

const { data: foodPhotos, pending, refresh } = await useAsyncData<GalleryImage[]>(
  'admin-ourfood',
  async () => {
    try {
      const res: any = await getGallery('food')
      const list = Array.isArray(res) ? res : (res?.results || [])
      return list
        .sort((a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0))
        .map((item: any) => ({
          ...item,
          image: normalizeImageUrl(item?.url || item?.media_url || item?.image)
        }))
    } catch {
      return []
    }
  },
  { default: () => [] }
)

const filteredPhotos = computed(() => {
  if (statusFilter.value === 'active') return foodPhotos.value.filter((p) => p.is_active)
  if (statusFilter.value === 'hidden') return foodPhotos.value.filter((p) => !p.is_active)
  return foodPhotos.value
})

const activeCount = computed(() => foodPhotos.value.filter((p) => p.is_active).length)
const hiddenCount = computed(() => foodPhotos.value.filter((p) => !p.is_active).length)

const showModal = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const errorMessage = ref('')
const statusMessage = ref('')

const form = reactive({
  title: '',
  order: 0,
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const clearBlobPreview = () => {
  if (form.imagePreview && form.imagePreview.startsWith('blob:')) {
    URL.revokeObjectURL(form.imagePreview)
  }
}

const openUploadModal = () => {
  clearBlobPreview()
  editingId.value = null
  form.title = ''
  form.order = foodPhotos.value.length + 1
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (photo: GalleryImage) => {
  clearBlobPreview()
  editingId.value = photo.id
  form.title = photo.title || ''
  form.order = photo.order ?? 0
  form.is_active = photo.is_active ?? true
  form.imageFile = null
  form.imagePreview = normalizeImageUrl(photo.image)
  errorMessage.value = ''
  showModal.value = true
}

const closeModal = () => {
  clearBlobPreview()
  form.imageFile = null
  form.imagePreview = ''
  showModal.value = false
}

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  clearBlobPreview()
  form.imageFile = file
  form.imagePreview = URL.createObjectURL(file)
}

const syncOurFoodData = async () => {
  clearNuxtData('public-ourfood')
  clearNuxtData('public-gallery-food')
  await refresh()
}

const handleSubmit = async () => {
  errorMessage.value = ''
  statusMessage.value = ''

  if (!editingId.value && !form.imageFile) {
    errorMessage.value = 'Please select a food photo to upload.'
    return
  }

  const formData = new FormData()
  formData.append('title', form.title.trim())
  formData.append('category', 'food')
  formData.append('order', String(form.order))
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) {
    formData.append('image', form.imageFile)
  }

  saving.value = true
  try {
    if (editingId.value) {
      await updateGalleryImage(editingId.value, formData)
      statusMessage.value = 'Food photo updated.'
    } else {
      await uploadGalleryImage(formData)
      statusMessage.value = 'Food photo uploaded to Our Food Resort.'
    }
    closeModal()
    await syncOurFoodData()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to save food photo.'
  } finally {
    saving.value = false
  }
}

const toggleVisibility = async (photo: GalleryImage) => {
  errorMessage.value = ''
  const formData = new FormData()
  formData.append('title', photo.title || '')
  formData.append('category', 'food')
  formData.append('order', String(photo.order ?? 0))
  formData.append('is_active', String(!photo.is_active))

  try {
    await updateGalleryImage(photo.id, formData)
    statusMessage.value = !photo.is_active
      ? `"${photo.title || 'Photo'}" is now visible on Our Food Resort.`
      : `"${photo.title || 'Photo'}" is now hidden.`
    await syncOurFoodData()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to update visibility.'
  }
}

const handleDelete = async (photo: GalleryImage) => {
  if (!confirm(`Delete "${photo.title || 'this food photo'}"?`)) return
  errorMessage.value = ''
  try {
    await deleteGalleryImage(photo.id)
    statusMessage.value = 'Food photo deleted.'
    await syncOurFoodData()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to delete food photo.'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">Our Food Resort</h2>
        <p class="text-sm text-slate-500">
          Manage dining spaces, cuisine, and food photos shown in the Our Food accordion strip.
        </p>
      </div>

      <button
        type="button"
        @click="openUploadModal"
        class="rounded-full bg-[#1D3527] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38] cursor-pointer"
      >
        + Add Food Photo
      </button>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-3 gap-4">
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Photos</p>
        <p class="mt-1 text-2xl font-bold text-[#1D3527]">{{ foodPhotos.length }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Visible on Site</p>
        <p class="mt-1 text-2xl font-bold text-emerald-700">{{ activeCount }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-medium uppercase tracking-wider text-slate-500">Hidden</p>
        <p class="mt-1 text-2xl font-bold text-slate-400">{{ hiddenCount }}</p>
      </div>
    </div>

    <!-- Status / Error Banners -->
    <div
      v-if="statusMessage"
      class="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
    >
      <span>{{ statusMessage }}</span>
      <button type="button" @click="statusMessage = ''" class="text-xs font-semibold hover:underline cursor-pointer">
        Dismiss
      </button>
    </div>

    <div
      v-if="errorMessage && !showModal"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3">
      <button
        type="button"
        @click="statusFilter = 'all'"
        :class="[
          'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
          statusFilter === 'all' ? 'bg-[#1D3527] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        All ({{ foodPhotos.length }})
      </button>
      <button
        type="button"
        @click="statusFilter = 'active'"
        :class="[
          'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
          statusFilter === 'active' ? 'bg-[#1D3527] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        Visible ({{ activeCount }})
      </button>
      <button
        type="button"
        @click="statusFilter = 'hidden'"
        :class="[
          'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
          statusFilter === 'hidden' ? 'bg-[#1D3527] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        Hidden ({{ hiddenCount }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <div v-for="n in 8" :key="n" class="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <!-- Photo Grid -->
    <div v-else-if="filteredPhotos.length" class="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      <article
        v-for="photo in filteredPhotos"
        :key="photo.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="relative aspect-[4/5] w-full bg-slate-100">
          <img
            :src="photo.image"
            :alt="photo.title || 'Our Food photo'"
            class="h-full w-full object-cover"
          />
          <span class="absolute left-2.5 top-2.5 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Order #{{ photo.order }}
          </span>
          <span
            :class="[
              'absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white',
              photo.is_active ? 'bg-emerald-600' : 'bg-red-600'
            ]"
          >
            {{ photo.is_active ? 'Visible' : 'Hidden' }}
          </span>
        </div>

        <div class="p-3">
          <p class="mb-2.5 truncate text-xs font-semibold text-slate-800">
            {{ photo.title || 'Untitled Food Photo' }}
          </p>

          <div class="flex gap-1.5">
            <button
              type="button"
              @click="openEditModal(photo)"
              class="flex-1 rounded-lg border border-slate-300 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              @click="toggleVisibility(photo)"
              class="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {{ photo.is_active ? 'Hide' : 'Show' }}
            </button>
            <button
              type="button"
              @click="handleDelete(photo)"
              class="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      No food photos found. Click "+ Add Food Photo" to upload your first dish or dining space.
    </div>

    <!-- Upload / Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">
            {{ editingId ? 'Edit Food Photo' : 'Add Food Photo' }}
          </h3>
          <button type="button" @click="closeModal" class="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Dish / Caption Title (Optional)</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="e.g. Khmer Fish Amok"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Display Order (Left to Right)</label>
            <input
              v-model.number="form.order"
              type="number"
              min="0"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">
              Photo {{ editingId ? '(leave empty to keep current)' : '' }}
            </label>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <img
              v-if="form.imagePreview"
              :src="form.imagePreview"
              alt="Preview"
              class="mt-3 h-44 w-full rounded-xl border border-slate-200 object-cover"
            />
          </div>

          <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input v-model="form.is_active" type="checkbox" class="accent-[#1D3527]" />
            Visible on Website
          </label>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="rounded-lg border border-slate-300 px-4 py-2 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-[#1D3527] px-5 py-2 text-sm font-semibold text-[#D4AF37] disabled:opacity-60 cursor-pointer"
            >
              {{ saving ? 'Saving...' : editingId ? 'Update' : 'Upload' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>