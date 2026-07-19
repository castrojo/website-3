/**
 * Generic multimedia experience manifest.
 *
 * One schema describes any tour the cinematic runtime can play: the authored
 * Wolves cinematic, a back-catalogue album, or a hand-written mix of media.
 * The runtime (stores/cinematic.ts + CinematicStage + MediaWidget) consumes a
 * manifest; it never hardcodes content. Modeled on the CinematicSegment
 * pattern in src/config/wolves-cinematic.ts.
 *
 * Media types:
 * - 'youtube' (default): segment.youtubeId plays through the dual-buffer
 *   player with optional startSeconds/endSeconds trims.
 * - 'image': a still image URL shown for durationSeconds.
 *   ponytail: schema-level only today; the renderer plays youtube segments
 *   (every shipped experience is a YouTube playlist). Implement an image
 *   layer in CinematicStage when the first image-based experience is authored.
 *
 * Synced text: segment.captionsText carries `seconds|text` cues on the source
 * media's native timeline (same format as src/data/wolves-destiny-captions.txt),
 * rendered by CinematicCaptions. For image segments the cue clock is the
 * segment's own elapsed time.
 *
 * Example manifests (the three canonical shapes):
 *
 * // 1. Image-based album (per-slide text binding via captionsText at 0s)
 * const imageAlbum: ExperienceManifest = {
 *   id: 'field-notes',
 *   title: 'Field Notes',
 *   subtitle: 'Expedition stills',
 *   artwork: 'experiences/field-notes.jpg',
 *   segments: [
 *     { id: 'plate-1', kind: 'image', imageUrl: 'experiences/plate-1.jpg',
 *       chapter: 'PLATE 1', title: 'Ridge line', artist: 'Bluefin',
 *       artwork: 'experiences/plate-1.jpg', durationSeconds: 12,
 *       captionsText: '0|North face, first light' },
 *   ],
 * }
 *
 * // 2. YouTube playlist with synced text overlays
 * const youtubeAlbum: ExperienceManifest = {
 *   id: 'requiem',
 *   title: 'Harbringer: Requiem',
 *   artwork: 'experiences/PLhiPP9M5fgWE.jpg',
 *   segments: [
 *     { id: 'track-1', kind: 'youtube', youtubeId: 'dQw4w9WgXcQ',
 *       chapter: 'TRACK 1', title: 'Opening', artist: 'Artist',
 *       artwork: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
 *       durationSeconds: 213, captionsText: '4.5|First cue\n12|Second cue' },
 *   ],
 * }
 *
 * // 3. Mixed media (stills interleaved with video, trims applied)
 * const mixed: ExperienceManifest = {
 *   id: 'launch-recap',
 *   title: 'Launch Recap',
 *   artwork: 'experiences/launch.jpg',
 *   segments: [
 *     { id: 'cold-open', kind: 'image', imageUrl: 'experiences/cold-open.jpg',
 *       chapter: 'PART I', title: 'Cold open', artist: 'Bluefin',
 *       artwork: 'experiences/cold-open.jpg', durationSeconds: 8 },
 *     { id: 'keynote', kind: 'youtube', youtubeId: 'abc123xyz00',
 *       chapter: 'PART II', title: 'Keynote', artist: 'Bluefin',
 *       artwork: 'https://i.ytimg.com/vi/abc123xyz00/hqdefault.jpg',
 *       durationSeconds: 95, startSeconds: 30, endSeconds: 125,
 *       crossfadeMs: 1500 },
 *   ],
 * }
 */

import type { CinematicSegment } from '@/config/wolves-cinematic'

export type ExperienceMediaKind = 'youtube' | 'image'

/**
 * One playable segment. Extends the wolves CinematicSegment so the existing
 * runtime consumes it unchanged; adds the authored duration (drives the
 * overall seek-bar timeline) and the media kind.
 */
export interface ExperienceSegment extends CinematicSegment {
  /** Media type; omitted means 'youtube'. */
  kind?: ExperienceMediaKind
  /** Image URL for kind 'image' (relative to BASE_URL or absolute). */
  imageUrl?: string
  /** Authored segment length in seconds; drives overall timeline math. */
  durationSeconds: number
}

export interface ExperienceManifest {
  /** Stable identifier. */
  id: string
  /** Launcher card + lobby title. */
  title: string
  /** Optional launcher card sub-line. */
  subtitle?: string
  /** Cover artwork (relative to BASE_URL or absolute). Never re-encoded. */
  artwork: string
  /** Optional credits line for the launcher card. */
  credits?: string
  /**
   * Mount the authored Wolves intro sequence before the segments. Only the
   * Wolves experience sets this; it is authored content, not generic.
   */
  includeIntro?: boolean
  segments: ExperienceSegment[]
}

/** Shape of public/experiences/catalogue.json (generated, see scripts/update-back-catalogue.js). */
export interface BackCatalogue {
  experiences: ExperienceManifest[]
}

/**
 * Runtime validation for the fetched catalogue. Trust boundary: the JSON is
 * generated in-repo, so only structural sanity is checked.
 */
export function parseBackCatalogue(data: unknown): BackCatalogue {
  if (!data || typeof data !== 'object' || !Array.isArray((data as BackCatalogue).experiences)) {
    throw new TypeError('Malformed back catalogue: expected an experiences array')
  }
  for (const experience of (data as BackCatalogue).experiences) {
    if (typeof experience?.id !== 'string' || typeof experience?.title !== 'string'
      || typeof experience?.artwork !== 'string' || !Array.isArray(experience?.segments)) {
      throw new TypeError('Malformed back catalogue: bad experience entry')
    }
    for (const segment of experience.segments) {
      if (typeof segment?.id !== 'string' || typeof segment?.title !== 'string'
        || typeof segment?.durationSeconds !== 'number'
        || (segment.kind !== 'image' && typeof segment?.youtubeId !== 'string')) {
        throw new TypeError(`Malformed back catalogue: bad segment in ${experience.id}`)
      }
    }
  }
  return data as BackCatalogue
}
