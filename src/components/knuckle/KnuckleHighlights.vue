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
              <!-- Flatcar: full-width hero item -->
              <div class="brand-item brand-flatcar">
                <div>
                  <div class="icon-wrap">
                    <IconServerNetwork />
                  </div>
                  <a class="brand-title" href="https://flatcar.org" target="_blank" rel="noopener noreferrer">Flatcar Container Linux</a>
                </div>
                <p>Auto-updating Linux built for containers. Ships with Docker, containerd, and Ignition config out of the box. Knuckle steps aside after first boot — you get unmodified, upstream Flatcar that manages its own A/B partition updates forever.</p>
              </div>

              <!-- Container-first: top-left -->
              <div class="brand-item">
                <div>
                  <div class="icon-wrap">
                    <IconCube />
                  </div>
                  <span class="brand-title">Container-First</span>
                </div>
                <p>Docker, containerd, Kubernetes-ready. Ignition declarative provisioning. No package manager — workloads live in containers.</p>
              </div>

              <!-- Auto-updates: top-right -->
              <div class="brand-item brand-primary">
                <div>
                  <div class="icon-wrap">
                    <IconAutorenew />
                  </div>
                  <a class="brand-title" href="https://www.flatcar.org/docs/latest/setup/releases/update-conf/" target="_blank" rel="noopener noreferrer">Automatic Updates</a>
                </div>
                <p>A/B partition scheme keeps the system current without manual intervention. Always running a supported, secure release.</p>
              </div>

              <!-- CNCF Ecosystem: bottom-left -->
              <div class="brand-item">
                <div>
                  <div class="icon-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="5.52 5.02 388.71 388.96" aria-hidden="true">
                      <path d="M66.5 333.2v-71.3H13v124.7h124.7v-53.4H66.5zm267.1-70.9v70.9h-70.9l-.3-.4v53.8H387V261.9h-53.8l.4.4zM66.5 136.9V66h70.8l.4.4V12.6H13v124.7h53.9l-.4-.4zM262.4 12.6V66h71.2v71.3H387V12.6H262.4z" fill="currentColor" opacity=".75" />
                      <path fill="currentColor" d="M208.5 137.3h47.3L184.5 66h77.9V12.6H137.7v53.8l70.8 70.9zm18.4 160l-35.4-35.4h-47.2l59 59.1 12.2 12.2h-77.8v53.4h124.7v-53.8l-35.5-35.5zm106.7-106.6v24.4l-12.2-12.2-59-59v47.2l35.4 35.4 35.4 35.4H387V137.3h-53.4v53.4zm-267.1-6.6l71.2 71.2v-47.2l-70.8-70.8H13v124.6h53.5v-77.8z" />
                    </svg>
                  </div>
                  <a class="brand-title" href="https://www.cncf.io/projects/flatcar/" target="_blank" rel="noopener noreferrer">CNCF Incubating Project</a>
                </div>
                <p>Same foundation as Kubernetes, containerd, Prometheus, and Argo. Vendor-neutral governance and a community-driven roadmap — not owned by any single company.</p>
              </div>

              <!-- Multi-arch: bottom-right -->
              <div class="brand-item">
                <div>
                  <div class="icon-wrap">
                    <IconChip />
                  </div>
                  <span class="brand-title">amd64 + ARM64</span>
                </div>
                <p>Bootable ISOs for both architectures. Same install experience on cloud servers, bare-metal x86, and ARM hardware.</p>
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
    padding: 8px 16px;
  }

  :deep(.brand-flatcar) {
    grid-column: 1 / -1;
    border-right: none;

    .icon-wrap svg {
      height: 32px;
      width: 32px;
    }

    p {
      font-size: 1.5rem !important;
      font-weight: 400;
    }
  }

  :deep(.brand-primary) {
    .icon-wrap svg {
      height: 28px;
      width: 28px;
    }

    p {
      font-size: 1.4rem !important;
      font-weight: 400;
    }
  }

  :deep(.brand-title) {
    font-size: 1.5rem;
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
}

@media (max-width: 500px) {
  .knuckle-highlights {
    :deep(.brand-grid) {
      grid-template-columns: 1fr !important;
    }
    :deep(.brand-item:nth-child(odd)) {
      border-right: none !important;
    }
  }
}
</style>
