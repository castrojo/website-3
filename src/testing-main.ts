import { createApp } from 'vue'
import { i18n, initI18n } from './locales/schema'
import TestingApp from './TestingApp.vue'
import './style/index.scss'

// The testing harness always uses en-US.
initI18n('en-US').then(() => {
  const app = createApp(TestingApp)
  app.use(i18n)
  app.mount('#app')
})
