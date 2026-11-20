// app/middleware/admin-auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie<string | null>('access_token')

  if (!token.value && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})