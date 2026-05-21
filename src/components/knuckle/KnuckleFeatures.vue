<script setup lang="ts">
import { type Component } from 'vue'
import {
  IconAutorenew,
  IconChip,
  IconCodeBraces,
  IconDatabase,
  IconDocker,
  IconKey,
  IconKubernetes,
  IconLan,
  IconMagnifyScan,
  IconMonitorMultiple,
  IconPackageVariant,
  IconRouterNetwork,
  IconServerNetwork,
  IconShieldCheck,
  IconVpn,
} from '@iconify-prerendered/vue-mdi'

type CncfTier = 'graduated' | 'incubating' | 'sandbox'

interface SysextCard {
  name: string
  href: string
  icon: Component
  desc: string
  cncf?: CncfTier
}

const cards: SysextCard[] = [
  // CNCF Graduated
  { name: 'containerd', href: 'https://containerd.io', icon: IconPackageVariant, desc: 'Industry-standard container runtime', cncf: 'graduated' },
  { name: 'Falco', href: 'https://falco.org', icon: IconShieldCheck, desc: 'Runtime security & threat detection', cncf: 'graduated' },
  { name: 'CRI-O', href: 'https://cri-o.io', icon: IconKubernetes, desc: 'Lightweight Kubernetes container runtime', cncf: 'graduated' },
  // CNCF Incubating
  { name: 'KubeVirt', href: 'https://kubevirt.io', icon: IconMonitorMultiple, desc: 'Virtual machines on Kubernetes', cncf: 'incubating' },
  { name: 'wasmCloud', href: 'https://wasmcloud.com', icon: IconCodeBraces, desc: 'WebAssembly application platform', cncf: 'incubating' },
  // CNCF Sandbox
  { name: 'k3s', href: 'https://k3s.io', icon: IconKubernetes, desc: 'Lightweight Kubernetes distribution', cncf: 'sandbox' },
  { name: 'WasmEdge', href: 'https://wasmedge.org', icon: IconCodeBraces, desc: 'WebAssembly runtime for the edge', cncf: 'sandbox' },
  { name: 'Inspektor Gadget', href: 'https://www.inspektor-gadget.io', icon: IconMagnifyScan, desc: 'eBPF-based debugging & tracing', cncf: 'sandbox' },
  { name: 'Podman', href: 'https://podman.io', icon: IconDocker, desc: 'Daemonless container engine', cncf: 'sandbox' },
  // Community sysexts
  { name: 'Docker', href: 'https://docker.com', icon: IconDocker, desc: 'Container build & runtime toolchain' },
  { name: 'RKE2', href: 'https://rke2.io', icon: IconKubernetes, desc: 'FIPS-compliant Kubernetes by Rancher' },
  { name: 'Tailscale', href: 'https://tailscale.com', icon: IconVpn, desc: 'Zero-config WireGuard mesh VPN' },
  { name: 'Nomad', href: 'https://nomadproject.io', icon: IconServerNetwork, desc: 'Flexible workload orchestrator' },
  { name: 'Consul', href: 'https://consul.io', icon: IconDatabase, desc: 'Service mesh & discovery' },
  { name: 'Incus', href: 'https://linuxcontainers.org/incus/', icon: IconServerNetwork, desc: 'Container & VM manager' },
  { name: 'ZFS', href: 'https://openzfs.org', icon: IconDatabase, desc: 'Advanced filesystem & volume manager' },
  { name: 'wasmtime', href: 'https://wasmtime.dev', icon: IconCodeBraces, desc: 'Fast WebAssembly runtime' },
  { name: 'nerdctl', href: 'https://github.com/containerd/nerdctl', icon: IconDocker, desc: 'Docker-compatible containerd CLI' },
  { name: 'Nebula', href: 'https://github.com/slackhq/nebula', icon: IconLan, desc: 'Scalable overlay networking' },
  { name: 'BIRD', href: 'https://bird.network.cz', icon: IconRouterNetwork, desc: 'Internet routing daemon' },
  { name: 'opkssh', href: 'https://github.com/openpubkey/opkssh', icon: IconKey, desc: 'OpenPubKey SSH authentication' },
]

const tierLabel: Record<CncfTier, string> = {
  graduated: 'CNCF Graduated',
  incubating: 'CNCF Incubating',
  sandbox: 'CNCF Sandbox',
}
</script>

<template>
  <section class="knuckle-features">
    <div class="container">
      <div class="features-header">
        <div class="icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
        </div>
        <span class="brand-title">Extensible</span>
      </div>
      <p class="features-desc">Everything is optional. Sysexts activate on boot and extend the core system as needed.</p>

      <div class="app-grid">
        <a
          v-for="card in cards"
          :key="card.name"
          :href="card.href"
          target="_blank"
          rel="noopener noreferrer"
          class="app-card"
          :class="card.cncf ?? 'other'"
        >
          <div class="app-card-top">
            <div class="app-icon">
              <component :is="card.icon" />
            </div>
            <span v-if="card.cncf" class="app-badge" :class="card.cncf">{{ tierLabel[card.cncf] }}</span>
          </div>
          <div class="app-name">{{ card.name }}</div>
          <div class="app-desc">{{ card.desc }}</div>
        </a>
      </div>

      <div class="brand-grid brand-grid-lower">
        <div class="brand-item-row">
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

  .container {
    padding: 16px 20px;
  }

  .icon-wrap {
    svg {
      display: block;
      height: 24px;
      width: 24px;
      color: var(--color-text-light);
    }
  }

  .features-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .features-desc {
    font-size: 1.3rem;
    color: var(--color-text);
    opacity: 0.65;
    margin: 0 0 16px;
    line-height: 1.5;
  }

  // App-store card grid
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
  }

  .app-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    border: 1px solid var(--color-border-light);
    background: rgba(255, 255, 255, 0.03);
    transition: background 0.15s, border-color 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.07);
    }

    &.graduated {
      border-color: rgba(77, 184, 160, 0.35);
      background: rgba(77, 184, 160, 0.05);
      &:hover { background: rgba(77, 184, 160, 0.1); }
    }
    &.incubating {
      border-color: rgba(240, 160, 64, 0.35);
      background: rgba(240, 160, 64, 0.05);
      &:hover { background: rgba(240, 160, 64, 0.1); }
    }
    &.sandbox {
      border-color: rgba(136, 153, 187, 0.35);
      background: rgba(136, 153, 187, 0.05);
      &:hover { background: rgba(136, 153, 187, 0.1); }
    }
  }

  .app-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 4px;
  }

  .app-icon {
    svg {
      display: block;
      width: 20px;
      height: 20px;
      color: var(--color-text-light);
      opacity: 0.8;
    }
  }

  .app-badge {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1px 5px;
    border-radius: 3px;
    white-space: nowrap;

    &.graduated {
      color: #4db8a0;
      background: rgba(77, 184, 160, 0.15);
    }
    &.incubating {
      color: #f0a040;
      background: rgba(240, 160, 64, 0.15);
    }
    &.sandbox {
      color: #8899bb;
      background: rgba(136, 153, 187, 0.15);
    }
  }

  .app-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-text-light);
    line-height: 1.2;
  }

  .app-desc {
    font-size: 1.1rem;
    color: var(--color-text);
    opacity: 0.55;
    line-height: 1.35;
  }

  // Bottom 3-col feature row
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
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid var(--color-border-light);
    margin-top: 16px;

    .brand-item {
      border: none !important;
      padding-top: 16px;

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
}

@media (max-width: 600px) {
  .knuckle-features {
    .app-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
