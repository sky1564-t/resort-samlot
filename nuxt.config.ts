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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api',
    },
  },

  postcss: {
    plugins: {
      autoprefixer: {},
      tailwindcss: {},
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