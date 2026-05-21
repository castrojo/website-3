<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'
import KnuckleDownloadCard from './components/knuckle/KnuckleDownloadCard.vue'
import KnuckleFeatures from './components/knuckle/KnuckleFeatures.vue'
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

      <!-- Left side: two stacked glass boxes -->
      <div class="col-left-stack">
        <div class="col-left">
          <KnuckleScene />
          <KnuckleHighlights />
        </div>
        <div class="col-features">
          <KnuckleFeatures />
        </div>
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
  background: none;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url('/evening/august-night.webp');
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    transform: scaleX(-1);
    z-index: 0;
  }
}

.knuckle-layout {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 24px 48px 16px;
  gap: 16px;

  @media (max-width: 1023px) {
    flex-direction: column;
    align-items: stretch;
    padding: 24px 24px 32px;
  }

  @media (max-width: 600px) {
    padding: 16px 12px 32px;
  }
}

.col-left-stack {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

// Karl: right side, original orientation (faces left, towards content)
.karl {
  position: fixed;
  top: 64px;
  right: 0;
  height: 95vh;
  width: auto;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 0 40px rgba(var(--color-blue-rgb), 0.3));

  @media (max-width: 1023px) {
    display: none;
  }
}

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
  padding: 12px 16px;
  box-sizing: border-box;
}

.col-left {
  @extend %col-glass;
  justify-content: flex-start;
  gap: 8px;
}

.col-features {
  @extend %col-glass;
}

// Right column: pushed down so Karl's head shows above it, sticky so it stays visible on scroll
.col-right {
  @extend %col-glass;
  flex: 0 0 auto;
  width: calc(50% - 8px);
  justify-content: space-between;
  overflow-y: auto;
  position: sticky;
  top: 80px;
  margin-top: calc(35vh + 60px);
  max-height: calc(100vh - 96px);
}
</style>
