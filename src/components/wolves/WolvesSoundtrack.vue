<script setup lang="ts">
import type { WolvesChapter } from '@/data/wolves-story'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import playlistData from '@/data/wolves-playlist.json'

const props = defineProps<{
  chapter: WolvesChapter | undefined
  playing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:playing', playing: boolean): void
}>()

interface SoundtrackProviderConfig {
  id: 'youtube' | 'spotify' | 'other'
  playlistId: string
  playlistUrl: string
  musicUrl: string
  spotifyUri?: string
}

interface SoundtrackTrack {
  title: string
  artist: string
  videoId?: string
  artwork: string
}

const provider = playlistData.provider as SoundtrackProviderConfig
const tracks = playlistData.tracks as SoundtrackTrack[]
const currentTrackIndex = ref(0)
const activeTrack = computed(() => tracks[currentTrackIndex.value] ?? tracks[0])

const mobileBreakpointQuery = '(max-width: 767px)'
const isMobileViewport = ref(false)
const isCompactMobilePlayer = computed(() => props.playing && isMobileViewport.value)
let viewportMediaQuery: MediaQueryList | null = null
let removeViewportListener: (() => void) | null = null

let player: any = null
const hasInitializedPlayer = ref(false)
const isPlayerReady = ref(false)
const isLoadingPlayer = ref(false)

function loadYtApi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || (typeof process !== 'undefined' && process.env.NODE_ENV === 'test')) {
      ;(window as any).YT = {
        Player: class {
          constructor(_id: string, config: any) {
            setTimeout(() => {
              if (config.events && typeof config.events.onReady === 'function') {
                config.events.onReady()
              }
            }, 0)
          }

          playVideo() {}
          pauseVideo() {}
          getPlaylistIndex() { return 0 }
          destroy() {}
        },
      }
      resolve()
      return
    }

    if ((window as any).YT?.Player) {
      resolve()
      return
    }

    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    if (existing) {
      const prevReady = (window as any).onYouTubeIframeAPIReady
      ;(window as any).onYouTubeIframeAPIReady = () => {
        prevReady?.()
        resolve()
      }
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)

    const prevReady = (window as any).onYouTubeIframeAPIReady
    ;(window as any).onYouTubeIframeAPIReady = () => {
      prevReady?.()
      resolve()
    }
  })
}

function syncCurrentTrackIndex() {
  if (!player || typeof player.getPlaylistIndex !== 'function') {
    return
  }
  const index = player.getPlaylistIndex()
  if (typeof index === 'number' && index >= 0 && index < tracks.length) {
    currentTrackIndex.value = index
  }
}

function syncFloatingPlayerState() {
  if (typeof document === 'undefined') {
    return
  }
  document.body.classList.toggle('wolves-player-active', isCompactMobilePlayer.value)
}

function updateViewportState(matches?: boolean) {
  if (typeof window === 'undefined') {
    return
  }
  isMobileViewport.value = matches ?? viewportMediaQuery?.matches ?? window.innerWidth <= 767
}

function initViewportObserver() {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.matchMedia === 'function') {
    viewportMediaQuery = window.matchMedia(mobileBreakpointQuery)
    const handleChange = (event: MediaQueryListEvent) => updateViewportState(event.matches)
    updateViewportState(viewportMediaQuery.matches)
    if (typeof viewportMediaQuery.addEventListener === 'function') {
      viewportMediaQuery.addEventListener('change', handleChange)
      removeViewportListener = () => viewportMediaQuery?.removeEventListener('change', handleChange)
      return
    }
    viewportMediaQuery.addListener(handleChange)
    removeViewportListener = () => viewportMediaQuery?.removeListener(handleChange)
    return
  }

  const handleResize = () => updateViewportState()
  window.addEventListener('resize', handleResize)
  removeViewportListener = () => window.removeEventListener('resize', handleResize)
}

async function ensurePlayerInitialized() {
  if (hasInitializedPlayer.value || isLoadingPlayer.value) {
    return
  }

  isLoadingPlayer.value = true
  await loadYtApi()

  player = new (window as any).YT.Player('wolves-yt-player', {
    height: '200',
    width: '200',
    videoId: '',
    playerVars: {
      listType: 'playlist',
      list: provider.playlistId,
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      rel: 0,
      iv_load_policy: 3,
    },
    events: {
      onReady: () => {
        hasInitializedPlayer.value = true
        isLoadingPlayer.value = false
        isPlayerReady.value = true
        if (props.playing && typeof player.playVideo === 'function') {
          player.playVideo()
        }
        syncCurrentTrackIndex()
      },
      onStateChange: (event: any) => {
        if (event.data === 1) {
          if (!props.playing) {
            emit('update:playing', true)
          }
          syncCurrentTrackIndex()
          return
        }
        if (props.playing && (event.data === 2 || event.data === 0)) {
          emit('update:playing', false)
        }
        syncCurrentTrackIndex()
      },
    },
  })
}

