<!-- app/pages/admin/rooms/index.vue -->
<script setup lang="ts">
import type { Room } from '~/types/room'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Rooms & Villas'
})

const { getRooms, createRoom, updateRoom, deleteRoom } = useApi()

const { data: rooms, pending, refresh } = await useAsyncData<Room[]>(
  'admin-rooms',
  () => getRooms(),
  { default: () => [] }
)

const showModal = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const errorMessage = ref('')

const form = reactive({
  name: '',
  description: '',
  price_per_night: 0,
  total_rooms: 1,
  max_adults: 2,
  max_children: 2,
  size_sqm: 30,
  bed_type: '',
  amenitiesText: '',
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.name = ''
  form.description = ''
  form.price_per_night = 0
  form.total_rooms = 1
  form.max_adults = 2
  form.max_children = 2
  form.size_sqm = 30
  form.bed_type = 'King Bed'
  form.amenitiesText = 'Free WiFi, Mountain View, Breakfast'
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (room: Room) => {
  editingId.value = room.id
  form.name = room.name
  form.description = room.description || ''
  form.price_per_night = Number(room.price_per_night)
  form.total_rooms = room.total_rooms
  form.max_adults = room.max_adults
  form.max_children = room.max_children
  form.size_sqm = room.size_sqm || 0
  form.bed_type = room.bed_type || ''
  form.amenitiesText = (room.amenities || []).join(', ')
  form.is_active = room.is_active
  form.imageFile = null
  form.imagePreview = room.cover_image || ''
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

  if (!form.name.trim() || form.price_per_night <= 0) {
    errorMessage.value = 'Room name and a valid nightly price are required.'
    return
  }

  const amenitiesArray = form.amenitiesText
    .split(',')
    .map(a => a.trim())
    .filter(Boolean)

  const formData = new FormData()
  formData.append('name', form.name.trim())
  formData.append('description', form.description.trim())
  formData.append('price_per_night', String(form.price_per_night))
  formData.append('total_rooms', String(form.total_rooms))
  formData.append('max_adults', String(form.max_adults))
  formData.append('max_children', String(form.max_children))
  formData.append('size_sqm', String(form.size_sqm || 0))
  formData.append('bed_type', form.bed_type.trim())
  formData.append('amenities', JSON.stringify(amenitiesArray))
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) {
    formData.append('cover_image', form.imageFile)
  }

  saving.value = true
  try {
    if (editingId.value) {
      await updateRoom(editingId.value, formData)
    } else {
      await createRoom(formData)
    }
    showModal.value = false
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to save room. Check your fields and try again.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (room: Room) => {
  if (!confirm(`Delete "${room.name}"?`)) return
  try {
    await deleteRoom(room.id)
    await refresh()
  } catch (err: any) {
    alert(err?.data?.detail || 'Cannot delete this room (it may have existing bookings).')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1e2e1a]">
          Rooms, Villas & Camping
        </h2>
        <p class="text-sm text-slate-500">
          Manage accommodation types, pricing, inventory counts, and Cloudflare R2 cover images.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="rounded-full bg-[#4e733c] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3b5a2d]"
      >
        + Add Room Type
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-80 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <!-- Rooms Grid -->
    <div v-else-if="rooms.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="room in rooms"
        :key="room.id"
        class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="relative h-48 w-full bg-slate-100">
          <img
            v-if="room.cover_image"
            :src="room.cover_image"
            :alt="room.name"
            class="h-full w-full object-cover"
          >
          <div v-else class="flex h-full items-center justify-center text-xs text-slate-400">
            No Cover Image
          </div>
          <span
            :class="[
              'absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold',
              room.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            ]"
          >
            {{ room.is_active ? 'Active' : 'Hidden' }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="mb-1 flex items-start justify-between gap-2">
            <h3 class="text-lg font-bold text-slate-900">{{ room.name }}</h3>
            <span class="text-base font-bold text-[#4e733c]">
              ${{ Number(room.price_per_night) }}<span class="text-xs font-normal text-slate-400">/n</span>
            </span>
          </div>

          <p class="mb-3 text-xs text-slate-500">
            {{ room.bed_type || 'Standard' }} • {{ room.max_adults }}A / {{ room.max_children }}C • {{ room.size_sqm || '-' }} m² • {{ room.total_rooms }} unit(s)
          </p>

          <p class="mb-4 flex-1 text-sm text-slate-600 line-clamp-2">
            {{ room.description || 'No description.' }}
          </p>

          <div class="flex items-center gap-2 border-t border-slate-100 pt-4">
            <button
              @click="openEditModal(room)"
              class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              @click="handleDelete(room)"
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
      <p class="text-slate-500">No rooms added yet.</p>
      <button
        @click="openCreateModal"
        class="mt-4 rounded-full bg-[#4e733c] px-6 py-2 text-sm font-medium text-white hover:bg-[#3b5a2d]"
      >
        Add First Room
      </button>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1e2e1a]">
            {{ editingId ? 'Edit Room Type' : 'Add Room Type' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">Room Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. White Camping"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#4e733c] focus:outline-none"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Price Per Night ($)</label>
              <input
                v-model.number="form.price_per_night"
                type="number"
                step="0.01"
                min="1"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Total Units Available</label>
              <input
                v-model.number="form.total_rooms"
                type="number"
                min="1"
                required
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Max Adults</label>
              <input
                v-model.number="form.max_adults"
                type="number"
                min="1"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Max Children</label>
              <input
                v-model.number="form.max_children"
                type="number"
                min="0"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Bed Type</label>
              <input
                v-model="form.bed_type"
                type="text"
                placeholder="e.g. King Bed"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Size (m²)</label>
              <input
                v-model.number="form.size_sqm"
                type="number"
                min="0"
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

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">Amenities (comma-separated)</label>
              <input
                v-model="form.amenitiesText"
                type="text"
                placeholder="Free WiFi, Air Conditioning, Mountain View"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-700">
                Cover Image {{ editingId ? '(leave empty to keep current)' : '' }}
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
                alt="Preview"
                class="mt-3 h-40 w-full rounded-xl border border-slate-200 object-cover"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input v-model="form.is_active" type="checkbox" class="h-4 w-4 accent-[#4e733c]">
                Visible on Public Website
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
              class="rounded-lg bg-[#4e733c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3b5a2d] disabled:opacity-60"
            >
              {{ saving ? 'Saving...' : editingId ? 'Update Room' : 'Create Room' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>