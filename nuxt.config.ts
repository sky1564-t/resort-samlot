// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],

  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    public: {
      apiBase:
        'http://127.0.0.1:8000/api/v1'
    }
  },

  postcss: {
    plugins: {
      autoprefixer: {}
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vuepic/vue-datepicker'
      ]
    }
  }
})