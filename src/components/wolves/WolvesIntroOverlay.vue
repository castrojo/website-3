<script setup lang="ts">
import type { IntroVideoSpec } from '@/data/wolves-intro-sequence'
import { computed, nextTick, ref, watch } from 'vue'
import { activeOverlayText, advanceIntroSequence, createIntroSequenceState, skipIntroSequence } from '@/data/wolves-intro-sequence'

const props = defineProps<{
  videos: readonly IntroVideoSpec[]
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const sequenceState = ref(createIntroSequenceState())
const currentTime = ref(0)
const videoEl = ref<HTMLVideoElement | null>(null)

const currentVideo = computed<IntroVideoSpec | undefined>(() => props.videos[sequenceState.value.index])
const overlayText = computed(() => activeOverlayText(currentVideo.value?.overlays, currentTime.value))

watch(() => sequenceState.value.done, (done) => {
  if (done) {
    emit('complete')
  }
})

watch(currentVideo, () => {
  currentTime.value = 0
  // Unmuted autoplay relies on this component only ever mounting as a direct result of the
  // "Start Experience" click (a real user gesture); browsers permit unmuted playback shortly
  // after such a gesture. If a browser still blocks it, playback fails silently here and the
  // visible Skip control (plus `ended`/`error` handlers) still let the sequence proceed.
  void nextTick(() => {
    videoEl.value?.play?.().catch(() => {
      // Autoplay can be blocked by the browser; the visible Skip control still lets the
      // viewer proceed, and `ended`/`error` handlers advance the sequence normally otherwise.
    })
  })
})

function handleEnded() {
  sequenceState.value = advanceIntroSequence(sequenceState.value, props.videos.length)
}

function handleError() {
  // A missing or broken render must never block the live experience.
  sequenceState.value = advanceIntroSequence(sequenceState.value, props.videos.length)
}

function handleTimeUpdate() {
  currentTime.value = videoEl.value?.currentTime ?? 0
}

function handleSkip() {
  sequenceState.value = skipIntroSequence(sequenceState.value)
}
</script>

<template>
  <div v-if="currentVideo && !sequenceState.done" class="wolves-intro-overlay">
    <video
      ref="videoEl"
      class="wolves-intro-overlay-video"
      :src="currentVideo.src"
      autoplay
      playsinline
      @ended="handleEnded"
      @error="handleError"
      @timeupdate="handleTimeUpdate"
    />

    <p v-if="overlayText" class="wolves-intro-overlay-text font-mono">
      {{ overlayText }}
    </p>

    <button
      type="button"
      class="wolves-intro-overlay-skip"
      aria-label="Skip intro"
      @click="handleSkip"
    >
      Skip
    </button>
  </div>
</template>

<style scoped>
.wolves-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.wolves-intro-overlay-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wolves-intro-overlay-text {
  position: absolute;
  left: 5%;
  bottom: 12%;
  right: 5%;
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(1rem, 2.4vw, 1.75rem);
  text-shadow: 0 2px 12px rgb(0 0 0 / 80%);
}

.wolves-intro-overlay-skip {
  position: absolute;
  top: 5%;
  right: 5%;
  padding: 0.5rem 1rem;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 999px;
  background: rgb(0 0 0 / 40%);
  color: #f5f5f5;
  font-size: 0.9rem;
  cursor: pointer;
}

.wolves-intro-overlay-skip:hover {
  background: rgb(0 0 0 / 65%);
}
</style>
