<!-- app/pages/admin/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: false
})

useHead({
  title: 'Admin Login | Samlot Diamond Resort'
})

const config = useRuntimeConfig()
const accessToken = useCookie<string | null>('access_token', { maxAge: 60 * 60 * 24 })
const refreshToken = useCookie<string | null>('refresh_token', { maxAge: 60 * 60 * 24 * 7 })

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  if (!form.username.trim() || !form.password) {
    errorMessage.value = 'Username and password are required.'
    return
  }

  loading.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/accounts/login/`, {
      method: 'POST',
      body: {
        username: form.username.trim(),
        password: form.password
      }
    })

    accessToken.value = res.access || res.token
    if (res.refresh) {
      refreshToken.value = res.refresh
    }

    await navigateTo('/admin')
  } catch (err: any) {
    errorMessage.value =
      err?.data?.detail || 'Invalid credentials. Please check your username and password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-emerald-950 px-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
      <div class="mb-8 text-center">
        <p class="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
          Samlot Diamond Resort
        </p>
        <h1 class="mt-2 font-serif text-3xl font-bold text-[#1D3527]">
          Admin Portal
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Sign in to manage resort operations & content
        </p>
      </div>

      <div v-if="errorMessage" class="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Username / Email
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            autocomplete="username"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#1D3527] focus:outline-none"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Password
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#1D3527] focus:outline-none"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="mt-2 w-full rounded-xl bg-[#1D3527] py-3.5 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#2b4e38] disabled:opacity-60"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>