<script setup lang="ts">
import type { WolvesChapter } from '@/data/wolves-story'

const props = defineProps<{
  chapter: WolvesChapter | undefined
  playing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:playing', playing: boolean): void
}>()

const playlistUrl = 'https://www.youtube.com/playlist?list=PLA78oiE-RGAE'
const embedUrl = 'https://www.youtube.com/embed/videoseries?list=PLA78oiE-RGAE&autoplay=1&rel=0'

function togglePlay() {
  emit('update:playing', !props.playing)
}
</script>

<template>
  <div class="sidebar-soundtrack-card now-playing-bar">
    <div class="thumbnail-wrapper">
      <div class="thumbnail-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor" class="music-icon">
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </svg>
      </div>
    </div>

    <div class="info-zone">
      <span class="label font-mono">RELEASE SOUNDTRACK TO HUNT BY</span>
      <a
        :href="playlistUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="playlist-title"
      >
        Bluefin: Seven Days to the Wolves
      </a>
      <div class="active-track font-mono text-gray">
        Track: <span class="track-name text-cyan">{{ chapter ? chapter.soundtrackLabel : 'Seven Days to the Wolves' }}</span>
      </div>
    </div>

    <div class="video-wrapper">
      <button
        class="play-button"
        :class="{ 'is-playing': playing }"
        :aria-label="playing ? 'Pause soundtrack' : 'Play soundtrack'"
        type="button"
        @click="togglePlay"
      >
        <span class="play-icon">
          <svg v-if="playing" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    </div>

    <!-- Hidden iframe loads YouTube video series when playing is true -->
    <div v-if="playing" class="hidden-player-container">
      <iframe
        :src="embedUrl"
        title="Wolves soundtrack player"
        allow="autoplay; encrypted-media"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-soundtrack-card.now-playing-bar {
  background-color: #10151f;
  border: 1px solid #272727;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(66, 133, 244, 0.4);
  }
}

.thumbnail-wrapper {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  background-color: #0c1016;
  border: 1px solid #272727;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888;
}

.music-icon {
  width: 24px;
  height: 24px;
}

.info-zone {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  .label {
    font-size: 0.7rem;
    font-weight: bold;
    letter-spacing: 0.1em;
    color: var(--color-blue, #4285f4);
    text-transform: uppercase;
  }

  .playlist-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #ffffff;
    text-decoration: none;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: var(--color-blue-light, #66b3ff);
    }
  }

  .active-track {
    font-size: 0.75rem;
    color: #888888;
    margin-top: 2px;

    .track-name {
      font-weight: bold;
      color: var(--color-blue-light, #66b3ff);
    }
  }
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.text-gray {
  color: #888888;
}

.video-wrapper {
  flex-shrink: 0;
}

.play-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--color-blue, #4285f4);
  background-color: transparent;
  color: var(--color-blue-light, #66b3ff);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 10px rgba(66, 133, 244, 0.2);
  padding: 0;

  &:hover {
    background-color: var(--color-blue, #4285f4);
    color: #ffffff;
    box-shadow: 0 0 16px rgba(66, 133, 244, 0.4);
    transform: scale(1.05);
  }

  &.is-playing {
    border-color: #27c93f;
    color: #27c93f;
    box-shadow: 0 0 10px rgba(39, 201, 63, 0.2);

    &:hover {
      background-color: #27c93f;
      color: #0c1016;
      box-shadow: 0 0 16px rgba(39, 201, 63, 0.4);
    }
  }
}

.play-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden-player-container {
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  position: absolute;

  iframe {
    width: 1px;
    height: 1px;
    border: none;
  }
}
</style>
