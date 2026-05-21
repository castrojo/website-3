<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const phase = ref<'install' | 'dashboard'>('install')
let timer: ReturnType<typeof setTimeout>

function cycle() {
  const delay = phase.value === 'install' ? 15000 : 10000
  timer = setTimeout(() => {
    phase.value = phase.value === 'install' ? 'dashboard' : 'install'
    cycle()
  }, delay)
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
        <span class="window-title">{{ phase === 'install' ? 'knuckle — install' : 'KubeStellar — dashboard' }}</span>
      </div>
      <transition name="fade" mode="out-in">
        <img
          v-if="phase === 'install'"
          key="install"
          src="/knuckle-install-demo.gif"
          alt="Knuckle installer TUI demo"
        >
        <img
          v-else
          key="dashboard"
          src="/kubestellar-dashboard.png"
          alt="KubeStellar dashboard UI"
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
