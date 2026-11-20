<!-- app/pages/admin/offers/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Special Offers'
})

interface SpecialOffer {
  id: number
  title: string
  badge: string
  description: string
  discount_text: string
  valid_until: string | null
  image: string
  is_active: boolean
  order: number
}

const { getOffers, createOffer, updateOffer, deleteOffer } = useApi()

const { data: offers, pending, refresh } = await useAsyncData<SpecialOffer[]>(
  'admin-offers',
  async () => {
    const res: any = await getOffers()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)

const showModal = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const errorMessage = ref('')

const form = reactive({
  title: '',
  badge: 'Special Offer',
  description: '',
  discount_text: '',
  valid_until: '',
  order: 0,
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.title = ''
  form.badge = 'Special Offer'
  form.description = ''
  form.discount_text = ''
  form.valid_until = ''
  form.order = offers.value.length + 1
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (item: SpecialOffer) => {
  editingId.value = item.id
  form.title = item.title
  form.badge = item.badge || ''
  form.description = item.description
  form.discount_text = item.discount_text || ''
  form.valid_until = item.valid_until || ''
  form.order = item.order
  form.is_active = item.is_active
  form.imageFile = null
  form.imagePreview = item.image
  errorMessage.value = ''
  showModal.value = true
}

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  form.imageFile = file
  form.imagePreview = URL.createObjectURL(file)
}

const handleSubmit = async () => {
  errorMessage.value = ''
  if (!form.title.trim() || !form.description.trim()) {
    errorMessage.value = 'Title and description are required.'
    return
  }
  if (!editingId.value && !form.imageFile) {
    errorMessage.value = 'Please upload an offer image.'
    return
  }

  const formData = new FormData()
  formData.append('title', form.title.trim())
  formData.append('badge', form.badge.trim())
  formData.append('description', form.description.trim())
  formData.append('discount_text', form.discount_text.trim())
  if (form.valid_until) formData.append('valid_until', form.valid_until)
  formData.append('order', String(form.order))
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) formData.append('image', form.imageFile)

  saving.value = true
  try {
    if (editingId.value) {
      await updateOffer(editingId.value, formData)
    } else {
      await createOffer(formData)
    }
    showModal.value = false
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to save offer.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (item: SpecialOffer) => {
  if (!confirm(`Delete offer "${item.title}"?`)) return
  await deleteOffer(item.id)
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">Special Offers & Packages</h2>
        <p class="text-sm text-slate-500">Create promotional deals displayed on the Offers page.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-full bg-[#1D3527] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38]"
      >
        + Add Offer
      </button>
    </div>

    <div v-if="pending" class="grid gap-6 md:grid-cols-2">
      <div v-for="n in 2" :key="n" class="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="offers.length" class="grid gap-6 md:grid-cols-2">
      <article
        v-for="offer in offers"
        :key="offer.id"
        class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="relative h-48 bg-slate-100">
          <img :src="offer.image" :alt="offer.title" class="h-full w-full object-cover">
          <span v-if="offer.discount_text" class="absolute bottom-3 right-3 rounded-lg bg-[#D4AF37] px-3 py-1 text-xs font-bold text-black">
            {{ offer.discount_text }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="mb-2 flex items-center justify-between">
            <h3 class="font-serif text-xl font-semibold text-[#1D3527]">{{ offer.title }}</h3>
            <span :class="['rounded-full px-2.5 py-0.5 text-xs font-semibold', offer.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600']">
              {{ offer.is_active ? 'Active' : 'Hidden' }}
            </span>
          </div>
          <p class="mb-3 flex-1 text-sm text-slate-600 line-clamp-2">{{ offer.description }}</p>
          <p v-if="offer.valid_until" class="mb-4 text-xs text-slate-400">Valid until: {{ offer.valid_until }}</p>

          <div class="flex gap-2 border-t border-slate-100 pt-4">
            <button @click="openEditModal(offer)" class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Edit
            </button>
            <button @click="handleDelete(offer)" class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      No offers added yet.
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">
            {{ editingId ? 'Edit Offer' : 'Add Offer' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Offer Title</label>
            <input v-model="form.title" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Badge</label>
              <input v-model="form.badge" type="text" placeholder="e.g. Weekend Escape" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Discount Label</label>
              <input v-model="form.discount_text" type="text" placeholder="e.g. Save 20%" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Description</label>
            <textarea v-model="form.description" rows="3" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Valid Until</label>
              <input v-model="form.valid_until" type="date" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
            <div class="flex items-end pb-2">
              <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input v-model="form.is_active" type="checkbox" class="accent-[#1D3527]"> Visible on Website
              </label>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Image</label>
            <input type="file" accept="image/*" @change="onFileChange" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <img v-if="form.imagePreview" :src="form.imagePreview" class="mt-3 h-36 w-full rounded-xl object-cover">
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button type="button" @click="showModal = false" class="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" :disabled="saving" class="rounded-lg bg-[#1D3527] px-5 py-2 text-sm font-semibold text-[#D4AF37] disabled:opacity-60">
              {{ saving ? 'Saving...' : editingId ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>