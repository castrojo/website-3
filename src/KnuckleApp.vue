<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'
import KnuckleDownloadCard from './components/knuckle/KnuckleDownloadCard.vue'
import KnuckleHighlights from './components/knuckle/KnuckleHighlights.vue'
import KnuckleScene from './components/knuckle/KnuckleScene.vue'
import KnuckleVersionChips from './components/knuckle/KnuckleVersionChips.vue'
import PageLoading from './components/PageLoading.vue'
import TopNavbar from './components/TopNavbar.vue'
import { setLocale } from './composables/useLocale'
import { i18n } from './locales/schema'

const visibleSection = ref<string>('')
provide('visibleSection', visibleSection)

const isLoading = ref(true)
onBeforeMount(() => {
  const img = new Image()
  img.src = '/characters/karl.webp'
  img.onload = () => setTimeout(() => {
    isLoading.value = false
  }, 100)
  img.onerror = () => {
    isLoading.value = false
  }
})

const urlParams = new URLSearchParams(window.location.search)
const currentLocale = urlParams.get('lang') || window.navigator.language
if (i18n.global.availableLocales.includes(currentLocale)) {
  setLocale(currentLocale)
}
</script>

<template>
  <main class="knuckle-page">
    <PageLoading v-if="isLoading" />
    <TopNavbar v-show="!isLoading" />

    <div v-show="!isLoading" class="knuckle-layout">
      <!-- Karl on the right, head above the right column -->
      <img
        class="karl"
        src="/characters/karl.webp"
        alt="Amargasaurus"
        fetchpriority="high"
        aria-hidden="true"
      >

      <!-- Left glass column: hero text + feature cards -->
      <div class="col-left">
        <KnuckleScene />
        <KnuckleHighlights />
      </div>

      <!-- Right glass column: streams prominent at top, downloads at bottom -->
      <div class="col-right">
        <KnuckleVersionChips />
        <KnuckleDownloadCard />
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.knuckle-page {
  min-height: 100vh;
  background-image: url('/evening/august-night.webp');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  overflow: hidden;
}

.knuckle-layout {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding: 48px 60px 32px;
  gap: 32px;
  min-height: calc(100vh - 60px);

  @media (min-aspect-ratio: 16/10) and (min-width: 1024px) {
    height: calc(100vh - 60px);
  }

  @media (max-aspect-ratio: 16/10), (max-width: 1023px) {
    flex-direction: column;
    align-items: stretch;
    padding: 32px 32px 48px;
    gap: 24px;
  }

  @media (max-width: 600px) {
    padding: 24px 16px 48px;
    gap: 24px;
  }
}

// Karl: right side, original orientation (faces left, towards content)
.karl {
  position: absolute;
  top: 4px;
  right: 0;
  height: 95vh;
  width: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 0 40px rgba(var(--color-blue-rgb), 0.3));

  @media (max-aspect-ratio: 16/10), (max-width: 1023px) {
    height: 35vw;
    top: auto;
    bottom: -5%;
    right: 0;
    transform: none;
    opacity: 0.35;
    z-index: 0;
  }

  @media (max-width: 767px) {
    display: none;
  }
}

// Both columns share the same glass styling
%col-glass {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: rgba(var(--color-bg-rgb), 0.55);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 20px 24px;
  box-sizing: border-box;
}

// Left: hero text + feature cards, bottom-aligned
.col-left {
  @extend %col-glass;
  justify-content: flex-start;
  gap: 12px;
}

// Right: streams at top, download at bottom
.col-right {
  @extend %col-glass;
  justify-content: space-between;
  overflow-y: auto;
}
</style>
