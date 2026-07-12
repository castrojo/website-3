<script setup lang="ts">
const qrCards = [
  {
    title: 'Store',
    description: 'Open the Bluefin store for merch and campaign support drops.',
    href: 'https://store.projectbluefin.io',
    imageSrc: `${import.meta.env.BASE_URL}assets/svg/qr-store.svg`,
    imageAlt: 'Store QR code',
  },
  {
    title: 'Donate to Project Bluefin',
    description: 'Placeholder destination until the final Project Bluefin donation flow is approved.',
    href: '#',
    imageSrc: `${import.meta.env.BASE_URL}assets/svg/qr-donate.svg`,
    imageAlt: 'Donate to Project Bluefin QR code',
  },
] as const
</script>

<template>
  <section class="wolves-qr-codes" aria-label="Project Bluefin support links">
    <header class="wolves-qr-header">
      <p class="wolves-qr-kicker font-mono">
        SUPPORT SIDEBAR // SCAN TARGETS
      </p>
      <h2 class="wolves-qr-title">
        Store + Donate
      </h2>
    </header>

    <div class="wolves-qr-grid">
      <article v-for="card in qrCards" :key="card.title" class="wolves-qr-card">
        <img :src="card.imageSrc" :alt="card.imageAlt" class="wolves-qr-image">
        <div class="wolves-qr-copy">
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
          <a
            :href="card.href"
            :aria-label="card.title"
            :target="card.href.startsWith('http') ? '_blank' : undefined"
            :rel="card.href.startsWith('http') ? 'noopener noreferrer' : undefined"
            class="wolves-qr-link"
          >
            {{ card.href }}
          </a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.wolves-qr-codes {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid rgba(66, 133, 244, 0.22);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(16, 21, 31, 0.98), rgba(9, 13, 22, 0.98));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.wolves-qr-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wolves-qr-kicker {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #66b3ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.wolves-qr-title {
  margin: 0;
  font-size: 1.2rem;
  color: #f8fafc;
}

.wolves-qr-grid {
  display: grid;
  gap: 14px;
}

.wolves-qr-card {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  background: rgba(9, 13, 22, 0.78);
}

.wolves-qr-image {
  width: 96px;
  height: 96px;
  padding: 8px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.95);
}

.wolves-qr-copy {
  display: grid;
  gap: 8px;
}

.wolves-qr-copy h3,
.wolves-qr-copy p {
  margin: 0;
}

.wolves-qr-copy h3 {
  font-size: 1rem;
  color: #f8fafc;
}

.wolves-qr-copy p {
  font-size: 0.82rem;
  line-height: 1.55;
  color: #cbd5e1;
}

.wolves-qr-link {
  color: #7dd3fc;
  font-weight: 600;
  word-break: break-word;
  text-decoration: none;
}

.wolves-qr-link:hover {
  color: #bae6fd;
}

@media (max-width: 479px) {
  .wolves-qr-card {
    grid-template-columns: 1fr;
  }
}
</style>
