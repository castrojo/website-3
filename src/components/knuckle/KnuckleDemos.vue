<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const phase = ref<'channels' | 'update' | 'dashboard'>('channels')
let timer: ReturnType<typeof setTimeout>
const sequence: Array<{ phase: 'channels' | 'update' | 'dashboard'; duration: number }> = [
  { phase: 'channels', duration: 12000 },
  { phase: 'update', duration: 8000 },
  { phase: 'dashboard', duration: 10000 },
]
let idx = 0

function cycle() {
  const current = sequence[idx]
  timer = setTimeout(() => {
    idx = (idx + 1) % sequence.length
    phase.value = sequence[idx].phase
    cycle()
  }, current.duration)
}

onMounted(() => cycle())
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <section class="knuckle-demos">
    <div class="demo-window">
      <div class="window-bar">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="window-title">{{ phase === 'channels' ? 'knuckle — channels' : phase === 'update' ? 'knuckle — update strategy' : 'KubeStellar — dashboard' }}</span>
      </div>
      <transition name="fade" mode="out-in">
        <img
          v-if="phase === 'channels'"
          key="channels"
          src="/knuckle-channels.gif"
          alt="Knuckle channel selector showing Stable, LTS, Beta, Alpha"
        >
        <img
          v-else-if="phase === 'update'"
          key="update"
          src="/knuckle-update.gif"
          alt="Knuckle update strategy configuration"
        >
        <img
          v-else
          key="dashboard"
          src="/kubestellar-dashboard.png"
          alt="KubeStellar dashboard"
        >
      </transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.knuckle-demos {
  width: 100%;
}

.demo-window {
  border-radius: 10px;
  overflow: hidden;
  background: #1e1e2e;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

.window-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: #313244;
  user-select: none;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.red { background: #f38ba8; }
  &.yellow { background: #f9e2af; }
  &.green { background: #a6e3a1; }
}

.window-title {
  margin-left: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #cdd6f4;
  opacity: 0.7;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  transition: opacity 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
