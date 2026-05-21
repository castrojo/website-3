<script setup lang="ts">
import {
  IconAutorenew,
  IconChip,
  IconCube,
  IconServerNetwork,
} from '@iconify-prerendered/vue-mdi'
</script>

<template>
  <section class="section-wrap knuckle-highlights">
    <div class="container">
      <div class="scene-content visible">
        <div>
          <div>
            <div class="brand-grid">
              <!-- Row 1: Flatcar | NVIDIA -->
              <div class="brand-item">
                <div>
                  <div class="icon-wrap">
                    <IconServerNetwork />
                  </div>
                  <a class="brand-title" href="https://flatcar.org" target="_blank" rel="noopener noreferrer">Flatcar Container Linux</a>
                </div>
                <p>Over 8 years of production experience. Unmodified upstream Flatcar — Knuckle steps aside after first boot and the OS takes care of itself. Forever.</p>
              </div>

              <div class="brand-item brand-nvidia">
                <div>
                  <div class="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z" />
                    </svg>
                  </div>
                  <a class="brand-title" href="https://github.com/NVIDIA/go-nvlib" target="_blank" rel="noopener noreferrer">NVIDIA Autodetection</a>
                </div>
                <p>Your GPU is detected automatically during install. Choose your preferred driver version and Knuckle handles the rest.</p>
                <div class="nvidia-chips">
                  <span class="chip nvidia">
                    <span class="chip-k">Driver</span>
                    <span class="chip-v">570-open</span>
                  </span>
                  <span class="chip nvidia">
                    <span class="chip-k">Driver</span>
                    <span class="chip-v">550-open</span>
                  </span>
                  <span class="chip nvidia">
                    <span class="chip-k">Driver</span>
                    <span class="chip-v">535-open</span>
                  </span>
                  <span class="chip nvidia">
                    <span class="chip-k">Legacy</span>
                    <span class="chip-v">460</span>
                  </span>
                </div>
              </div>

              <!-- Row 2: KubeStellar | CNCF -->
              <div class="brand-item brand-kubestellar">
                <div>
                  <div class="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                      <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="3" fill="none"/>
                      <polygon points="50,12 58,38 86,38 63,55 71,82 50,66 29,82 37,55 14,38 42,38" fill="currentColor" opacity="0.9"/>
                      <circle cx="50" cy="10" r="4" fill="currentColor"/>
                      <circle cx="88" cy="40" r="4" fill="currentColor"/>
                      <circle cx="74" cy="82" r="4" fill="currentColor"/>
                      <circle cx="26" cy="82" r="4" fill="currentColor"/>
                      <circle cx="12" cy="40" r="4" fill="currentColor"/>
                      <path d="M50 10 Q69 25 88 40" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
                      <path d="M88 40 Q81 61 74 82" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
                      <path d="M74 82 Q50 82 26 82" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
                      <path d="M26 82 Q19 61 12 40" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
                      <path d="M12 40 Q31 25 50 10" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
                    </svg>
                  </div>
                  <a class="brand-title" href="https://kubestellar.io" target="_blank" rel="noopener noreferrer">KubeStellar Console UI</a>
                </div>
                <p>Optional multi-cluster Kubernetes control plane — edge, cloud, and homelab.</p>
              </div>

              <div class="brand-item brand-nvidia">
                <div>
                  <div class="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="5.52 5.02 388.71 388.96" aria-hidden="true">
                      <path d="M66.5 333.2v-71.3H13v124.7h124.7v-53.4H66.5zm267.1-70.9v70.9h-70.9l-.3-.4v53.8H387V261.9h-53.8l.4.4zM66.5 136.9V66h70.8l.4.4V12.6H13v124.7h53.9l-.4-.4zM262.4 12.6V66h71.2v71.3H387V12.6H262.4z" fill="currentColor" opacity=".75" />
                      <path fill="currentColor" d="M208.5 137.3h47.3L184.5 66h77.9V12.6H137.7v53.8l70.8 70.9zm18.4 160l-35.4-35.4h-47.2l59 59.1 12.2 12.2h-77.8v53.4h124.7v-53.8l-35.5-35.5zm106.7-106.6v24.4l-12.2-12.2-59-59v47.2l35.4 35.4 35.4 35.4H387V137.3h-53.4v53.4zm-267.1-6.6l71.2 71.2v-47.2l-70.8-70.8H13v124.6h53.5v-77.8z" />
                    </svg>
                  </div>
                  <a class="brand-title" href="https://www.cncf.io/projects/flatcar/" target="_blank" rel="noopener noreferrer">CNCF Incubating</a>
                </div>
                <p>Same foundation as Kubernetes, containerd, and Prometheus. Includes <a href="https://kubevirt.io" target="_blank" rel="noopener noreferrer">KubeVirt</a>. Vendor-neutral governance.</p>
              </div>

              <!-- Row 3: Container-First | Updates | amd64+ARM64 (3-col sub-row) -->
              <div class="brand-item-row">
                <div class="brand-item">
                  <div>
                    <div class="icon-wrap">
                      <IconCube />
                    </div>
                    <span class="brand-title">Container-First</span>
                  </div>
                  <p>Docker, containerd, Kubernetes-ready. Ignition provisioning. No package manager.</p>
                </div>
                <div class="brand-item">
                  <div>
                    <div class="icon-wrap">
                      <IconAutorenew />
                    </div>
                    <a class="brand-title" href="https://www.flatcar.org/docs/latest/setup/releases/update-conf/" target="_blank" rel="noopener noreferrer">Automatic Updates</a>
                  </div>
                  <p>A/B partition scheme. Always running a supported, secure release.</p>
                </div>
                <div class="brand-item">
                  <div>
                    <div class="icon-wrap">
                      <IconChip />
                    </div>
                    <span class="brand-title">amd64 + ARM64</span>
                  </div>
                  <p>Bootable ISOs for both architectures. Same install experience everywhere.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.knuckle-highlights {
  min-height: auto;
  padding: 0;

  .icon-wrap {
    svg {
      display: block;
      height: 24px;
      width: 24px;
      color: var(--color-text-light);
    }
  }

  :deep(.brand-item) {
    padding: 4px 12px;

    & > div {
      margin-bottom: 4px;
    }

    p {
      margin: 0;
      font-size: 1.4rem !important;
      line-height: 1.4;
    }
  }

  // brand-item-row spans both columns, contains 3 equal boxes
  :deep(.brand-item-row) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-top: 1px solid var(--color-border-light);

    .brand-item {
      border-bottom: none;

      &:not(:last-child) {
        border-right: 1px solid var(--color-border-light);
      }
    }
  }

  :deep(.brand-nvidia) {
    border-left: 1px solid var(--color-border-light);
  }


  :deep(.brand-title) {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-text-light);
    align-self: center;
    text-decoration: none;

    &[href]:hover {
      text-decoration: underline;
      opacity: 0.85;
    }
  }

  :deep(.brand-grid) {
    margin-bottom: 0;
  }

  .nvidia-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--color-border-light);
    border-radius: 3px;
    overflow: hidden;
    font-size: 1.05rem;
    line-height: 1;

    &.nvidia {
      border-color: rgba(118, 185, 0, 0.4);
    }
  }

  .chip-k {
    padding: 3px 5px;
    font-weight: 600;
    color: var(--color-text);
    letter-spacing: 0.02em;

    .nvidia & {
      color: rgba(118, 185, 0, 0.8);
    }
  }

  .chip-v {
    padding: 3px 5px;
    font-family: 'Courier New', monospace;
    font-weight: 700;

    .nvidia & {
      background: rgba(118, 185, 0, 0.15);
      color: #76b900;
    }
  }
}

@media (max-width: 600px) {
  .knuckle-highlights {
    :deep(.brand-grid) {
      grid-template-columns: 1fr !important;
    }

    :deep(.brand-item-row) {
      grid-template-columns: 1fr !important;

      .brand-item {
        border-right: none !important;
        border-top: 1px solid var(--color-border-light);
      }
    }

    :deep(.brand-nvidia) {
      border-left: none;
      border-top: 1px solid var(--color-border-light);
    }
  }
}
</style>
