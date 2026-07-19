<script setup lang="ts">
withDefaults(defineProps<{
  /** Small secondary detail line (chapter / status). */
  detail: string
  /** Large primary label. */
  label: string
  /** Slowly fades label changes for the authored Track 0 communications. */
  slowFade?: boolean
  /** Split-second interference treatment while a glitch cue holds the label. */
  glitch?: boolean
}>(), {
  slowFade: false,
  glitch: false,
})

/**
 * Authored labels mark technical tokens with double quotes (e.g.
 * "humans/trying-their-best:v1"). Render those segments in monospace with the
 * quotes stripped instead of showing the literal quotation marks.
 */
function labelParts(label: string): readonly { text: string, mono: boolean }[] {
  return label
    .split(/"([^"]*)"/)
    .map((text, index) => ({ text, mono: index % 2 === 1 }))
    .filter(part => part.text)
}
</script>

<template>
  <div
    class="wc-nameplate wc-plate wc-plate--sheen"
    :class="{
      'wc-nameplate--slow-fade': slowFade,
      'wc-nameplate--glitch': glitch,
      'wc-nameplate--blue-delivers': label === 'The Blue Delivers',
    }"
  >
    <span class="wc-nameplate-detail wc-label">{{ detail }}</span>
    <Transition v-if="slowFade" name="wc-nameplate-label" mode="out-in">
      <span :key="label" class="wc-nameplate-label">
        <template v-for="(part, index) in labelParts(label)" :key="index">
          <span v-if="part.mono" class="wc-nameplate-label-mono">{{ part.text }}</span>
          <template v-else>{{ part.text }}</template>
        </template>
      </span>
    </Transition>
    <span v-else class="wc-nameplate-label">
      <template v-for="(part, index) in labelParts(label)" :key="index">
        <span v-if="part.mono" class="wc-nameplate-label-mono">{{ part.text }}</span>
        <template v-else>{{ part.text }}</template>
      </template>
    </span>
  </div>
</template>

<style scoped lang="scss">
.wc-nameplate {
  display: inline-flex;
  flex-direction: column;
  gap: 0.4rem;
  box-sizing: border-box;
  max-width: 100%;
  padding: 1.2rem 2.4rem 1.2rem 1.6rem;
  border-left: 2px solid var(--wc-gold);
}

.wc-nameplate-label {
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--wc-white);
  line-height: 1.1;
  overflow-wrap: break-word;
}

/* Quoted technical tokens in authored labels (e.g. humans/trying-their-best:v1)
   render in the terminal monospace instead of literal quotation marks. */
.wc-nameplate-label-mono {
  font-family: var(--wc-font-mono);
  font-weight: 600;
  text-transform: none;
}

.wc-nameplate--slow-fade .wc-nameplate-label {
  transition: opacity 1.5s ease;
}

.wc-nameplate--blue-delivers .wc-nameplate-label {
  color: #ffffff;
  font-size: clamp(2.5rem, 2.2rem + 1.2vw, 3.2rem);
  text-shadow: 0 0 10px rgb(255 255 255 / 35%);
}

/* Split-second glitch easter egg (the #nova4ever bursts): RGB-split shadows plus a
   stepped jitter so the label reads as signal interference while the cue holds. */
.wc-nameplate--glitch .wc-nameplate-label {
  animation: wc-nameplate-glitch 0.18s steps(2, jump-none) infinite;
}

@keyframes wc-nameplate-glitch {
  0% {
    transform: translateX(-2px) skewX(-4deg);
    text-shadow:
      2px 0 0 rgb(255 0 64 / 75%),
      -2px 0 0 rgb(0 220 255 / 75%);
    clip-path: polygon(0 0, 100% 0, 100% 42%, 0 42%, 0 58%, 100% 58%, 100% 100%, 0 100%);
  }

  50% {
    transform: translateX(2px) skewX(3deg);
    text-shadow:
      -3px 0 0 rgb(255 0 64 / 75%),
      3px 0 0 rgb(0 220 255 / 75%);
    clip-path: polygon(0 0, 100% 0, 100% 68%, 0 68%, 0 76%, 100% 76%, 100% 100%, 0 100%);
  }

  100% {
    transform: translateX(-1px);
    text-shadow:
      1px 0 0 rgb(255 0 64 / 75%),
      -1px 0 0 rgb(0 220 255 / 75%);
    clip-path: none;
  }
}

.wc-nameplate-label-enter-from,
.wc-nameplate-label-leave-to {
  opacity: 0;
}
</style>
