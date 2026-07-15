<!--
  Creator Shorts: single alternating YouTube Shorts player for the Wolves landing page.
  Content-only widget: plays wolvesCreatorShorts in order, loops after the last entry, credits
  the current creator with a name + channel link (no avatars/carousel — kept intentionally lean).
-->
<script setup lang="ts">
import type { YoutubePlayer } from '@/composables/useYoutubeIframeApi'
import { onBeforeUnmount, ref, watch } from 'vue'
import { getYoutubePlayerConstructor, getYoutubePlayerState, loadYoutubeIframeApi } from '@/composables/useYoutubeIframeApi'
import { wolvesCreatorShorts } from '@/data/wolves-creator-shorts'

const currentIndex = ref(0)
const currentShort = ref(wolvesCreatorShorts[0])
const mountHost = ref<HTMLDivElement | null>(null)

let player: YoutubePlayer | undefined
let loadToken = 0

function destroyPlayer() {
  player?.destroy?.()
  player = undefined
}

function advance() {
  currentIndex.value = (currentIndex.value + 1) % wolvesCreatorShorts.length
}

async function loadCurrentShort() {
  const token = ++loadToken
  destroyPlayer()

  const short = wolvesCreatorShorts[currentIndex.value]
  currentShort.value = short

  try {
    await loadYoutubeIframeApi()
  }
  catch {
    return
  }

  if (token !== loadToken || !mountHost.value) {
    return
  }

  mountHost.value.replaceChildren()
  const mountNode = document.createElement('div')
  mountHost.value.appendChild(mountNode)

  const PlayerCtor = getYoutubePlayerConstructor()
  if (!PlayerCtor) {
    return
  }

  player = new PlayerCtor(mountNode, {
    width: '100%',
    height: '100%',
    videoId: short.videoId,
    playerVars: {
      autoplay: 1,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
    },
    events: {
      onStateChange: (event: { data: number }) => {
        if (event.data === getYoutubePlayerState().ENDED) {
          advance()
        }
      },
      onError: () => {
        // A missing/restricted short must never block the rest of the feed.
        advance()
      },
    },
  })
}

watch(currentIndex, loadCurrentShort, { immediate: true })

onBeforeUnmount(() => {
  destroyPlayer()
})
</script>

<template>
  <section class="wolves-creator-shorts">
    <div ref="mountHost" class="wolves-creator-shorts-player" />
    <p class="wolves-creator-shorts-credit font-mono">
      Now playing: <a :href="currentShort.channelUrl" target="_blank" rel="noopener noreferrer">{{ currentShort.creatorName }}</a>
    </p>
  </section>
</template>

<style scoped lang="scss">
.wolves-creator-shorts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.wolves-creator-shorts-player {
  width: 100%;
  aspect-ratio: 9 / 16;
  border-radius: 16px;
  overflow: hidden;
  background-color: #10151f;
  border: 1px solid rgba(var(--color-blue-rgb), 0.2);
}

.wolves-creator-shorts-credit {
  font-size: 1rem;
  color: #bdbdbd;

  a {
    color: var(--color-blue);
    text-decoration: underline;
  }
}
</style>
