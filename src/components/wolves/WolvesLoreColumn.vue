<script setup lang="ts">
import quoteData from '@/data/bazzite-quotes.json'

interface BazziteQuote {
  quote: string
  attribution: string
  context?: string
  date?: string
}

const quotes = quoteData as BazziteQuote[]
</script>

<template>
  <!-- Replace these lorem ipsum records with approved real Discord quotes in src/data/bazzite-quotes.json. -->
  <section class="wolves-lore-column" aria-label="Community lore quotes">
    <header class="wolves-lore-header">
      <p class="wolves-lore-kicker font-mono">
        BAZZITE DISCORD // FIELD NOTES
      </p>
      <h2 class="wolves-lore-title">
        Lore Fragments
      </h2>
    </header>

    <div class="wolves-lore-list">
      <article
        v-for="entry in quotes"
        :key="`${entry.quote}-${entry.attribution}`"
        class="lore-entry"
      >
        <blockquote>{{ entry.quote }}</blockquote>
        <p class="lore-attribution">
          {{ entry.attribution }}
        </p>
        <p v-if="entry.context || entry.date" class="lore-context">
          {{ [entry.context, entry.date].filter(Boolean).join(' · ') }}
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.wolves-lore-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid rgba(66, 133, 244, 0.22);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(16, 21, 31, 0.98), rgba(9, 13, 22, 0.98));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.wolves-lore-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.wolves-lore-kicker,
.lore-attribution,
.lore-context {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.wolves-lore-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #66b3ff;
}

.wolves-lore-title {
  margin: 0;
  font-size: 1.2rem;
  color: #f8fafc;
}

.wolves-lore-list {
  display: grid;
  gap: 14px;
}

.lore-entry {
  display: grid;
  gap: 8px;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  background: rgba(9, 13, 22, 0.78);
}

.lore-entry blockquote {
  margin: 0;
  font-size: 0.96rem;
  line-height: 1.65;
  color: #e2e8f0;
}

.lore-attribution {
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #7dd3fc;
  text-transform: uppercase;
}

.lore-context {
  font-size: 0.72rem;
  color: #94a3b8;
}
</style>
