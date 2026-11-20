<!-- app/pages/admin/website/index.vue -->
<script setup lang="ts">
import type { HeroSection } from '~/types/hero'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Website Hero Banners'
})

const { getHeroes, createHero, updateHero, deleteHero } = useApi()

const { data: heroes, pending, refresh } = await useAsyncData<HeroSection[]>(
  'admin-heroes',
  () => getHeroes(),
  { default: () => [] }
)

const pageOptions = [
  { value: 'home', label: 'Home Page' },
  { value: 'rooms', label: 'Rooms & Suites' },
  { value: 'experiences', label: 'Experiences' },
  { value: 'booking', label: 'Booking Page' },
  { value: 'farm', label: 'The Resort Farm' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'offers', label: 'Offers' },
  { value: 'events', label: 'Events' },
  { value: 'blog', label: 'Blog' },
  { value: 'contact', label: 'Contact' }
]

const showModal = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const errorMessage = ref('')

const form = reactive({
  page: 'home',
  eyebrow: '',
  title: '',
  subtitle: '',
  description: '',
  cta_text: '',
  cta_link: '',
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const openCreateModal = () => {
  editingId.value = null
  const usedPages = new Set(heroes.value.map(h => h.page))
  const firstAvailable = pageOptions.find(p => !usedPages.has(p.value))
  form.page = firstAvailable ? firstAvailable.value : 'home'
  form.eyebrow = ''
  form.title = ''
  form.subtitle = ''
  form.description = ''
  form.cta_text = ''
  form.cta_link = ''
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (hero: HeroSection) => {
  editingId.value = hero.id
  form.page = hero.page
  form.eyebrow = hero.eyebrow || ''
  form.title = hero.title || ''
  form.subtitle = hero.subtitle || ''
  form.description = hero.description || ''
  form.cta_text = hero.cta_text || ''
  form.cta_link = hero.cta_link || ''
  form.is_active = hero.is_active
  form.imageFile = null
  form.imagePreview = hero.background_image || ''
  errorMessage.value = ''
  showModal.value = true
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  form.imageFile = file
  form.imagePreview = URL.createObjectURL(file)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  if (!form.title.trim()) {
    errorMessage.value = 'Hero title is required.'
    return
  }

  const formData = new FormData()
  formData.append('page', form.page)
  formData.append('eyebrow', form.eyebrow.trim())
  formData.append('title', form.title.trim())
  formData.append('subtitle', form.subtitle.trim())
  formData.append('description', form.description.trim())
  formData.append('cta_text', form.cta_text.trim())
  formData.append('cta_link', form.cta_link.trim())
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) {
    formData.append('background_image', form.imageFile)
  }

  saving.value = true
  try {
    if (editingId.value) {
      await updateHero(editingId.value, formData)
    } else {
      await createHero(formData)
    }
    showModal.value = false
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.page?.[0] || err?.data?.detail || 'Failed to save hero banner.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (hero: HeroSection) => {
  if (!confirm(`Delete hero banner for "${hero.page_label}"?`)) return
  try {
    await deleteHero(hero.id)
    await refresh()
  } catch {
    alert('Failed to delete hero banner.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">
          Website Hero System
        </h2>
        <p class="text-sm text-slate-500">
          Update hero titles, descriptions, and Cloudflare R2 background images for every page.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="rounded-full bg-[#1D3527] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#2b4e38]"
      >
        + Add Page Hero
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid gap-6 md:grid-cols-2">
      <div v-for="n in 2" :key="n" class="h-64 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <!-- Hero Cards -->
    <div v-else-if="heroes.length" class="grid gap-6 md:grid-cols-2">
      <article
        v-for="hero in heroes"
        :key="hero.id"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="relative h-48 w-full bg-slate-900">
          <img
            v-if="hero.background_image"
            :src="hero.background_image"
            :alt="hero.title"
            class="h-full w-full object-cover opacity-80"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <span class="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
            {{ hero.page_label }}
          </span>
          <span
            :class="[
              'absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold',
              hero.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            ]"
          >
            {{ hero.is_active ? 'Active' : 'Hidden' }}
          </span>

          <div class="absolute bottom-4 left-4 right-4 text-white">
            <p v-if="hero.eyebrow" class="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
              {{ hero.eyebrow }}
            </p>
            <h3 class="font-serif text-xl font-semibold leading-tight">
              {{ hero.title }}
              <span v-if="hero.subtitle" class="italic font-normal text-amber-50"> {{ hero.subtitle }}</span>
            </h3>
          </div>
        </div>

        <div class="p-5">
          <p class="mb-4 text-sm text-slate-600 line-clamp-2">
            {{ hero.description || 'No description set.' }}
          </p>

          <div class="flex items-center gap-2 border-t border-slate-100 pt-4">
            <button
              @click="openEditModal(hero)"
              class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit Hero
            </button>
            <button
              @click="handleDelete(hero)"
              class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <p class="text-slate-500">No hero banners configured yet.</p>
      <button
        @click="openCreateModal"
        class="mt-4 rounded-full bg-[#1D3527] px-6 py-2 text-sm font-medium text-white hover:bg-[#2b4e38]"
      >
        Create First Hero Banner
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">
            {{ editingId ? 'Edit Page Hero' : 'Add Page Hero' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Target Page</label>
              <select
                v-model="form.page"
                :disabled="Boolean(editingId)"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              >
                <option v-for="opt in pageOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Eyebrow (Small Gold Text)</label>
              <input
                v-model="form.eyebrow"
                type="text"
                placeholder="e.g. Luxury Stays • Unforgettable Experiences"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Main Title</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="e.g. More Than a Stay"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Subtitle (Optional Italic Line)</label>
              <input
                v-model="form.subtitle"
                type="text"
                placeholder="e.g. It's an Experience"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Button Text (Optional)</label>
              <input
                v-model="form.cta_text"
                type="text"
                placeholder="e.g. Book Now"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Button Link (Optional)</label>
              <input
                v-model="form.cta_link"
                type="text"
                placeholder="/booking"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Background Image {{ editingId ? '(leave empty to keep current)' : '' }}
              </label>
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
              <img
                v-if="form.imagePreview"
                :src="form.imagePreview"
                alt="Hero Preview"
                class="mt-3 h-40 w-full rounded-xl border border-slate-200 object-cover"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input v-model="form.is_active" type="checkbox" class="h-4 w-4 accent-[#1D3527]">
                Active on Website
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-[#1D3527] px-5 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38] disabled:opacity-60"
            >
              {{ saving ? 'Saving...' : editingId ? 'Update Hero' : 'Create Hero' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>