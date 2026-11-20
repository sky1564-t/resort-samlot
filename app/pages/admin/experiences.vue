<!-- app/pages/admin/experiences/index.vue -->
<script setup lang="ts">
import type { Experience } from '~/types/experience'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Manage Experiences'
})

const { getExperiences, createExperience, updateExperience, deleteExperience } = useApi()

const { data: experiences, pending, refresh } = await useAsyncData<Experience[]>(
  'admin-experiences',
  () => getExperiences(),
  { default: () => [] }
)

const showModal = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const errorMessage = ref('')

const form = reactive({
  title: '',
  description: '',
  order: 0,
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.title = ''
  form.description = ''
  form.order = experiences.value.length + 1
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (item: Experience) => {
  editingId.value = item.id
  form.title = item.title
  form.description = item.description
  form.order = item.order
  form.is_active = item.is_active
  form.imageFile = null
  form.imagePreview = item.image
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

  if (!form.title.trim() || !form.description.trim()) {
    errorMessage.value = 'Title and description are required.'
    return
  }

  if (!editingId.value && !form.imageFile) {
    errorMessage.value = 'Please upload an image for the new experience.'
    return
  }

  const formData = new FormData()
  formData.append('title', form.title.trim())
  formData.append('description', form.description.trim())
  formData.append('order', String(form.order))
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) {
    formData.append('image', form.imageFile)
  }

  saving.value = true
  try {
    if (editingId.value) {
      await updateExperience(editingId.value, formData)
    } else {
      await createExperience(formData)
    }
    showModal.value = false
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to save experience. Check your API connection.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (item: Experience) => {
  if (!confirm(`Delete "${item.title}"? This action cannot be undone.`)) return
  try {
    await deleteExperience(item.id)
    await refresh()
  } catch {
    alert('Failed to delete experience.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-['Cinzel'] text-2xl font-bold text-[#1D3527]">
          Resort Experiences
        </h2>
        <p class="text-sm text-neutral-500">
          Manage the experiences displayed on the public Samlot Diamond Resort website.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="rounded-full bg-[#1D3527] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b4e38]"
      >
        + Add Experience
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-80 animate-pulse rounded-2xl bg-neutral-200" />
    </div>

    <!-- Cards Grid -->
    <div v-else-if="experiences.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in experiences"
        :key="item.id"
        class="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
      >
        <div class="relative h-48 w-full bg-neutral-100">
          <img :src="item.image" :alt="item.title" class="h-full w-full object-cover">
          <span
            :class="[
              'absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold',
              item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
            ]"
          >
            {{ item.is_active ? 'Active' : 'Hidden' }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="mb-2 flex items-center justify-between gap-2">
            <h3 class="font-['Cinzel'] text-xl font-semibold text-neutral-900">
              {{ item.title }}
            </h3>
            <span class="text-xs font-medium text-neutral-400">
              #{{ item.order }}
            </span>
          </div>

          <p class="mb-5 flex-1 text-sm text-neutral-600 line-clamp-3">
            {{ item.description }}
          </p>

          <div class="flex items-center gap-2 border-t border-neutral-100 pt-4">
            <button
              @click="openEditModal(item)"
              class="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Edit
            </button>
            <button
              @click="handleDelete(item)"
              class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
      <p class="text-neutral-500">No experiences added yet.</p>
      <button
        @click="openCreateModal"
        class="mt-4 rounded-full bg-[#1D3527] px-6 py-2 text-sm font-medium text-white hover:bg-[#2b4e38]"
      >
        Create First Experience
      </button>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-['Cinzel'] text-xl font-bold text-[#1D3527]">
            {{ editingId ? 'Edit Experience' : 'Add Experience' }}
          </h3>
          <button @click="showModal = false" class="text-neutral-400 hover:text-neutral-700">
            ✕
          </button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700">Title</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="e.g. Nature Retreat"
              class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
            >
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              required
              placeholder="Describe the guest experience..."
              class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-700">Display Order</label>
              <input
                v-model.number="form.order"
                type="number"
                min="0"
                class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#1D3527] focus:outline-none"
              >
            </div>

            <div class="flex items-end pb-2">
              <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-neutral-700">
                <input
                  v-model="form.is_active"
                  type="checkbox"
                  class="h-4 w-4 accent-[#1D3527]"
                >
                Visible on Website
              </label>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700">
              Image {{ editingId ? '(leave empty to keep current)' : '' }}
            </label>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
            <img
              v-if="form.imagePreview"
              :src="form.imagePreview"
              alt="Preview"
              class="mt-3 h-40 w-full rounded-xl object-cover border border-neutral-200"
            >
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-[#1D3527] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2b4e38] disabled:opacity-60"
            >
              {{ saving ? 'Saving...' : editingId ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>