<script setup lang="ts">
import type { WolvesChapter } from '../../data/wolves-story'
import type { WolvesLoreEntry } from './lore'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatQuoteSource, getLoreEntriesForChapter } from './lore'

const props = defineProps<{
  chapter?: WolvesChapter
}>()

const filteredLoreEntries = computed(() => getLoreEntriesForChapter(props.chapter))
const currentLoreIndex = ref(0)
const currentLoreEntry = computed<WolvesLoreEntry | null>(() => filteredLoreEntries.value[currentLoreIndex.value] ?? null)

const typedQuoteText = ref('')
let loreTimer: ReturnType<typeof setInterval> | null = null
let typewriterTimer: ReturnType<typeof setInterval> | null = null

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function clearTypewriter() {
  if (typewriterTimer) {
    clearInterval(typewriterTimer)
    typewriterTimer = null
  }
}

function runTypewriter() {
  clearTypewriter()

  const entry = currentLoreEntry.value
  if (!entry) {
    typedQuoteText.value = ''
    return
  }

  const targetText = entry.data.quote
  typedQuoteText.value = ''
  let index = 0
  const step = Math.max(1, Math.ceil(targetText.length / 30))

  typewriterTimer = setInterval(() => {
    index += step
    if (index >= targetText.length) {
      typedQuoteText.value = targetText
      clearTypewriter()
    }
    else {
      const cyberChars = '01#$@&%<>_+'
      const randChar = cyberChars[Math.floor(Math.random() * cyberChars.length)]
      typedQuoteText.value = targetText.slice(0, index) + randChar
    }
  }, 20)
}

function skipTypewriter() {
  clearTypewriter()
  const entry = currentLoreEntry.value
  if (!entry) {
    return
  }
  typedQuoteText.value = entry.data.quote
}

function stopLoreTimer() {
  if (loreTimer) {
    clearInterval(loreTimer)
    loreTimer = null
  }
}

function startLoreTimer() {
  if (filteredLoreEntries.value.length <= 1 || loreTimer) {
    return
  }

  loreTimer = setInterval(() => {
    currentLoreIndex.value = (currentLoreIndex.value + 1) % filteredLoreEntries.value.length
  }, 15000)
}

function restartLoreTimer() {
  stopLoreTimer()
  startLoreTimer()
}

function nextLore() {
  if (filteredLoreEntries.value.length <= 1) {
    return
  }

  currentLoreIndex.value = (currentLoreIndex.value + 1) % filteredLoreEntries.value.length
  restartLoreTimer()
}

function prevLore() {
  if (filteredLoreEntries.value.length <= 1) {
    return
  }

  currentLoreIndex.value = (currentLoreIndex.value - 1 + filteredLoreEntries.value.length) % filteredLoreEntries.value.length
  restartLoreTimer()
}

function shareLore() {
  const entry = currentLoreEntry.value
  if (!entry) {
    return
  }

  const pageUrl = window.location.href.split('#')[0]
  const shareText = `[Bluefin Quote]\n"${entry.data.quote}"\n— ${entry.data.attribution}${entry.data.context ? ` (${entry.data.context})` : ''}${entry.data.date ? `\n${entry.data.date}` : ''}\n${pageUrl}`

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    void navigator.clipboard.writeText(shareText).then(() => {
      isCopied.value = true
      if (copyTimeout) {
        clearTimeout(copyTimeout)
      }
      copyTimeout = setTimeout(() => {
        isCopied.value = false
      }, 2000)
    })
  }

  restartLoreTimer()
}

watch(filteredLoreEntries, () => {
  currentLoreIndex.value = 0
  restartLoreTimer()
}, { immediate: true })

watch(currentLoreEntry, () => {
  runTypewriter()
}, { immediate: true })

onMounted(() => {
  startLoreTimer()
})

onBeforeUnmount(() => {
  stopLoreTimer()
  clearTypewriter()
  if (copyTimeout) {
    clearTimeout(copyTimeout)
  }
})
</script>

