<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useDualBufferPlayer } from '@/composables/useDualBufferPlayer'
import { segmentCrossfadeMs } from '@/config/wolves-cinematic'
import { useCinematicStore } from '@/stores/cinematic'
import CinematicCaptions from './CinematicCaptions.vue'
import Nameplate from './Nameplate.vue'

const props = defineProps<{
  /** False when Spotify supplies the soundtrack (YouTube stays muted). */
  audioEnabled: boolean
}>()

const store = useCinematicStore()
const hostA = ref<HTMLElement | null>(null)
const hostB = ref<HTMLElement | null>(null)

const player = useDualBufferPlayer({ hostA, hostB, audioEnabled: props.audioEnabled })

onBeforeUnmount(() => player.destroy())

defineExpose({
  start: player.start,
  togglePlay: player.togglePlay,
  seekTo: player.seekTo,
})
</script>

<template>
  <div class="wc-stage">
    <!--
      The visual crossfade is pure CSS: `activeSide` flips the opacity of the two
      layers, transitioned over the segment's crossfade window. The inactive layer
      keeps preloading beneath at opacity 0 / pointer-events none.
    -->
    <div
      class="wc-layer"
      :class="{ 'wc-layer--active': player.activeSide.value === 'a' }"
      :style="{ transitionDuration: `${segmentCrossfadeMs(store.segmentIndex)}ms` }"
    >
      <div ref="hostA" class="wc-iframe-host" />
    </div>
    <div
      class="wc-layer"
      :class="{ 'wc-layer--active': player.activeSide.value === 'b' }"
      :style="{ transitionDuration: `${segmentCrossfadeMs(store.segmentIndex)}ms` }"
    >
      <div ref="hostB" class="wc-iframe-host" />
    </div>

    <!--
      Transparent shield over both iframes: blocks every YouTube-native interaction
      (title link, watch-later, pause overlays) and redirects clicks to the app's
      own play/pause so the experience never leaves the cinematic frame.
    -->
    <button
      class="wc-shield"
      type="button"
      :aria-label="store.playing ? 'Pause' : 'Play'"
      @click="player.togglePlay"
    />

    <!--
      YouTube paints its own chrome (video title, related videos, logo) whenever a
      video is paused; controls=0 cannot remove it. This veil covers the frame in
      any non-playing state so that chrome is never visible.
    -->
    <Transition name="wc-veil">
      <div v-if="!store.playing" class="wc-veil">
        <button class="wc-control wc-veil-play" type="button" aria-label="Play" @click="player.togglePlay">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </button>
      </div>
    </Transition>

    <div class="wc-stage-nameplate">
      <Nameplate :detail="store.segment.chapter" :label="store.segment.title" />
    </div>

    <CinematicCaptions />
  </div>
</template>

<style scoped lang="scss">
.wc-stage {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--wc-bg);
}

.wc-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition-property: opacity;
  transition-timing-function: ease;
}

.wc-layer--active {
  opacity: 1;
}

.wc-iframe-host,
.wc-iframe-host :deep(iframe) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.wc-shield {
  position: absolute;
  inset: 0;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.wc-veil {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(8 9 12 / 92%);
}

.wc-veil-play {
  width: 6.4rem;
  height: 6.4rem;
}

.wc-veil-enter-active,
.wc-veil-leave-active {
  transition: opacity 0.25s ease;
}

.wc-veil-enter-from,
.wc-veil-leave-to {
  opacity: 0;
}

.wc-stage-nameplate {
  position: absolute;
  top: 3rem;
  left: 3rem;
  pointer-events: none;
}
</style>
