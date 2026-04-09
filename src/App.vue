<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'

import Navigation from './components/Navigation.vue'
import PageLoading from './components/PageLoading.vue'
import SceneDevelopers from './components/scenes/SceneDevelopers.vue'
import SceneLanding from './components/scenes/SceneLanding.vue'
import SceneUsers from './components/scenes/SceneUsers.vue'
import ParallaxWrapper from './components/sections/ParallaxWrapper.vue'
import SectionBazaar from './components/sections/SectionBazaar.vue'
import SectionCommunity from './components/sections/SectionCommunity.vue'
import SectionFooter from './components/sections/SectionFooter.vue'
import SectionMission from './components/sections/SectionMission.vue'
import SectionNews from './components/sections/SectionNews.vue'
import SectionPicker from './components/sections/SectionPicker.vue'
import SectionVideo from './components/sections/SectionVideo.vue'
import TopNavbar from './components/TopNavbar.vue'

// Locale is resolved and set before mount by main.ts → initI18n().
// App.vue no longer needs to re-apply locale logic at component setup time.

const visibleSection = ref<string>('')
provide('visibleSection', visibleSection)

// Preload only above-fold character images (critical for LCP).
// Parallax layers (evening/*.webp, mobile-parallax.webp) are decorative and
// loaded by the CSS/parallax layer — do not block initial paint on them.
const characterImages = [
  './characters/angry.webp',
  './characters/bluefin-small.webp',
  './characters/devs.webp',
  './characters/nest.webp'
]

const isLoading = ref(true)
onBeforeMount(() => {
  Promise.all(
    characterImages.map((link) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = link
        img.onload = resolve
        img.onerror = resolve // don't block if an image fails to load
      })
    })
  ).finally(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 100)
  })
})
</script>

<template>
  <main>
    <PageLoading v-if="isLoading" />
    <TopNavbar v-show="!isLoading" />
    <div v-show="!isLoading">
      <ParallaxWrapper>
        <SceneLanding />
        <SceneUsers />
        <SceneDevelopers />
      </ParallaxWrapper>
      <SectionMission />
      <SectionVideo />
      <SectionBazaar />
      <SectionPicker />
      <SectionCommunity />
      <SectionNews />
      <SectionFooter />
      <Navigation />
    </div>
  </main>
</template>
