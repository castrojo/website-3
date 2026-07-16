<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  containerClass?: string
  previousButtonClass?: string
  nextButtonClass?: string
  playButtonClass?: string
  previousAriaLabel?: string
  nextAriaLabel?: string
  playAriaLabel?: string
  pauseAriaLabel?: string
  showPrevious?: boolean
  showNext?: boolean
  showPlayPause?: boolean
  canGoPrevious?: boolean
  canGoNext?: boolean
  isPlaying?: boolean
  playDisabled?: boolean
}>(), {
  containerClass: '',
  previousButtonClass: '',
  nextButtonClass: '',
  playButtonClass: '',
  previousAriaLabel: 'Previous',
  nextAriaLabel: 'Next',
  playAriaLabel: 'Play',
  pauseAriaLabel: 'Pause',
  showPrevious: true,
  showNext: true,
  showPlayPause: true,
  canGoPrevious: true,
  canGoNext: true,
  isPlaying: false,
  playDisabled: false,
})

const emit = defineEmits<{
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'toggle'): void
}>()

const previousButtonClasses = computed(() => ['prev', props.previousButtonClass].filter(Boolean))
const nextButtonClasses = computed(() => ['next', props.nextButtonClass].filter(Boolean))
const playButtonClasses = computed(() => ['play-pause', props.playButtonClass].filter(Boolean))
</script>

<template>
  <div class="wolves-control-bar" :class="props.containerClass">
    <button
      v-if="props.showPrevious"
      type="button"
      class="wolves-control-button"
      :class="previousButtonClasses"
      :aria-label="props.previousAriaLabel"
      :disabled="!props.canGoPrevious"
      @click="emit('previous')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 6h2v12H6zm3 6 9 6V6z" /></svg>
    </button>

    <button
      v-if="props.showPlayPause"
      type="button"
      class="wolves-control-button"
      :class="playButtonClasses"
      :aria-label="props.isPlaying ? props.pauseAriaLabel : props.playAriaLabel"
      :disabled="props.playDisabled"
      @click="emit('toggle')"
    >
      <svg v-if="props.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
      <svg v-else class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    </button>

    <button
      v-if="props.showNext"
      type="button"
      class="wolves-control-button"
      :class="nextButtonClasses"
      :aria-label="props.nextAriaLabel"
      :disabled="!props.canGoNext"
      @click="emit('next')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 6h2v12h-2zm-1 6-9 6V6z" /></svg>
    </button>
  </div>
</template>

<style scoped>
.wolves-control-bar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wolves-control-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 999px;
  background: rgb(0 0 0 / 40%);
  color: #f5f5f5;
  cursor: pointer;
}

.wolves-control-button.play-pause {
  width: 3rem;
  height: 3rem;
}

.wolves-control-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.wolves-control-button:disabled {
  opacity: 0.35;
  cursor: default;
}
</style>
