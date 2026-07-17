# Project Bluefin: Wolves — Cinematic

A unified cinematic web experience that presents the seven-part Wolves series as a
single, uninterrupted epic. Deployed at wolves.projectbluefin.io as the `/wolves`
entry of the Bluefin website build. No account, login, or configuration is
required to watch — the experience is fully open.

## Architecture

Vue 3 (Composition API) + Pinia. Independent systems, each modifiable without
touching the others:

- **Lobby** (`src/components/wolves/cinematic/CinematicLobby.vue`) — Destiny-styled
  staging ground: title, maintainer quote, and a single BEGIN TRANSMISSION gate
  (the click doubles as the browser autoplay gesture).
- **Authored intro** (`src/components/wolves/WolvesIntroOverlay.vue`) — the 85s
  prologue cold open (authored text cues over the Collapse artwork, driven by the
  Gayane Ballet Suite audio embed) followed by the Destiny 2 guardian trailer
  with the six guardian nameplates. Sequence data lives in
  `src/data/wolves-intro-sequence.ts`.
- **Cinematic runtime** (`CinematicStage.vue` + `src/composables/useDualBufferPlayer.ts`)
  — double-buffered YouTube playback with pre-end handoff and crossfades across
  the seven musical parts.
- **Seven-days experience** (`TrackZeroExperience.vue`) — during the 7 Days
  segment the authored beat-synced slideshow (`WolvesComicReader`), lore column
  (`WolvesLoreColumn`), and thesis overlay mount over the video, driven by the
  video's native timeline.
- **Persistent hero widget** (`MediaWidget.vue`) — bottom-anchored, subscribes only
  to `useCinematicStore`; the single transport (prev/next/pause/seek) across both
  the intro and the cinematic.

All runtime state lives in `src/stores/cinematic.ts`; components are subscribers.

## Ad resilience (important)

There is no official way to detect YouTube ads from the IFrame API, and CORS
blocks DOM inspection inside the iframe. This app therefore never syncs content
to wall-clock time: every timeline-driven surface (captions, slideshow schedule,
lore column, thesis overlay, ticker, pre-end handoff) is keyed to
`player.getCurrentTime()` polled on an interval (100ms in the cinematic, 200ms in
the intro).

- Pre-roll ads: `getCurrentTime()` sits at 0, so the synced content simply waits.
- Mid-roll ads: the main video's clock freezes, so all overlays freeze with it
  and resume in perfect sync when the ad ends.
- The prologue's text cues are driven by the audio embed's `getCurrentTime()`,
  not a local timer, so an ad on the audio track holds the cold open instead of
  desyncing it.

## Segment configuration

Everything lives in `src/config/wolves-cinematic.ts`. A segment is:

```ts
const segment: CinematicSegment = {
  youtubeId: 'LASru9j0oIc', // 11-char YouTube video id
  chapter: 'PART I', // placard detail line
  title: '7 Days to the Wolves',
  artist: 'Nightwish',
  artwork: 'wolves-artwork/LASru9j0oIc.jpg', // public/ path or URL
  crossfadeMs: 1500, // optional; DEFAULT_CROSSFADE_MS (800) otherwise
  startSeconds: 2, // optional authored trim into the source video
  endSeconds: 114, // optional authored cutoff on the native timeline
  trackZeroExperience: true, // mounts the authored seven-days layer
  captionsText: raw, // optional; `seconds|text` per line, native timeline
  transitionLore: ['...'], // optional authored lines for the handoff overlay
}
```

Adding, removing, reordering, or swapping videos is purely a data change.
Tunables: `PRE_END_THRESHOLD_S` (0.3s early handoff hides YouTube's trailing
black frame) and `TIME_POLL_MS` (100ms current-time poll).

## The dual-buffer player

While side A plays segment N, side B holds segment N+1 cued, muted, invisible.
At `duration - 0.3s` (or `ENDED` as a throttled-tab fallback) the composable
flips `activeSide`: CSS transitions the layers' opacity while a
`requestAnimationFrame` loop ramps `setVolume()` on both players. The freed
player then cues N+2. Manual prev/next hard-loads the target on the inactive
side; the equinox-style transition overlay covers the buffering gap. A
transparent shield blocks all YouTube-native interactions, and a pause veil
hides YouTube's paused-state chrome.

## Deployment (wolves.projectbluefin.io)

The app builds as the `wolves` entry of the site (`npm run build`, output in
`dist/wolves/`). Point a CNAME for `wolves.projectbluefin.io` at the GitHub
Pages host and serve `dist/wolves/index.html` at the domain root; the app is
path-agnostic (all asset fetches use `import.meta.env.BASE_URL`). No env vars,
API keys, or OAuth apps are required.

## Simplicity audit findings

- No accounts or OAuth: an earlier iteration offered a Spotify Web Playback SDK
  path (Premium-only, and Spotify policy prohibits synchronizing recordings with
  visual media). It was removed entirely: YouTube embeds carry the soundtrack,
  everyone gets in with zero setup, and the policy conflict is gone.
- No vue-router: three phases (lobby, intro, cinematic, finished) on one store
  field.
- No animation library: visual crossfades are CSS opacity transitions; only the
  audio ramp needs JavaScript because `setVolume` has no CSS equivalent.
- No WebVTT machinery: the repository's `seconds|text` caption format parses in
  ~30 lines.
- Complexity kept: two player instances (single-player `loadVideoById` visibly
  buffers at every boundary), the polling loop (the IFrame API has no time
  event), and the pre-end threshold (YouTube videos end on a black frame).
