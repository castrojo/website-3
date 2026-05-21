<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isLoaded = ref(false)
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 150)
})
</script>

<template>
  <div class="knuckle-text" :class="{ 'is-loaded': isLoaded }">
    <a href="https://projectbluefin.io" class="back-link">
      ← projectbluefin.io
    </a>
    <div class="hero-tag">
      <strong>Project Bluefin presents&hellip;</strong>
    </div>

    <h1 class="hero-title">
      Knuckle
    </h1>

    <p class="hero-tagline">
      The fastest way to get Flatcar Linux on your homelab. Boot and go.
    </p>

    <p class="hero-desc">
      Knuckle is a guided configurator for
      <a href="https://flatcar.org" target="_blank" rel="noopener noreferrer">Flatcar Container Linux</a>, an OS designed for running super efficient Kubernetes clusters.
      Boot the ISO, pick a disk, done in under a minute.
      Run your homelab with the same tools trusted by over
      <a href="https://www.cncf.io/reports/cncf-annual-survey-2023/" target="_blank" rel="noopener noreferrer">20 million developers</a>
      and infrastructure-leading
      <a href="https://www.cncf.io/enduser/" target="_blank" rel="noopener noreferrer">end users</a>. Flatcar is a <a href="https://www.cncf.io/projects/flatcar/" target="_blank" rel="noopener noreferrer">CNCF incubating project</a> &mdash;
      this configuration lets you take advantage of the entire professional ecosystem, at home.
    </p>

    <p class="hero-desc">
      Keept it all vanilla or accelerate with the included <a href="https://kubestellar.io" target="_blank" rel="noopener noreferrer">KubeStellar</a> dashboard to manage your entire cluster.
      Build it your way, using the best tools. Need a NAS? A Jellyfin server? Anything you can serve, with an awesome dashboard to manage it all. The perfect homelab OS has arrived &mdash; build your private empire with proven tools. 
    </p>

    <div class="alpha-badge">
      ⚠️ Beta software — take appropriate precautions
    </div>

    <div class="release-links">
      <a
        href="https://github.com/castrojo/knuckle/releases"
        target="_blank"
        rel="noopener noreferrer"
      >Latest Release →</a>
      <a
        href="https://github.com/castrojo/knuckle"
        target="_blank"
        rel="noopener noreferrer"
      >GitHub →</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.knuckle-text {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  width: 100%;
  box-sizing: border-box;

  &.is-loaded {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-tag {
  margin-bottom: 2px;

  strong {
    font-size: 1.4rem;
    font-weight: 400;
    font-family: Inter;
    text-transform: uppercase;
    color: var(--color-text-light);
    display: block;
  }
}

.hero-title {
  font-family: Inter;
  font-weight: 700;
  font-size: 4.2rem;
  text-transform: uppercase;
  color: var(--color-text-light);
  margin: 0 0 6px 0;
  line-height: 1;
  padding-top: 0;
  padding-left: 0;
}

.hero-tagline {
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--color-text-light);
  margin: 0 0 6px 0;
  line-height: 1.5;
}

.hero-desc {
  font-size: 1.4rem;
  line-height: 1.5;
  color: var(--color-text-light);
  margin: 0 0 6px 0;

  a {
    color: var(--color-blue-light);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.alpha-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-light);
  background: rgba(var(--color-bg-rgb), 0.5);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  padding: 5px 12px;
  margin-bottom: 0;
}

.release-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 4px;

  a {
    color: var(--color-blue-light);
    font-size: 1.3rem;
    font-weight: 600;
    text-decoration: none;
    opacity: 0.85;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
}

.back-link {
  display: inline-block;
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 1.3rem;
  opacity: 0.6;
  margin-bottom: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

@media (max-width: 500px) {
  .alpha-badge {
    font-size: 1.1rem;
    padding: 6px 12px;
  }

  .hero-title {
    font-size: 4.5rem;
  }
}
</style>
