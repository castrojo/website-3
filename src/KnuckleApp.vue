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

      <!-- Right side: version/download box + mission statement below -->
      <div class="col-right-stack">
        <div class="col-right">
          <KnuckleVersionChips />
          <KnuckleDownloadCard />
        </div>
        <blockquote class="quote-box">
          <p class="quote-label">Mission:</p>
          <p>Bring the best of the <a href="https://landscape.cncf.io" target="_blank" rel="noopener noreferrer">CNCF tech stack</a> to enthusiasts. We strive to build a <a href="https://architectures.cncf.io" target="_blank" rel="noopener noreferrer">reference architecture</a> for how best to use this for home projects with the same powerful tools and velocity that the world's <a href="https://www.cncf.io/enduser/" target="_blank" rel="noopener noreferrer">top tier organizations</a> use. Also, there is a 3-ton <em>Amargasaurus cazaui</em> chasing us.<br><br>This is our contribution to training the next generation. Thanks for joining us.</p>
          <div class="quote-signatories">
            <a class="signatory" href="https://github.com/clubanderson" target="_blank" rel="noopener noreferrer">
              <img src="https://github.com/clubanderson.png" alt="Andy Anderson" />
              <span>Andy Anderson</span>
            </a>
            <a class="signatory" href="https://github.com/castrojo" target="_blank" rel="noopener noreferrer">
              <img src="https://github.com/castrojo.png" alt="Jorge Castro" />
              <span>Jorge Castro</span>
            </a>
          </div>
        </blockquote>
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

// Right side wrapper: sticky, pushed down for dino head effect
.col-right-stack {
  flex: 0 0 auto;
  width: calc(50% - 8px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 80px;
  margin-top: calc(35vh + 60px);
}

.col-right {
  @extend %col-glass;
  justify-content: space-between;
  overflow-y: auto;
  max-height: calc(100vh - 96px);
}

.quote-box {
  @extend %col-glass;
  margin: 0;
  border-left: 3px solid rgba(var(--color-blue-rgb), 0.5);
  gap: 10px;

  .quote-label {
    font-size: 1.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text);
    opacity: 0.5;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 1.6rem;
    line-height: 1.6;
    color: var(--color-text-light);
    opacity: 0.85;
    font-style: italic;

    a {
      color: var(--color-text-light);
      text-decoration: underline;
      text-underline-offset: 2px;
      opacity: 0.9;
      &:hover { opacity: 1; }
    }
  }

  .quote-signatories {
    display: flex;
    gap: 16px;
    margin-top: 4px;
    flex-wrap: wrap;
  }

  .signatory {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.15s;

    &:hover { opacity: 1; }

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid rgba(var(--color-blue-rgb), 0.3);
    }

    span {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--color-text-light);
    }
  }
}
</style>
