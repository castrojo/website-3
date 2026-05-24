<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const baseUrl = import.meta.env.BASE_URL

type Phase = 'cluster' | 'cpu' | 'storage' | 'features' | 'extensions';

const phase = ref<Phase>('cluster')
let timer: ReturnType<typeof setTimeout>

const sequence: Array<{ phase: Phase, duration: number }> = [
  { phase: 'cluster', duration: 10000 },
  { phase: 'cpu', duration: 10000 },
  { phase: 'storage', duration: 10000 },
]
let idx = 0

function cycle() {
  timer = setTimeout(() => {
    advance()
  }, sequence[idx].duration)
}

function advance() {
  clearTimeout(timer)
  idx = (idx + 1) % sequence.length
  phase.value = sequence[idx].phase
  cycle()
}

onMounted(() => cycle())
onUnmounted(() => clearTimeout(timer))

const urlMap: Record<Phase, string> = {
  cluster: 'vanguard.local/cluster',
  cpu: 'vanguard.local/nodes',
  storage: 'vanguard.local/storage',
  features: 'vanguard.local/features',
  extensions: 'vanguard.local/extensions',
}
</script>

<template>
  <section class="knuckle-demos">
    <div class="demo-window">
      <div class="browser-bar">
        <div class="browser-spacer" />
        <div class="browser-url">
          <span class="browser-url-text">{{ urlMap[phase] }}</span>
        </div>
        <button class="hb-min-btn" aria-label="Minimize" tabindex="-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <button class="hb-max-btn" aria-label="Maximize" tabindex="-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <rect x="1.5" y="1.5" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5" fill="none" />
          </svg>
        </button>
        <button class="hb-close-btn" aria-label="Close" tabindex="-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <transition name="fade" mode="out-in">
        <div :key="phase" class="img-wrap" @click="advance">
          <img
            v-if="phase === 'cluster'"
            :src="`${baseUrl}bluespeed-cluster.png`"
            alt="Bluespeed cluster overview"
          >
          <img
            v-else-if="phase === 'cpu'"
            :src="`${baseUrl}bluespeed-cpu.png`"
            alt="Bluespeed node metrics"
          >
          <img
            v-else
            :src="`${baseUrl}bluespeed-storage.png`"
            alt="Bluespeed storage"
          >
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.knuckle-demos {
  width: 100%;
}

.demo-window {
  border-radius: 12px;
  overflow: hidden;
  background: #1d1d20;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.5),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.5),
    0 20px 48px rgba(0, 0, 0, 0.3);
}

/* ── Browser chrome ── */
.browser-bar {
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 6px;
  background: #303030;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
  user-select: none;
  gap: 4px;
}

.browser-spacer {
  width: 82px;
  flex-shrink: 0;
}

.browser-url {
  flex: 1;
  display: flex;
  justify-content: center;
}

.browser-url-text {
  font-family: Cantarell, 'Noto Sans', system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 4px 20px;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Window controls ── */
.hb-min-btn,
.hb-max-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  cursor: default;
  padding: 0;
  transition:
    background 0.1s,
    color 0.1s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
  }

  svg {
    display: block;
  }
}

.hb-close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
  cursor: default;
  padding: 0;
  margin-left: 2px;
  transition:
    background 0.1s,
    color 0.1s;

  &:hover {
    background: #c01c28;
    color: #fff;
  }

  svg {
    display: block;
  }
}

/* ── Image container ── */
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #1d1d20;
  overflow: hidden;
  cursor: pointer;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
