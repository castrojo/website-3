// @ts-expect-error Known issues, that's why we use it as a plugin, See here: https://github.com/davidjbradshaw/iframe-resizer/issues/1363
import IframeResizerPlugin from '@iframe-resizer/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n, initI18n, SUPPORTED_LOCALES } from './locales/schema'
import './style/index.scss'

// Detect the locale to activate at startup.
// Priority: ?lang= URL param → browser preference → en-US fallback.
const urlParams = new URLSearchParams(window.location.search)
const requestedLocale = urlParams.get('lang') || window.navigator.language
const startupLocale = SUPPORTED_LOCALES.includes(requestedLocale)
  ? requestedLocale
  : 'en-US'

// Load the startup locale messages before mounting so the first render
// is already translated.  Only en-US + (optionally) one other locale
// are fetched — all other locale chunks remain undownloaded.
initI18n(startupLocale).then(() => {
  const app = createApp(App)
  app.use(i18n)
  app.use(IframeResizerPlugin)
  app.mount('#app')
})
