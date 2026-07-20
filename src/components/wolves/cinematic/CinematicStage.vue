<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useDualBufferPlayer } from '@/composables/useDualBufferPlayer'
import { getWolvesHudLabel } from '@/data/wolves-thesis-sequence'
import { useCinematicStore, WOLVES_EXPERIENCE } from '@/stores/cinematic'
import CinematicCaptions from './CinematicCaptions.vue'
import CinematicTransition from './CinematicTransition.vue'
import Nameplate from './Nameplate.vue'
import TheaterExperience from './TheaterExperience.vue'
import WolvesOrgAds from './WolvesOrgAds.vue'

const store = useCinematicStore()
const hostA = ref<HTMLElement | null>(null)
const hostB = ref<HTMLElement | null>(null)

const player = useDualBufferPlayer({ hostA, hostB })

const isTrackZero = computed(() => store.segment.trackZeroExperience === true)
const isWolvesExperience = computed(() => store.experienceId === WOLVES_EXPERIENCE.id)

// The plate is the single title placard on every segment. During the seven-days
// segment the time-varying incoming signal is the large label and the track title
// sits in the detail line; elsewhere it shows chapter + title.
const plateLabel = computed(() =>
  isTrackZero.value ? getWolvesHudLabel(store.nativeTime) : store.segment.title,
)
const plateDetail = computed(() =>
  isTrackZero.value ? 'Seven Days to the Wolves' : store.segment.chapter,
)

onBeforeUnmount(() => player.destroy())

defineExpose({
  prepare: player.prepare,
  start: player.start,
  togglePlay: player.togglePlay,
  seekTo: player.seekTo,
  seekToRatio: player.seekToRatio,
  skip: player.skip,
  destroy: player.destroy,
})
</script>

<template>
  <div class="wc-stage">
    <!-- Both mounted instances are compact, invisible audio transports. `activeSide`
         still drives the audio handoff; the theater layer owns all visible content. -->
    <div
      class="wc-layer"
      :class="{ 'wc-layer--active': player.activeSide.value === 'a' }"
      :style="{ transitionDuration: `${store.crossfadeMsAt(store.segmentIndex)}ms` }"
    >
      <div ref="hostA" class="wc-iframe-host" />
    </div>
    <div
      class="wc-layer"
      :class="{ 'wc-layer--active': player.activeSide.value === 'b' }"
      :style="{ transitionDuration: `${store.crossfadeMsAt(store.segmentIndex)}ms` }"
    >
      <div ref="hostB" class="wc-iframe-host" />
    </div>

    <!-- Authored theater layer over the audio-source video: the 7 Days grid
         (slideshow + lore + thesis) and the later-part CNCF galleries. -->
    <TheaterExperience v-if="isWolvesExperience" />

    <WolvesOrgAds v-if="isWolvesExperience" />

    <div class="wc-stage-nameplate">
      <Nameplate :detail="plateDetail" :label="plateLabel" :slow-fade="isTrackZero" />
    </div>

    <CinematicCaptions />

    <CinematicTransition />
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
  // Cinematic content owns the visible theater; these YouTube instances are
  // audio transports only. Keep them mounted and playing, but out of the
  // viewport so native chrome can never expand into the composition.
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 2px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.wc-iframe-host,
.wc-iframe-host :deep(iframe) {
  position: absolute;
  inset: 0;
  width: 2px;
  height: 2px;
  border: 0;
}

.wc-stage-nameplate {
  position: absolute;
  top: 3rem;
  left: 3rem;
  width: calc(100% - 6rem);
  z-index: 20;
  pointer-events: none;
}

.wc-stage-nameplate :deep(.wc-nameplate) {
  width: 100%;
}
</style>
