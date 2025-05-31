// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devtools: { enabled: true },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    },
    baseURL: '/'
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  css: ['~/assets/css/main.css'],
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
  routeRules: {
    "/story/**": { prerender: true },
  },
})