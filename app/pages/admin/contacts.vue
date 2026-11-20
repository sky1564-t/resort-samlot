<!-- app/pages/admin/contacts/index.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
  title: 'Contact Inquiries'
})

interface ContactInquiry {
  id: number
  name: string
  phone: string
  email: string
  inquiry: string
  check_in: string | null
  check_out: string | null
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

const { getContacts, updateContactStatus, deleteContact } = useApi()

const { data: contacts, pending, refresh } = await useAsyncData<ContactInquiry[]>(
  'admin-contacts',
  async () => {
    const res: any = await getContacts()
    return Array.isArray(res) ? res : (res?.results || [])
  },
  { default: () => [] }
)

const changeStatus = async (item: ContactInquiry, status: string) => {
  await updateContactStatus(item.id, status)
  await refresh()
}

const removeContact = async (item: ContactInquiry) => {
  if (!confirm(`Delete inquiry from "${item.name}"?`)) return
  await deleteContact(item.id)
  await refresh()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-serif text-2xl font-bold text-[#1D3527]">Contact Inquiries</h2>
        <p class="text-sm text-slate-500">Messages submitted from the public Contact Us page.</p>
      </div>
      <button
        @click="refresh()"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
      >
        Refresh
      </button>
    </div>

    <div v-if="pending" class="rounded-xl bg-white p-8 text-center text-slate-400">
      Loading inquiries...
    </div>

    <div v-else-if="!contacts.length" class="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
      No contact inquiries yet.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in contacts"
        :key="item.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-slate-900">{{ item.name }}</h3>
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                {{ item.inquiry }}
              </span>
            </div>
            <p class="mt-1 text-xs text-slate-500">
              {{ item.phone }} • {{ item.email }}
            </p>
            <p v-if="item.check_in || item.check_out" class="mt-1 text-xs text-emerald-700">
              Requested Dates: {{ item.check_in || '-' }} → {{ item.check_out || '-' }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <select
              :value="item.status"
              @change="changeStatus(item, ($event.target as HTMLSelectElement).value)"
              class="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium"
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <button
              @click="removeContact(item)"
              class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        <p class="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          {{ item.message || 'No message provided.' }}
        </p>
      </div>
    </div>
  </div>
</template>