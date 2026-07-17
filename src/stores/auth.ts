import { defineStore } from 'pinia'

export type AuthProvider = 'youtube' | 'spotify'
export type AuthStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface StoredSession {
  provider: AuthProvider
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const SESSION_KEY = 'wolves-cinematic-auth'

/**
 * sessionStorage (not localStorage): tokens die with the tab, which is the right
 * lifetime for a one-sitting cinematic event and limits token exposure.
 */
function readSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as StoredSession
    // The YouTube path is session-based (the embedded player uses the viewer's own
    // browser session) and carries no token; only token-bearing sessions can expire.
    if (parsed.provider !== 'youtube' && (!parsed.accessToken || parsed.expiresAt <= Date.now())) {
      return null
    }
    return parsed
  }
  catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    provider: null as AuthProvider | null,
    status: 'disconnected' as AuthStatus,
    accessToken: '',
    refreshToken: '',
    /** Epoch ms when the access token expires. */
    expiresAt: 0,
    error: '',
  }),

  getters: {
    isConnected: state => state.status === 'connected'
      && (state.provider === 'youtube' || !!state.accessToken),
  },

  actions: {
    restoreSession() {
      const session = readSession()
      if (!session) {
        return
      }
      this.provider = session.provider
      this.accessToken = session.accessToken
      this.refreshToken = session.refreshToken
      this.expiresAt = session.expiresAt
      this.status = 'connected'
      this.error = ''
    },
    beginConnecting(provider: AuthProvider) {
      this.provider = provider
      this.status = 'connecting'
      this.error = ''
    },
    /**
     * YouTube needs no app-level OAuth: the embedded player rides the viewer's own
     * YouTube login in this browser, so choosing it connects immediately.
     */
    connectYoutube() {
      this.provider = 'youtube'
      this.accessToken = ''
      this.refreshToken = ''
      this.expiresAt = 0
      this.status = 'connected'
      this.error = ''
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          provider: 'youtube',
          accessToken: '',
          refreshToken: '',
          expiresAt: 0,
        } satisfies StoredSession))
      }
      catch {
        // Storage may be unavailable (private mode); in-memory auth still works.
      }
    },
    setTokens(provider: AuthProvider, accessToken: string, expiresInSeconds: number, refreshToken = '') {
      this.provider = provider
      this.accessToken = accessToken
      this.refreshToken = refreshToken || this.refreshToken
      this.expiresAt = Date.now() + expiresInSeconds * 1000
      this.status = 'connected'
      this.error = ''
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          provider: this.provider,
          accessToken: this.accessToken,
          refreshToken: this.refreshToken,
          expiresAt: this.expiresAt,
        } satisfies StoredSession))
      }
      catch {
        // Storage may be unavailable (private mode); in-memory auth still works.
      }
    },
    fail(message: string) {
      this.status = 'error'
      this.error = message
    },
    disconnect() {
      this.provider = null
      this.status = 'disconnected'
      this.accessToken = ''
      this.refreshToken = ''
      this.expiresAt = 0
      this.error = ''
      try {
        sessionStorage.removeItem(SESSION_KEY)
      }
      catch {
        // Ignore storage failures.
      }
    },
  },
})
