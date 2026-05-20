<script setup lang="ts">
import {
  IconAlertCircleOutline,
  IconCheckCircleOutline,
  IconDownload,
  IconGithubCircle,
  IconLoading,
} from '@iconify-prerendered/vue-mdi'
import { onMounted, ref } from 'vue'

interface ReleaseAsset {
  name: string
  browser_download_url: string
}

interface GithubRelease {
  tag_name: string
  html_url: string
  assets: ReleaseAsset[]
}

interface DownloadEntry {
  label: string
  arch: string
  isoUrl: string
  isoFilename: string
  checksumUrl: string
}

const GITHUB_RELEASES_API = 'https://api.github.com/repos/castrojo/knuckle/releases/latest'
const GITHUB_RELEASES_PAGE = 'https://github.com/castrojo/knuckle/releases'

const loading = ref(true)
const error = ref(false)
const version = ref<string | null>(null)
const entries = ref<DownloadEntry[]>([])

onMounted(async () => {
  try {
    const res = await fetch(GITHUB_RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const release: GithubRelease = await res.json()
    version.value = release.tag_name

    const assetMap = new Map(release.assets.map(a => [a.name, a.browser_download_url]))

    const archs = [
      { label: 'AMD / Intel (x86_64)', arch: 'amd64' },
      { label: 'ARM64', arch: 'arm64' },
    ]

    entries.value = archs.map(({ label, arch }) => {
      const isoFilename = `knuckle-installer-stable-${arch}.iso`
      const checksumFilename = `${isoFilename}.sha256`
      return {
        label,
        arch,
        isoFilename,
        isoUrl: assetMap.get(isoFilename) ?? `${GITHUB_RELEASES_PAGE}/download/${release.tag_name}/${isoFilename}`,
        checksumUrl: assetMap.get(checksumFilename) ?? `${GITHUB_RELEASES_PAGE}/download/${release.tag_name}/${checksumFilename}`,
      }
    })
  }
  catch (e) {
    if (import.meta.env.DEV) {
      console.warn('[KnuckleDownloadCard] failed to fetch release:', e)
    }
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div id="knuckle-download" class="knuckle-download">
    <div class="download-header">
      <div class="download-title">
        Download
      </div>
      <span v-if="version" class="version-tag">{{ version }}</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-row">
      <IconLoading class="spin" />
      <span>Fetching latest release…</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-row state-error">
      <IconAlertCircleOutline />
      <a :href="GITHUB_RELEASES_PAGE" target="_blank" rel="noopener noreferrer">
        View releases on GitHub →
      </a>
    </div>

    <!-- Entries -->
    <div v-else class="entries">
      <div
        v-for="entry in entries"
        :key="entry.arch"
        class="entry"
      >
        <div class="entry-info">
          <span class="entry-arch">{{ entry.label }}</span>
          <span class="entry-filename">{{ entry.isoFilename }}</span>
        </div>
        <div class="entry-buttons">
          <a
            class="btn filled entry-dl"
            :href="entry.isoUrl"
            :download="entry.isoFilename"
          >
            <IconDownload />
            Download ISO
          </a>
          <a
            class="btn entry-checksum"
            :href="entry.checksumUrl"
            title="SHA-256 checksum"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconCheckCircleOutline />
            Verify
          </a>
        </div>
      </div>
    </div>

    <a
      class="github-link"
      :href="GITHUB_RELEASES_PAGE"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconGithubCircle />
      View on GitHub
    </a>
  </div>
</template>

<style scoped lang="scss">
.knuckle-download {
  border-top: 1px solid var(--color-border-light);
  padding-top: 16px;
  margin-top: 16px;
}

.download-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.download-title {
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text);
}

.version-tag {
  font-size: 1.1rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: var(--color-text-light);
  background: rgba(var(--color-blue-rgb), 0.2);
  border: 1px solid rgba(var(--color-blue-rgb), 0.3);
  border-radius: 4px;
  padding: 2px 8px;
}

.state-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  color: var(--color-text);
  padding: 8px 0;

  svg {
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
  }

  a {
    color: var(--color-blue-light);
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.state-error {
  color: var(--color-text);
  opacity: 0.7;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.entry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.entry-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-arch {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text-light);
}

.entry-filename {
  font-size: 1.1rem;
  font-family: 'Courier New', monospace;
  color: var(--color-text);
}

.entry-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.entry-dl,
.entry-checksum {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 1.3rem;
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 16px;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-text-light);
  text-decoration: none;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  background: rgba(var(--color-bg-rgb), 0.3);
  transition:
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    border-color: var(--color-blue-light);
    background: rgba(var(--color-blue-rgb), 0.1);
  }

  svg {
    width: 1.8rem;
    height: 1.8rem;
    flex-shrink: 0;
  }
}

@media (max-width: 500px) {
  .entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 0;
  }

  .entry-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .btn {
    white-space: nowrap;
    flex: 0 0 auto;
  }
}
</style>
