<!-- app/pages/admin/events/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Events & Celebrations'
})

interface ResortEvent {
  id: number
  title: string
  category: string
  description: string
  event_date: string | null
  capacity: string
  image: string
  is_active: boolean
  order: number
}

const { getEvents, createEvent, updateEvent, deleteEvent } = useApi()

const { data: events, pending, refresh } = await useAsyncData<ResortEvent[]>(
  'admin-events',
  async () => {
    const res: any = await getEvents()
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
  category: 'Wedding',
  description: '',
  event_date: '',
  capacity: '',
  order: 0,
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.title = ''
  form.category = 'Wedding'
  form.description = ''
  form.event_date = ''
  form.capacity = ''
  form.order = events.value.length + 1
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (ev: ResortEvent) => {
  editingId.value = ev.id
  form.title = ev.title
  form.category = ev.category || ''
  form.description = ev.description
  form.event_date = ev.event_date || ''
  form.capacity = ev.capacity || ''
  form.order = ev.order
  form.is_active = ev.is_active
  form.imageFile = null
  form.imagePreview = ev.image
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
    errorMessage.value = 'Please upload an event image.'
    return
  }

  const formData = new FormData()
  formData.append('title', form.title.trim())
  formData.append('category', form.category.trim())
  formData.append('description', form.description.trim())
  if (form.event_date) formData.append('event_date', form.event_date)
  formData.append('capacity', form.capacity.trim())
  formData.append('order', String(form.order))
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) formData.append('image', form.imageFile)

  saving.value = true
  try {
    if (editingId.value) {
      await updateEvent(editingId.value, formData)
    } else {
      await createEvent(formData)
    }
    showModal.value = false
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to save event.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (ev: ResortEvent) => {
  if (!confirm(`Delete event "${ev.title}"?`)) return
  await deleteEvent(ev.id)
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">Events & Celebrations</h2>
        <p class="text-sm text-slate-500">Manage weddings, retreats, and private gathering packages.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-full bg-[#1D3527] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38]"
      >
        + Add Event
      </button>
    </div>

    <div v-if="pending" class="grid gap-6 md:grid-cols-2">
      <div v-for="n in 2" :key="n" class="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="events.length" class="grid gap-6 md:grid-cols-2">
      <article
        v-for="ev in events"
        :key="ev.id"
        class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="relative h-48 bg-slate-100">
          <img :src="ev.image" :alt="ev.title" class="h-full w-full object-cover">
          <span class="absolute left-3 top-3 rounded-full bg-[#1D3527] px-3 py-1 text-xs font-semibold text-[#D4AF37]">
            {{ ev.category || 'Event' }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <h3 class="font-serif text-xl font-semibold text-[#1D3527]">{{ ev.title }}</h3>
          <p class="mt-2 flex-1 text-sm text-slate-600 line-clamp-2">{{ ev.description }}</p>
          <p class="mt-3 text-xs text-slate-500">
            <span v-if="ev.capacity">Capacity: {{ ev.capacity }}</span>
            <span v-if="ev.capacity && ev.event_date"> • </span>
            <span v-if="ev.event_date">Date: {{ ev.event_date }}</span>
          </p>

          <div class="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <button @click="openEditModal(ev)" class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Edit
            </button>
            <button @click="handleDelete(ev)" class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      No events added yet.
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">
            {{ editingId ? 'Edit Event' : 'Add Event' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Event Title</label>
            <input v-model="form.title" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Category</label>
              <input v-model="form.category" type="text" placeholder="e.g. Wedding, Retreat" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Capacity</label>
              <input v-model="form.capacity" type="text" placeholder="e.g. Up to 120 Guests" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Description</label>
            <textarea v-model="form.description" rows="3" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Event Date (Optional)</label>
              <input v-model="form.event_date" type="date" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
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