async function togglePlay() {
  const nextPlaying = !props.playing
  emit('update:playing', nextPlaying)

  if (nextPlaying) {
    await ensurePlayerInitialized()
  }
}

watch(() => props.playing, async (playing) => {
  if (playing) {
    await ensurePlayerInitialized()
    if (player && isPlayerReady.value && typeof player.playVideo === 'function') {
      player.playVideo()
    }
    return
  }

  if (player && isPlayerReady.value && typeof player.pauseVideo === 'function') {
    player.pauseVideo()
  }
})

watch(isCompactMobilePlayer, () => {
  syncFloatingPlayerState()
}, { immediate: true })

onMounted(() => {
  initViewportObserver()
})

onBeforeUnmount(() => {
  removeViewportListener?.()
  removeViewportListener = null
  viewportMediaQuery = null
  document.body.classList.remove('wolves-player-active')
  if (player && typeof player.destroy === 'function') {
    player.destroy()
    player = null
  }
})
</script>

<template>
  <div
    class="sidebar-soundtrack-card now-playing-bar"
    :class="{ 'is-mobile-compact': isCompactMobilePlayer }"
  >
    <div class="meta-panel-grid">
      <div class="meta-panel-left">
        <div class="player-top-row">
          <div class="thumbnail-wrapper" :class="{ 'is-playing-pulse': playing }">
            <img
              :src="activeTrack.artwork"
              class="artwork-img"
              :alt="`${activeTrack.title} artwork`"
            >
          </div>

          <div class="info-zone">
            <span class="label font-mono">RELEASE SOUNDTRACK TO HUNT BY</span>
            <a
              :href="provider.playlistUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="playlist-title"
            >
              {{ activeTrack.title }}
            </a>
            <div class="active-track font-mono text-gray">
              Artist: <span class="track-name text-cyan">{{ activeTrack.artist }}</span>
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
        </div>

        <div class="telemetry-commentary font-mono">
          <div class="telemetry-header">
            <span class="telemetry-label text-cyan">PLAYBACK_APPROACH //</span> YOUTUBE_MUSIC_READY
          </div>
          <p class="telemetry-text">
            Sign in to YouTube Music before playback to use your account context. Ad-free playback depends on YouTube Premium.
          </p>
          <a
            class="youtube-music-link"
            :href="provider.musicUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in YouTube Music
          </a>
        </div>
      </div>
    </div>

    <div class="hidden-player-container">
      <div id="wolves-yt-player" />
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
  flex-direction: column;
  align-items: stretch;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(66, 133, 244, 0.4);
  }
}

.meta-panel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;
}

.meta-panel-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.player-top-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
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
  overflow: hidden;
  transition: transform 0.5s ease;

  &.is-playing-pulse {
    animation: thumb-pulse 3s infinite ease-in-out;
  }
}

.artwork-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-zone {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
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

    .track-name {
      font-weight: bold;
      color: #38bdf8;
    }
  }
}

.telemetry-commentary {
  background-color: #090d16;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.72rem;
  line-height: 1.4;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #94a3b8;

  .telemetry-header {
    font-weight: 700;
    font-size: 0.68rem;
    color: #38bdf8;
  }

  .telemetry-text {
    margin: 0;
  }
}

.youtube-music-link {
  color: var(--color-blue-light);
  text-decoration: underline;
  text-underline-offset: 3px;
  width: fit-content;
}

.youtube-music-link:hover {
  color: #ffffff;
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
  position: absolute;
  width: 200px;
  height: 200px;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  top: -9999px;
  left: -9999px;
}

@keyframes thumb-pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(56, 189, 248, 0);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  }
}

@media (max-width: 767px) {
  .sidebar-soundtrack-card.now-playing-bar.is-mobile-compact {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    z-index: 40;
    padding: 12px;
    border-radius: 14px;
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.45);

    .player-top-row {
      gap: 12px;
    }

    .thumbnail-wrapper {
      width: 48px;
      height: 48px;
    }

    .info-zone {
      gap: 0;

      .label {
        font-size: 0.62rem;
      }

      .playlist-title {
        font-size: 0.9rem;
      }
    }

    .telemetry-commentary {
      display: none;
    }
  }
}
</style>
