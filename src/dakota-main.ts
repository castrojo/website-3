// @ts-expect-error Known issues, that's why we use it as a plugin
import IframeResizerPlugin from '@iframe-resizer/vue'
import { createApp } from 'vue'
import DakotaApp from './DakotaApp.vue'
import { i18n } from './locales/schema'
import './style/index.scss'

const app = createApp(DakotaApp)
app.use(i18n)
app.use(IframeResizerPlugin)
app.mount('#app')
