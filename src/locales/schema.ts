import type enUS from './en-US.json'
import { createI18n } from 'vue-i18n'

// Lazy loaders — Vite will emit each locale as a separate chunk.
// Only the locale actually requested at startup is ever downloaded.
const localeModules = import.meta.glob('./*.json')

// The canonical list of all supported locale codes.
// Used by the language-picker dropdown and the startup locale validator.
// Keep this in sync with the *.json files in this directory.
export const SUPPORTED_LOCALES: string[] = [
  'de-DE',
  'en-US',
  'eo',
  'fr-FR',
  'ja-JP',
  'ko-KR',
  'nl-NL',
  'pt-BR',
  'ru-RU',
  'sk-SK',
  'vi-VN',
  'zh-HK',
  'zh-TW',
]

// Derive the MessageSchema type from the authoritative en-US file.
export type MessageSchema = typeof enUS

// Create i18n with an empty message set — messages are loaded by initI18n()
// before the app mounts.  The legacy:false option is required for vue-i18n 10+
// Composition API mode.
export const i18n = createI18n<[MessageSchema], string>({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {} as Record<string, MessageSchema>,
})

/**
 * Load messages for `locale` and register them on the i18n instance.
 * en-US is always loaded as the fallback.  Only one non-default locale
 * is ever fetched — the one the user actually requested.
 *
 * Call this once, before app.mount(), from main.ts.
 */
export async function initI18n(locale: string): Promise<void> {
  // Always load en-US so the fallback chain works.
  const enLoader = localeModules['./en-US.json']
  if (enLoader) {
    const mod = (await enLoader()) as { default: MessageSchema }
    ;(i18n.global as any).setLocaleMessage('en-US', mod.default)
  }

  // Load the requested locale if it differs from en-US.
  if (locale !== 'en-US' && SUPPORTED_LOCALES.includes(locale)) {
    const loader = localeModules[`./${locale}.json`]
    if (loader) {
      const mod = (await loader()) as { default: MessageSchema }
      ;(i18n.global as any).setLocaleMessage(locale, mod.default)
    }
  }

  // Set the active locale.
  ;(i18n.global as any).locale = locale
}
