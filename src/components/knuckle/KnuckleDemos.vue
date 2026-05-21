<script setup lang="ts">
</script>

<template>
  <section class="knuckle-demos">
    <div class="demo-window">
      <div class="window-bar">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="window-title">knuckle — install</span>
      </div>
      <img
        src="/knuckle-install-demo.gif"
        alt="Knuckle installer TUI demo showing channel selection, network, sysext app store, and installation progress"
        loading="lazy"
      >
    </div>
    <div class="demo-window">
      <div class="window-bar">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="window-title">core@flatcar — first boot</span>
      </div>
      <img
        src="/knuckle-firstboot-demo.gif"
        alt="First boot after Knuckle install showing configured hostname, sysexts, and Docker running"
        loading="lazy"
      >
    </div>
  </section>
</template>

<style scoped lang="scss">
.knuckle-demos {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
}
</style>
