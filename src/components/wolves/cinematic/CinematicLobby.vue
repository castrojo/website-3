<script setup lang="ts">
const emit = defineEmits<{ enter: [] }>()
</script>

<template>
  <div class="wc-lobby">
    <div class="wc-lobby-frame">
      <p class="wc-label">
        PROJECT BLUEFIN
      </p>
      <h1 class="wc-lobby-title">
        SEVEN DAYS<br>TO THE WOLVES
      </h1>
      <div class="wc-hairline" />
      <p class="wc-lobby-sub">
        SEVEN PARTS · ONE TRANSMISSION
      </p>

      <p class="wc-lobby-status wc-label">
        SIGNAL READY · NO ACCOUNT REQUIRED
      </p>

      <button
        class="wc-lobby-enter wc-plate"
        type="button"
        @click="emit('enter')"
      >
        BEGIN TRANSMISSION
      </button>

      <blockquote class="wc-lobby-quote wc-plate wc-plate--sheen">
        <p>
          I've watched AI empower and destroy open source communities faster than
          anything yet. And it's getting faster. No one is talking, everyone is
          yelling past each other. I'm just as guilty as anyone.
        </p>
        <p>
          So I did what any good open source maintainer would do -- I turned to my
          friends. And together, we turned to metal. This project is designed to
          prove the value of the human spirity of creation. This is a collection of
          artists involved in Bluefin, who have been compensated for their work
          thanks to your donations, we hope you enjoy the world they've created.
          (If you don't like the metal then that's your problem.)
        </p>
        <div class="wc-lobby-quote-attribution">
          <span class="wc-lobby-quote-name">-- Jorge Castro //projectbluefin.io</span>
          <span class="wc-lobby-quote-detail">sabot-6 - Order of the Lost Saint - Die Vicesimo Primo mensis Iulii, Anno MMXXVI</span>
        </div>
      </blockquote>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wc-lobby {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 4rem 2rem;
  background:
    linear-gradient(rgb(8 9 12 / 82%), rgb(8 9 12 / 94%)),
    url('/evening/night-sky.webp') center / cover no-repeat;

  // Sparse angular line work; atmosphere over decoration.
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 22vw;
    height: 1px;
    background: var(--wc-line);
  }

  &::before {
    top: 12%;
    left: 6%;
    transform: rotate(-24deg);
  }

  &::after {
    bottom: 14%;
    right: 6%;
    transform: rotate(-24deg);
  }
}

.wc-lobby-frame {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: min(56rem, 100%);
  text-align: center;
}

.wc-lobby-title {
  font-size: clamp(3.4rem, 6.8vw, 6rem);
  font-weight: 800;
  letter-spacing: 0.28em;
  margin-right: -0.28em; // optically recenters tracked uppercase
  line-height: 1.15;
  color: var(--wc-white);
}

.wc-lobby-sub {
  font-family: var(--wc-font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.4em;
  color: var(--wc-grey);
}

.wc-lobby-status {
  min-height: 1.6rem;
}

.wc-lobby-enter {
  align-self: center;
  padding: 1.4rem 4.8rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--wc-gold);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled),
  &:focus-visible {
    background: var(--wc-gold);
    color: var(--wc-bg);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
}

.wc-lobby-quote {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.6rem;
  padding: 2rem 2.4rem;
  border-left: 2px solid var(--wc-gold);
  text-align: left;

  p {
    font-size: 1.4rem;
    font-style: italic;
    line-height: 1.6;
    color: var(--wc-white);
  }
}

.wc-lobby-quote-attribution {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-top: 1rem;
  border-top: 1px solid var(--wc-line);
}

.wc-lobby-quote-name {
  font-family: var(--wc-font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.14em;
  color: var(--wc-gold);
}

.wc-lobby-quote-detail {
  font-family: var(--wc-font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.1em;
  color: var(--wc-grey);
}
</style>
