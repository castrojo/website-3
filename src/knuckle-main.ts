// @ts-expect-error Known issues, that's why we use it as a plugin
import IframeResizerPlugin from '@iframe-resizer/vue'
import { createApp } from 'vue'
import KnuckleApp from './KnuckleApp.vue'
import { i18n } from './locales/schema'
import './style/index.scss'

const app = createApp(KnuckleApp)
app.use(i18n)
app.use(IframeResizerPlugin)
app.component('KnuckleFeatures', () => import('./components/knuckle/KnuckleFeatures.vue').then(m => m.default))
app.component('KnuckleHighlights', () => import('./components/knuckle/KnuckleHighlights.vue').then(m => m.default))
app.mount('#app')
