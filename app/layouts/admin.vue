<!-- app/layouts/admin.vue -->
<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)
const accessToken = useCookie<string | null>('access_token')
const refreshToken = useCookie<string | null>('refresh_token')

type NavIconKey =
  | 'dashboard'
  | 'bookings'
  | 'rooms'
  | 'guests'
  | 'payments'
  | 'website'
  | 'cms'
  | 'blog'
  | 'gallery'
  | 'reports'
  | 'notifications'
  | 'audits'
  | 'accounts'
  | 'ourfood'

interface NavItem {
  name: string
  to: string
  icon: NavIconKey
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Operations',
    items: [
      { name: 'Dashboard', to: '/admin', icon: 'dashboard' },
      { name: 'Bookings', to: '/admin/bookings', icon: 'bookings' },
      { name: 'Rooms & Villas', to: '/admin/rooms', icon: 'rooms' },
      { name: 'Guests', to: '/admin/guests', icon: 'guests' },
      { name: 'Payments', to: '/admin/payments', icon: 'payments' },
    ],
  },
  {
    label: 'Content & Website',
    items: [
      { name: 'Website Settings', to: '/admin/website', icon: 'website' },
      { name: 'CMS Pages', to: '/admin/cms', icon: 'cms' },
      { name: 'Blog Posts', to: '/admin/blog', icon: 'blog' },
      { name: 'Gallery', to: '/admin/gallery', icon: 'gallery' },
      { name: 'Our Food', to: '/admin/ourfood', icon: 'ourfood' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Reports', to: '/admin/reports', icon: 'reports' },
      { name: 'Notifications', to: '/admin/notifications', icon: 'notifications' },
      { name: 'Audit Logs', to: '/admin/audits', icon: 'audits' },
      { name: 'Accounts & Staff', to: '/admin/accounts', icon: 'accounts' },
    ],
  },
]

const pageTitle = computed(() => {
  const metaTitle = route.meta?.title
  if (typeof metaTitle === 'string' && metaTitle.trim()) return metaTitle

  for (const group of navGroups) {
    const match = group.items.find((item) =>
      item.to === '/admin' ? route.path === '/admin' : route.path.startsWith(item.to)
    )
    if (match) return match.name
  }

  return 'Dashboard'
})

const isActive = (path: string) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const logout = async () => {
  accessToken.value = null
  refreshToken.value = null
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen flex bg-[#f6f8f7] text-slate-900 selection:bg-amber-200 selection:text-emerald-950">
    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-[1px] lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#052920] via-emerald-950 to-[#041f18] text-emerald-50 flex flex-col border-r border-emerald-900/80 shadow-xl lg:shadow-none transition-transform duration-200 ease-out lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Brand Header -->
      <div class="h-16 flex items-center justify-between px-5 border-b border-emerald-800/60 bg-black/15">
        <NuxtLink to="/admin" class="flex items-center gap-3 group" @click="sidebarOpen = false">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
              <path d="M2 9h20" />
              <path d="M10 3l-2 6 4 12 4-12-2-6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold tracking-wide text-amber-400">SAMLOT DIAMOND</p>
            <p class="text-[10px] font-medium text-emerald-300/75 uppercase tracking-[0.18em]">
              Resort Admin
            </p>
          </div>
        </NuxtLink>

        <button
          type="button"
          aria-label="Close sidebar"
          class="lg:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/80 transition-colors"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Groups -->
      <nav class="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div v-for="group in navGroups" :key="group.label">
          <p class="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-300/65">
            {{ group.label }}
          </p>

          <ul class="space-y-1">
            <li v-for="item in group.items" :key="item.to">
              <NuxtLink
                :to="item.to"
                @click="sidebarOpen = false"
                :class="[
                  'group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                  isActive(item.to)
                    ? 'bg-amber-400 text-emerald-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-emerald-100/85 hover:bg-emerald-900/75 hover:text-white',
                ]"
              >
                <span class="flex items-center gap-3 min-w-0">
                  <svg
                    :class="[
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive(item.to)
                        ? 'text-emerald-950'
                        : 'text-emerald-300/80 group-hover:text-amber-300',
                    ]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <!-- Dashboard -->
                    <template v-if="item.icon === 'dashboard'">
                      <rect x="3" y="3" width="7" height="9" rx="1.5" />
                      <rect x="14" y="3" width="7" height="5" rx="1.5" />
                      <rect x="14" y="12" width="7" height="9" rx="1.5" />
                      <rect x="3" y="16" width="7" height="5" rx="1.5" />
                    </template>
                    <!-- Bookings -->
                    <template v-else-if="item.icon === 'bookings'">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </template>
                    <!-- Rooms & Villas -->
                    <template v-else-if="item.icon === 'rooms'">
                      <path d="M3 10.5L12 3l9 7.5" />
                      <path d="M5 9.5V20h14V9.5" />
                      <path d="M9 20v-6h6v6" />
                    </template>
                    <!-- Guests -->
                    <template v-else-if="item.icon === 'guests'">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </template>
                    <!-- Payments -->
                    <template v-else-if="item.icon === 'payments'">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </template>
                    <!-- Website Settings -->
                    <template v-else-if="item.icon === 'website'">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </template>
                    <!-- CMS Pages -->
                    <template v-else-if="item.icon === 'cms'">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6M8 13h8M8 17h6" />
                    </template>
                    <!-- Blog Posts -->
                    <template v-else-if="item.icon === 'blog'">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </template>
                    <!-- Gallery -->
                    <template v-else-if="item.icon === 'gallery'">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </template>
                    <template v-else-if="item.icon === 'ourfood'">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </template>
                    <!-- Reports -->
                    <template v-else-if="item.icon === 'reports'">
                      <path d="M3 3v18h18" />
                      <path d="M7 14l4-4 3 3 5-6" />
                    </template>
                    <!-- Notifications -->
                    <template v-else-if="item.icon === 'notifications'">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </template>
                    <!-- Audit Logs -->
                    <template v-else-if="item.icon === 'audits'">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </template>
                    <!-- Accounts & Staff -->
                    <template v-else-if="item.icon === 'accounts'">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                    </template>
                  </svg>

                  <span class="truncate">{{ item.name }}</span>
                </span>

                <span
                  v-if="isActive(item.to)"
                  class="w-1.5 h-1.5 rounded-full bg-emerald-950 shrink-0"
                />
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Sidebar Footer / Sign Out -->
      <div class="p-3.5 border-t border-emerald-800/60 bg-black/15">
        <button
          type="button"
          @click="logout"
          class="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-xl bg-emerald-900/80 hover:bg-red-600 text-emerald-100 hover:text-white border border-emerald-700/50 hover:border-red-500 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Column -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-3 min-w-0">
          <button
            type="button"
            :aria-expanded="sidebarOpen"
            aria-label="Open sidebar"
            class="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            @click="sidebarOpen = true"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div class="flex items-center gap-2 min-w-0">
            <span class="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <h1 class="text-base sm:text-lg font-semibold text-slate-800 truncate capitalize">
              {{ pageTitle }}
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-4 shrink-0">
          <NuxtLink
            to="/"
            target="_blank"
            class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900 transition-colors"
          >
            <svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>View Live Site</span>
            <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </NuxtLink>

          <div
            title="Admin Account"
            class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-900 to-emerald-950 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xs font-bold shadow-sm select-none"
          >
            AD
          </div>
        </div>
      </header>

      <!-- Page Slot -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
        <slot />
      </main>
    </div>
  </div>
</template>