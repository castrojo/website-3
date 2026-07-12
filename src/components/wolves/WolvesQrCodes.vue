<script setup lang="ts">
import qrDonate from '@/assets/svg/qr-donate.svg'
import qrStore from '@/assets/svg/qr-store.svg'
</script>

<template>
  <section class="qr-grid" aria-label="Support Project Bluefin">
    <article class="qr-card">
      <h3 class="qr-title">
        Store
      </h3>
      <div class="qr-image-box">
        <img :src="qrStore" alt="QR code for the Project Bluefin store">
      </div>
      <div class="qr-action-wrap">
        <a href="https://store.projectbluefin.io" target="_blank" rel="noopener noreferrer" class="qr-btn blue">
          VISIT STORE
        </a>
        <span class="qr-domain">store.projectbluefin.io</span>
      </div>
    </article>

    <article class="qr-card">
      <h3 class="qr-title">
        Donate to Project Bluefin
      </h3>
      <div class="qr-image-box">
        <img :src="qrDonate" alt="QR code for Project Bluefin donations">
      </div>
      <div class="qr-action-wrap">
        <a href="#" class="qr-btn dark">
          DONATE
        </a>
        <span class="qr-domain">donate url pending</span>
      </div>
    </article>

    <article class="qr-card">
      <h3 class="qr-title">
        Cast This
      </h3>
      <div class="qr-image-box">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="farcaster-logo">
          <rect width="40" height="40" rx="12" fill="#6746FF" />
          <path d="M26.875 10H13.125A3.125 3.125 0 0 0 10 13.125V26.875A3.125 3.125 0 0 0 13.125 30H26.875A3.125 3.125 0 0 0 30 26.875V13.125A3.125 3.125 0 0 0 26.875 10ZM15 15H25C25.5523 15 26 15.4477 26 16C26 16.5523 25.5523 17 25 17H15C14.4477 17 14 16.5523 14 16C14 15.4477 14.4477 15 15 15ZM25 19C25.5523 19 26 19.4477 26 20C26 20.5523 25.5523 21 25 21H15C14.4477 21 14 20.5523 14 20C14 19.4477 14.4477 19 15 19ZM25 23C25.5523 23 26 23.4477 26 24C26 24.5523 25.5523 25 25 25H19C18.4477 25 18 24.5523 18 24C18 23.4477 18.4477 23 19 23H25Z" fill="white" />
        </svg>
      </div>
      <div class="qr-action-wrap">
        <a href="https://warpcast.com/~/compose?text=Seven%20Days%20to%20the%20Wolves%20-%20Join%20the%20Evolution%20on%20Project%20Bluefin&embeds[]=https://projectbluefin.io/wolves" target="_blank" rel="noopener noreferrer" class="qr-btn farcaster">
          CAST NOW
        </a>
        <span class="qr-domain">warpcast.com</span>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.qr-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media (min-width: 600px) {
    flex-direction: row;
  }
}

.qr-card {
  flex: 1;
  background-color: #10151f;
  border: 1px solid #272727;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.qr-title {
  font-size: 1.4rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0;
}

.qr-image-box {
  width: 192px;
  height: 192px;
  background-color: #0c1016;
  border: 1px solid #272727;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
}

.qr-image-box img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-action-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
}

.qr-btn {
  display: inline-block;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 24px;
  border-radius: 20px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.qr-btn.blue {
  background-color: var(--color-blue);
}

.qr-btn.blue:hover {
  background-color: var(--color-blue-light);
}

.qr-btn.dark {
  background-color: #272727;
}

.qr-btn.dark:hover {
  background-color: #1e1e1e;
}

.qr-domain {
  font-size: 1.1rem;
  color: #616161;
}

.farcaster-logo {
  width: 140px;
  height: 140px;
}

.qr-btn.farcaster {
  background-color: #6746ff;

  &:hover {
    background-color: #8265ff;
  }
}
</style>
