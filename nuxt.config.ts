import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',

  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },

  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  routeRules: { '/api/**': { proxy: 'http://127.0.0.1:8000/api/**' } },
})
