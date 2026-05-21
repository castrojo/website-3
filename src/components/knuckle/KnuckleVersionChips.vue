<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface StreamData {
  version: string
  buildDate: string
  kernel: string
  systemd: string
  docker: string
  containerd: string
  ignition: string
  etcd: string
}

interface KnuckleVersions {
  generatedAt: string
  knuckleVersion: string
  streams: Record<string, StreamData>
}

const STREAM_LABELS: Record<string, string> = {
  beta: 'Beta',
  lts: 'LTS',
  stable: 'Stable',
  alpha: 'Alpha',
}

const STREAM_ORDER = ['stable', 'beta', 'lts', 'alpha']

const RECOMMENDED = new Set(['stable'])

const data = ref<KnuckleVersions | null>(null)

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}knuckle-versions.json`)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    data.value = await res.json()
  }
  catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[KnuckleVersionChips] failed to load versions', e)
    }
  }
})
</script>

<template>
  <div v-if="data" class="streams-wrap">
    <div class="streams-header">
      Flatcar Release Streams
    </div>
    <div class="streams-subhead">
      Every stream ships the real Flatcar. You configure which one during installation.
    </div>
    <div class="streams-grid">
      <div
        v-for="key in STREAM_ORDER"
        :key="key"
        class="stream-card"
        :class="[`stream-${key}`, { 'stream-recommended': RECOMMENDED.has(key) }]"
      >
        <div class="stream-top">
          <span class="stream-badge">{{ STREAM_LABELS[key] }}</span>
          <span v-if="RECOMMENDED.has(key)" class="recommended-badge">Recommended</span>
          <span class="stream-version">{{ data.streams[key]?.version ?? '—' }}</span>
        </div>
        <div v-if="data.streams[key]?.buildDate" class="stream-date">
          {{ data.streams[key].buildDate }}
        </div>
        <div v-if="data.streams[key]?.kernel" class="stream-chips">
          <span class="chip">
            <span class="chip-k">Kernel</span>
            <span class="chip-v">{{ data.streams[key].kernel }}</span>
          </span>
          <span v-if="data.streams[key]?.systemd" class="chip">
            <span class="chip-k">systemd</span>
            <span class="chip-v">{{ data.streams[key].systemd }}</span>
          </span>
          <span v-if="data.streams[key]?.ignition" class="chip">
            <span class="chip-k">Ignition</span>
            <span class="chip-v">{{ data.streams[key].ignition }}</span>
          </span>
          <span v-if="data.streams[key]?.etcd" class="chip">
            <span class="chip-k">etcd</span>
            <span class="chip-v">{{ data.streams[key].etcd }}</span>
          </span>
          <span v-if="data.streams[key]?.docker" class="chip">
            <span class="chip-k">Docker</span>
            <span class="chip-v">{{ data.streams[key].docker }}</span>
          </span>
          <span v-if="data.streams[key]?.containerd" class="chip">
            <span class="chip-k">containerd</span>
            <span class="chip-v">{{ data.streams[key].containerd }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.streams-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.streams-header {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text);
  opacity: 0.6;
  margin-bottom: 2px;
}

.streams-subhead {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.45;
  margin-bottom: 6px;
  line-height: 1.3;
}

.streams-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  flex: 1;
}

.stream-card {
  background: rgba(var(--color-bg-rgb), 0.4);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  &.stream-recommended {
    border-color: #4f9cf9;
    box-shadow: 0 0 20px rgba(79, 156, 249, 0.3);
  }
}

.stream-top {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.recommended-badge {
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(var(--color-blue-rgb), 0.9);
  color: white;
  padding: 2px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}

.stream-badge {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}

.stream-lts .stream-badge {
  background: rgba(160, 120, 255, 0.15);
  color: rgb(185, 155, 255);
  border: 1px solid rgba(160, 120, 255, 0.3);
}

.stream-stable .stream-badge {
  background: rgba(80, 200, 120, 0.2);
  color: rgb(120, 220, 150);
  border: 1px solid rgba(80, 200, 120, 0.3);
}

.stream-beta .stream-badge {
  background: rgba(var(--color-blue-rgb), 0.2);
  color: var(--color-blue-light);
  border: 1px solid rgba(var(--color-blue-rgb), 0.3);
}

.stream-alpha .stream-badge {
  background: rgba(255, 160, 50, 0.15);
  color: rgb(255, 185, 90);
  border: 1px solid rgba(255, 160, 50, 0.3);
}

.stream-version {
  font-size: 1.4rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: var(--color-text-light);
  word-break: break-all;
}

.stream-date {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.5;
}

.stream-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border-light);
  border-radius: 3px;
  overflow: hidden;
  font-size: 1.05rem;
  line-height: 1;
}

.chip-k {
  padding: 3px 5px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}

.chip-v {
  padding: 3px 5px;
  background: rgba(var(--color-blue-rgb), 0.15);
  color: var(--color-text-light);
  font-family: 'Courier New', monospace;
  font-weight: 700;
}

@media (max-width: 600px) {
  .streams-grid {
    grid-template-columns: 1fr;
  }
}
</style>
