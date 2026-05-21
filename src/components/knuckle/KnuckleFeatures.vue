<script setup lang="ts">
import {
  IconAutorenew,
  IconChip,
  IconCube,
  IconExtension,
} from '@iconify-prerendered/vue-mdi'
</script>

<template>
  <section class="knuckle-features">
    <div class="container">
      <div class="brand-grid">
        <div class="brand-item brand-extensible">
          <div>
            <div class="icon-wrap">
              <IconExtension />
            </div>
            <span class="brand-title">Extensible</span>
          </div>
          <p>Everything is optional. Sysexts activate on boot — no containers, no overhead, no package manager.</p>
          <div class="sysext-grid">
            <div class="sysext-group">
              <span class="sysext-group-label other">Also available</span>
              <div class="sysext-chips">
                <a href="https://docker.com" class="sysext-chip other" target="_blank" rel="noopener noreferrer">docker</a>
                <a href="https://rke2.io" class="sysext-chip other" target="_blank" rel="noopener noreferrer">rke2</a>
                <a href="https://tailscale.com" class="sysext-chip other" target="_blank" rel="noopener noreferrer">tailscale</a>
                <a href="https://nomadproject.io" class="sysext-chip other" target="_blank" rel="noopener noreferrer">nomad</a>
                <a href="https://consul.io" class="sysext-chip other" target="_blank" rel="noopener noreferrer">consul</a>
                <a href="https://podman.io" class="sysext-chip other" target="_blank" rel="noopener noreferrer">podman</a>
                <a href="https://linuxcontainers.org/incus/" class="sysext-chip other" target="_blank" rel="noopener noreferrer">incus</a>
                <a href="https://openzfs.org" class="sysext-chip other" target="_blank" rel="noopener noreferrer">zfs</a>
                <a href="https://wasmtime.dev" class="sysext-chip other" target="_blank" rel="noopener noreferrer">wasmtime</a>
                <a href="https://github.com/containerd/nerdctl" class="sysext-chip other" target="_blank" rel="noopener noreferrer">nerdctl</a>
                <a href="https://github.com/slackhq/nebula" class="sysext-chip other" target="_blank" rel="noopener noreferrer">nebula</a>
                <a href="https://bird.network.cz" class="sysext-chip other" target="_blank" rel="noopener noreferrer">bird</a>
                <a href="https://github.com/openpubkey/opkssh" class="sysext-chip other" target="_blank" rel="noopener noreferrer">opkssh</a>
              </div>
            </div>
          </div>
        </div>

        <div class="brand-item brand-cncf-logos">
          <div class="cncf-tier">
            <span class="sysext-group-label graduated">Graduated</span>
            <div class="cncf-logo-row">
              <a href="https://kubernetes.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/kubernetes/icon/white/kubernetes-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">Kubernetes</span>
              </a>
              <a href="https://containerd.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/containerd/icon/white/containerd-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">containerd</span>
              </a>
              <a href="https://falco.org" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/falco/icon/white/falco-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">Falco</span>
              </a>
              <a href="https://cri-o.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/cri-o/icon/white/cri-o-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">CRI-O</span>
              </a>
            </div>
          </div>
          <div class="cncf-tier">
            <span class="sysext-group-label incubating">Incubating</span>
            <div class="cncf-logo-row">
              <a href="https://kubevirt.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/kubevirt/icon/white/kubevirt-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">KubeVirt</span>
              </a>
              <a href="https://wasmcloud.com" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/wasmcloud/icon/white/wasmcloud-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">wasmCloud</span>
              </a>
            </div>
          </div>
          <div class="cncf-tier">
            <span class="sysext-group-label sandbox">Sandbox</span>
            <div class="cncf-logo-row">
              <a href="https://k3s.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/k3s/icon/white/k3s-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">k3s</span>
              </a>
              <a href="https://wasmedge.org" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/wasmedge/icon/white/wasmedge-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">WasmEdge</span>
              </a>
              <a href="https://www.inspektor-gadget.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/inspektor-gadget/icon/white/inspektor-gadget-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">Inspektor Gadget</span>
              </a>
              <a href="https://podman.io" target="_blank" rel="noopener noreferrer" class="cncf-logo-item">
                <img src="https://raw.githubusercontent.com/cncf/artwork/main/projects/podman/icon/white/podman-icon-white.svg" alt="" class="cncf-logo">
                <span class="cncf-logo-label">Podman</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="brand-grid brand-grid-lower">
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
  </section>
</template>

<style scoped lang="scss">
.knuckle-features {
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
    padding: 20px;
    border: none !important;

    & > div {
      margin-bottom: 10px;
    }

    p {
      margin: 0;
      font-size: 1.4rem !important;
      line-height: 1.5;
    }
  }

  :deep(.brand-item-row) {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .brand-item {
      border: none !important;

      &:not(:last-child) {
        border-right: 1px solid var(--color-border-light) !important;
      }
    }
  }

  :deep(.brand-grid) {
    margin-bottom: 0;
    gap: 0;
    border-top: none !important;
    border-bottom: none !important;
  }

  :deep(.brand-grid-lower) {
    margin-top: 0;
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

  :deep(.brand-extensible) {
    p { max-width: 60ch; }
  }

  .cncf-tier {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & + .cncf-tier { margin-top: 14px; }
  }

  .cncf-logo-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 16px;
  }

  .cncf-logo-item {
    display: flex;
    align-items: center;
    gap: 7px;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.15s;

    &:hover { opacity: 1; }
  }

  .cncf-logo {
    display: block;
    height: 22px;
    width: auto;
    flex-shrink: 0;
  }

  .cncf-logo-label {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-text-light);
    white-space: nowrap;
  }

  .sysext-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    margin-top: 12px;
  }

  .sysext-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sysext-group-label {
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;

    &.graduated { color: #4db8a0; }
    &.incubating { color: #f0a040; }
    &.sandbox    { color: #8899bb; }
    &.other      { color: var(--color-text); opacity: 0.45; }
  }

  .sysext-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .sysext-chip {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 1.1rem;
    font-weight: 600;
    font-family: 'Courier New', monospace;
    text-decoration: none;
    transition: opacity 0.15s;

    &:hover { opacity: 0.75; }

    &.other {
      background: rgba(var(--color-text-rgb, 255 255 255), 0.05);
      color: var(--color-text);
      opacity: 0.55;
      border: 1px solid var(--color-border-light);

      &:hover { opacity: 0.85; }
    }
  }
}

@media (max-width: 600px) {
  .knuckle-features {
    :deep(.brand-grid) {
      grid-template-columns: 1fr !important;
    }

    :deep(.brand-item-row) {
      grid-template-columns: 1fr !important;

      .brand-item {
        border-right: none !important;
      }
    }
  }
}
</style>
