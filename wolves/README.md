# Project Bluefin: Wolves — Cinematic

A unified cinematic web experience that presents the seven-part Wolves series as a
single, uninterrupted epic. Deployed at wolves.projectbluefin.io as the `/wolves`
entry of the Bluefin website build.

## Architecture

Vue 3 (Composition API) + Pinia. Three independent systems, each modifiable without
touching the others:

- **Lobby** (`src/components/wolves/cinematic/CinematicLobby.vue`) — pre-flight
  staging ground. The user connects with exactly one provider: YouTube (instant,
  uses the viewer's own browser session) or Spotify (OAuth PKCE); entry unlocks
  only once the chosen link is established in the auth store.
- **Cinematic runtime** (`CinematicStage.vue` + `src/composables/useDualBufferPlayer.ts`)
  — double-buffered YouTube playback with pre-end handoff and programmatic
  audio/visual crossfades.
- **Persistent media widget** (`MediaWidget.vue`) — bottom-anchored, subscribes only
  to `useCinematicStore`. It receives no props from and holds no references to the
  players; play/pause intent is emitted upward and wired by the app shell.

All runtime state lives in two Pinia stores: `src/stores/cinematic.ts` (segment
index, elapsed times, metadata, Spotify state, crossfade state) and
`src/stores/auth.ts` (provider, tokens, expiry).

## Setup

```bash
npm install --include=dev
cp .env.example .env.local   # fill in client ids
npm run dev                  # http://localhost:5173/wolves/
```

Verification: `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`.

## OAuth app configuration

Both providers are public browser clients. No secrets exist anywhere in this app.

### YouTube path

No configuration required. Choosing YouTube in the lobby connects immediately: the
embedded IFrame players ride the viewer's own YouTube login in this browser, so
there is no app-level OAuth client, token, or refresh to manage.

### Spotify

1. Spotify Developer Dashboard > Create app.
2. Redirect URIs: add the exact value of `VITE_OAUTH_REDIRECT_URI`
   (production: `https://wolves.projectbluefin.io/wolves/`; local:
   `http://localhost:5173/wolves/`).
3. Put the client id in `VITE_SPOTIFY_CLIENT_ID`.

Flow: Authorization Code with PKCE (full-page redirect), scopes
`streaming user-read-email user-read-private user-modify-playback-state
user-read-playback-state`. Refresh uses the standard PKCE `refresh_token` grant,
also automatic. In-browser streaming via the Web Playback SDK requires Spotify
Premium; the store surfaces a clear error otherwise.

## Segment configuration

Everything lives in `src/config/wolves-cinematic.ts`. The show runs nine segments:
the prologue (Gayane Ballet Suite Adagio) and the Destiny 2 Into the Light intro
(both carried over from the authored intro sequence in
`src/data/wolves-intro-sequence.ts`, including its 2s/114s trims), then the seven
musical parts. A segment is:

```ts
const segment: CinematicSegment = {
  youtubeId: 'BKm0TPqeOjY', // 11-char YouTube video id
  chapter: 'INTRO', // nameplate detail line
  title: 'Destiny 2: Into the Light Cinematic',
  artist: 'Bungie',
  artwork: 'https://i.ytimg.com/vi/BKm0TPqeOjY/hqdefault.jpg', // public/ path or URL
  crossfadeMs: 1500, // optional; DEFAULT_CROSSFADE_MS (800) otherwise
  startSeconds: 2, // optional authored trim into the source video
  endSeconds: 114, // optional authored cutoff on the native timeline
  excludeFromSoundtrack: true, // non-musical: skipped by the Spotify list
  captionsText: destinyCaptionsRaw, // optional; `seconds|text` per line
}
```

Adding, removing, reordering, or swapping videos is purely a data change here —
no component or composable changes required. Related tunables in the same file:
`PRE_END_THRESHOLD_S` (0.3s early handoff, hides YouTube's trailing black frame)
and `TIME_POLL_MS` (250ms current-time poll; the IFrame API has no timeupdate
event).

Caption tracks use the existing repository format (`seconds|text`, one cue per
line, a cue displays until the next begins), with timestamps keyed to the source
video's native timeline. The intro segment renders
`src/data/wolves-destiny-captions.txt` through the styled Destiny caption system;
any other segment activates the same pipeline by setting `captionsText`.

## The dual-buffer player

While side A plays segment N, side B holds segment N+1 cued, muted, invisible
(`opacity: 0`, `pointer-events: none`). At `duration - 0.3s` (or on the `ENDED`
event as a fallback for throttled tabs) the composable flips `activeSide`: CSS
transitions the two layers' opacity over the segment's crossfade window while a
`requestAnimationFrame` loop ramps `setVolume()` on both players over the same
window. The freed player then cues segment N+2. A transparent shield element
covers both iframes so no YouTube-native control, link, or overlay is ever
reachable; clicks become the app's own play/pause.

Player chrome is stripped with `controls: 0, rel: 0, iv_load_policy: 3,
disablekb: 1, fs: 0, playsinline: 1, modestbranding: 1` (`modestbranding` and
`showinfo` are deprecated upstream no-ops; the former is kept for older embed
behavior, the latter omitted).

## Spotify track list

The application assembles and owns the playlist — there is no user-managed
playlist. The track list mirrors the authored Wolves soundtrack manifest
(`public/wolves-playlist.json`, tracks 1–7), which is the repository's canonical,
human-curated soundtrack for this story. Rationale per track: each is the authored
soundtrack entry for the corresponding part of the series, in series order —
this app deliberately adds no editorial curation of its own.

| # | Track | Artist |
|---|-------|--------|
| 1 | 7 Days to the Wolves | Nightwish |
| 2 | Ghosts In The Mist | Unleash The Archers |
| 3 | Tonight We Must Be Warriors | Avatar |
| 4 | Not Your Monster | The Dark Element |
| 5 | End of You | Poppy |
| 6 | Soulbound | Unleash The Archers |
| 7 | Last Ride of the Day | Nightwish |

At runtime the titles/artists are resolved to Spotify URIs via the Search API and
queued onto the in-browser Web Playback SDK device with a single
`PUT /v1/me/player/play` call. Unresolvable tracks are skipped rather than failing
the show. When the user authenticates with Spotify, both YouTube players are muted
for the entire runtime; when they authenticate with YouTube, Spotify is never
loaded.

## Spotify policy note (read before enabling in production)

`docs/skills/wolves-content-maintenance.md` (commit 3850bf0) records that Spotify's
Web Playback SDK developer policy prohibits synchronizing sound recordings with
visual media, and a prior Wolves Spotify integration was reverted on those
grounds. This application's Spotify path plays the assembled soundtrack while the
YouTube video layer runs, which is exactly that synchronization. The integration
is implemented per the product brief, but a provider-approved audiovisual
arrangement should be obtained before enabling the Spotify path in production;
until then, deploy with `VITE_SPOTIFY_CLIENT_ID` unset — the Spotify lobby
choice fails cleanly when its client id is absent, and the YouTube path needs
no configuration at all.

## Deployment (wolves.projectbluefin.io)

The app builds as the `wolves` entry of the site (`npm run build`, output in
`dist/wolves/`). To serve it at the dedicated domain:

1. Point a CNAME for `wolves.projectbluefin.io` at the GitHub Pages host for this
   repository (or front it with the existing reverse proxy).
2. Serve `dist/wolves/index.html` at the domain root (a Pages redirect or proxy
   rewrite from `/` to `/wolves/` both work; the app itself is path-agnostic —
   all asset fetches use `import.meta.env.BASE_URL`).
3. Register the final public URL as the Spotify redirect URI (see above).
4. Set `VITE_SPOTIFY_CLIENT_ID` as a build-time env var in the deploy workflow
   (only if the Spotify path is enabled — see the policy note above).

## Simplicity audit findings

Conducted before implementation; every system was reduced to the simplest thing
that solves the actual problem.

**Simplified (complexity rejected):**

- No vue-router: the app has three phases (lobby, cinematic, finished) — a single
  store field, not routes.
- No auth library: Spotify PKCE is ~100 lines of documented fetch calls; the
  YouTube path needs no OAuth at all because the embedded player uses the
  viewer's own browser session.
- No animation library: the visual crossfade is a CSS opacity transition keyed off
  one reactive value; only the audio ramp needs JavaScript (rAF) because
  `setVolume` has no CSS equivalent.
- No WebVTT machinery: the repository already has a trivial `seconds|text` caption
  format; the parser is ~30 lines.
- No server-side Spotify playlist creation: search-resolve + play-with-uris ships
  the same result with zero playlist lifecycle management.
- Flat store state: no nested modules, no state machines; the dual-buffer swap is
  a boolean (`swapping`) plus an index.
- sessionStorage over localStorage for tokens: correct lifetime for a one-sitting
  event, smaller exposure surface.

**Complexity kept (and why it is required):**

- Two player instances with cue/swap logic (`useDualBufferPlayer`): a single
  player's `loadVideoById` visibly buffers at every boundary — the one artifact
  this experience must not have. This is the only structurally complex component.
- 250ms polling loop: the IFrame API has no time event; polling is the only way to
  drive captions, progress, and the pre-end handoff.
- Pre-end threshold (0.3s): YouTube videos end on a black frame; swapping exactly
  at `ENDED` shows it. The `ENDED` handler remains as a fallback for throttled
  background tabs.
- Token auto-refresh timer: without it a 60-minute token dies mid-show — the one
  place defensive code is the feature.

## Assumptions

- The seven segments are the first seven tracks of the authored Wolves soundtrack
  manifest, in order. Swapping in different series videos is a config-only change.
- The "segment 3 widget layout" is implemented as the compact unified layout:
  artwork | chapter + title + progress + times | transport controls.
- The YouTube choice is deliberately tokenless: embedded playback works with the
  viewer's existing YouTube browser session, so requiring a Google OAuth client
  would add configuration and consent friction for zero functional gain.
