<!-- app/pages/admin/restaurant/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Ankhusa Restaurant Menu'
})

interface RestaurantItem {
  id: number
  name: string
  category: 'breakfast' | 'khmer' | 'western' | 'drinks' | 'dessert'
  description: string
  price: number | string
  image: string | null
  is_featured: boolean
  is_active: boolean
  order: number
}

const {
  getRestaurantItems,
  createRestaurantItem,
  updateRestaurantItem,
  deleteRestaurantItem
} = useApi()

const { data: items, pending, refresh } = await useAsyncData<RestaurantItem[]>(
  'admin-restaurant',
  async () => {
    const res: any = await getRestaurantItems()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)

const categories = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'khmer', label: 'Khmer Cuisine' },
  { value: 'western', label: 'Western' },
  { value: 'drinks', label: 'Drinks & Coffee' },
  { value: 'dessert', label: 'Dessert' }
]

const showModal = ref(false)
const saving = ref(false)
const editingId = ref<number | null>(null)
const errorMessage = ref('')

const form = reactive({
  name: '',
  category: 'khmer',
  description: '',
  price: 0,
  order: 0,
  is_featured: false,
  is_active: true,
  imageFile: null as File | null,
  imagePreview: ''
})

const openCreateModal = () => {
  editingId.value = null
  form.name = ''
  form.category = 'khmer'
  form.description = ''
  form.price = 0
  form.order = items.value.length + 1
  form.is_featured = false
  form.is_active = true
  form.imageFile = null
  form.imagePreview = ''
  errorMessage.value = ''
  showModal.value = true
}

const openEditModal = (item: RestaurantItem) => {
  editingId.value = item.id
  form.name = item.name
  form.category = item.category
  form.description = item.description || ''
  form.price = Number(item.price)
  form.order = item.order
  form.is_featured = item.is_featured
  form.is_active = item.is_active
  form.imageFile = null
  form.imagePreview = item.image || ''
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
  if (!form.name.trim() || form.price <= 0) {
    errorMessage.value = 'Dish name and a valid price are required.'
    return
  }

  const formData = new FormData()
  formData.append('name', form.name.trim())
  formData.append('category', form.category)
  formData.append('description', form.description.trim())
  formData.append('price', String(form.price))
  formData.append('order', String(form.order))
  formData.append('is_featured', String(form.is_featured))
  formData.append('is_active', String(form.is_active))
  if (form.imageFile) {
    formData.append('image', form.imageFile)
  }

  saving.value = true
  try {
    if (editingId.value) {
      await updateRestaurantItem(editingId.value, formData)
    } else {
      await createRestaurantItem(formData)
    }
    showModal.value = false
    await refresh()
  } catch (err: any) {
    errorMessage.value = err?.data?.detail || 'Failed to save menu item.'
  } finally {
    saving.value = false
  }
}

const handleDelete = async (item: RestaurantItem) => {
  if (!confirm(`Delete "${item.name}" from the menu?`)) return
  await deleteRestaurantItem(item.id)
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">Ankhusa Restaurant Menu</h2>
        <p class="text-sm text-slate-500">Manage dishes, categories, prices, and Cloudflare R2 photos.</p>
      </div>
      <button
        @click="openCreateModal"
        class="rounded-full bg-[#1D3527] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] hover:bg-[#2b4e38]"
      >
        + Add Menu Item
      </button>
    </div>

    <div v-if="pending" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="items.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="relative h-44 bg-slate-100">
          <img v-if="item.image" :src="item.image" :alt="item.name" class="h-full w-full object-cover">
          <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize text-slate-800">
            {{ item.category }}
          </span>
          <span
            v-if="item.is_featured"
            class="absolute right-3 top-3 rounded-full bg-[#D4AF37] px-2.5 py-1 text-xs font-bold text-black"
          >
            Featured
          </span>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="mb-2 flex items-start justify-between gap-2">
            <h3 class="font-semibold text-slate-900">{{ item.name }}</h3>
            <span class="font-bold text-[#1D3527]">${{ Number(item.price).toFixed(2) }}</span>
          </div>
          <p class="mb-4 flex-1 text-sm text-slate-600 line-clamp-2">{{ item.description }}</p>

          <div class="flex gap-2 border-t border-slate-100 pt-4">
            <button
              @click="openEditModal(item)"
              class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      No menu items added yet.
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-serif text-xl font-bold text-[#1D3527]">
            {{ editingId ? 'Edit Menu Item' : 'Add Menu Item' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Dish Name</label>
            <input v-model="form.name" type="text" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Category</label>
              <select v-model="form.category" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Price ($)</label>
              <input v-model.number="form.price" type="number" step="0.01" min="0.01" required class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-700">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-700">Display Order</label>
              <input v-model.number="form.order" type="number" min="0" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
            </div>
            <div class="flex flex-col justify-end gap-2 pb-1">
              <label class="flex items-center gap-2 text-xs font-medium text-slate-700">
                <input v-model="form.is_featured" type="checkbox" class="accent-[#1D3527]"> Chef's Special
              </label>
              <label class="flex items-center gap-2 text-xs font-medium text-slate-700">
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