<template>
  <div class="wolves-lore-column">
    <section id="intercepted-communications" class="dispatch-quote-section comic-reader-section">
      <div class="dispatch-quote-card">
        <div class="quote-nav">
          <button
            class="quote-nav-btn share-btn font-mono"
            :aria-label="isCopied ? 'Quote copied' : 'Share quote'"
            type="button"
            @click="shareLore"
          >
            {{ isCopied ? 'COPIED!' : 'SHARE' }}
          </button>
          <button
            class="quote-nav-btn prev"
            aria-label="Previous quote"
            type="button"
            @click="prevLore"
          >
            &larr;
          </button>
          <button
            class="quote-nav-btn next"
            aria-label="Next quote"
            type="button"
            @click="nextLore"
          >
            &rarr;
          </button>
        </div>

        <div class="dispatch-plan-content">
          <p class="dispatch-plan-command">
            nimbinatus@blue-universal:~$ monitor --quotes
          </p>
          <h2 class="title-h2">
            Recovered Quotes
          </h2>
          <p class="title-p">
            Source: Bazzite Discord quotes
            <br>Rotation: Time-based
          </p>
        </div>

        <div class="quote-viewport" @click="skipTypewriter">
          <Transition name="quote-fade">
            <div v-if="currentLoreEntry" :key="currentLoreIndex" class="quote-rotator">
              <div class="lore-quote">
                <div class="lore-quote-mark">
                  &ldquo;
                </div>
                <p class="lore-quote-text">
                  {{ typedQuoteText }}
                </p>
                <div class="lore-quote-meta">
                  <strong>{{ currentLoreEntry.data.attribution }}</strong>
                  <span v-if="formatQuoteSource(currentLoreEntry.data)">
                    {{ formatQuoteSource(currentLoreEntry.data) }}
                  </span>
                  <time v-if="currentLoreEntry.data.date" :datetime="currentLoreEntry.data.date">
                    {{ currentLoreEntry.data.date }}
                  </time>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.wolves-lore-column {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1024px) {
    flex: 1;
  }
}

.dispatch-quote-section {
  @media (min-width: 1024px) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.dispatch-quote-card {
  background-color: #10151f;
  border: 1px solid #272727;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;

  @media (min-width: 1024px) {
    flex: 1;
  }

  &:hover {
    border-color: rgba(var(--color-blue-rgb), 0.4);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
}

.dispatch-plan-content {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  background: linear-gradient(180deg, rgba(16, 21, 31, 0.98) 0%, rgba(12, 16, 22, 0.98) 100%);
  border: 1px solid rgba(var(--color-blue-rgb), 0.22);
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dispatch-plan-command {
  margin: 0 0 6px;
  font-size: 0.86rem;
  color: rgba(189, 189, 189, 0.65);
}

.dispatch-plan-content .title-h2 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #ffffff;
}

.dispatch-plan-content .title-p {
  margin: 6px 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(189, 189, 189, 0.9);
}

.quote-viewport {
  position: relative;
}

.quote-rotator {
  position: relative;
}

.lore-quote {
  min-height: 220px;
  padding: 8px 0 0;
}

.lore-quote-mark {
  color: rgba(var(--color-blue-rgb), 0.28);
  font-family: Georgia, serif;
  font-size: 5rem;
  line-height: 0.6;
  pointer-events: none;
  user-select: none;
}

.lore-quote-text {
  margin: 18px 0 24px;
  color: #ffffff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1.25rem;
  font-style: italic;
  line-height: 1.65;
}

.lore-quote-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-top: 1px solid rgba(var(--color-blue-rgb), 0.25);
  padding-top: 14px;
  color: rgba(189, 189, 189, 0.78);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.95rem;
  line-height: 1.45;
}

.lore-quote-meta strong {
  color: var(--color-blue);
  font-size: 1rem;
}

.lore-quote-meta time {
  color: rgba(189, 189, 189, 0.6);
}

.quote-nav {
  display: flex;
  gap: 8px;
  z-index: 3;

  @media (max-width: 479px) {
    position: static;
    margin-bottom: 12px;
    justify-content: flex-end;
  }

  @media (min-width: 480px) {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}

.quote-nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(var(--color-blue-rgb), 0.45);
  background-color: #10151f;
  color: var(--color-blue-light);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(var(--color-blue-rgb), 0.15);
    border-color: var(--color-blue-light);
    color: #ffffff;
  }
}

.quote-nav-btn.share-btn {
  width: auto;
  min-width: 68px;
  padding: 0 12px;
  font-size: 0.85rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: bold;
}

.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.quote-fade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.quote-fade-enter-from,
.quote-fade-leave-to {
  opacity: 0;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>
