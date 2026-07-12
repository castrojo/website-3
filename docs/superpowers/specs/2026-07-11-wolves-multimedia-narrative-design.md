# Wolves Multimedia Narrative Experience

- **Status:** approved for planning
- **Date:** 2026-07-11
- **Route:** `/wolves/`
- **Goal:** Turn the existing comic reader, soundtrack, and lore artifacts into one accessible, chronological Project Bluefin story.

## Scope

This revision preserves the current Bluefin visual identity, PDF comic source, and support links. It changes how visitors enter, navigate, and revisit the experience:

1. The soundtrack becomes an explicit, above-the-fold story choice.
2. The comic is paced as named chapters instead of an undifferentiated PDF stack.
3. Timeline artifacts become a stable chronological archive with direct links and new-entry cues.
4. Audio, comic chapters, and artifacts share one progress model.
5. The reader renders only the pages needed for the current reading context.

Restoring the missing production `/wolves/` deployment route is a release requirement, not a UI change.

## Experience Flow

### Arrival

The hero presents the title, premise, and two equal choices:

- **Enter With Soundtrack** starts audio after a user gesture.
- **Read Silently** enters without audio.

The page must not autoplay. After either choice, the reader receives a compact, persistent score control with play/pause, mute, current chapter, track title, and a clear reopen control if dismissed. It must remain visible without covering controls or comic content.

### Reading

The comic starts in paged mode. Each chapter has a title, short narrative purpose, page range, and a score cue. Visitors can choose continuous reading, but the application only renders pages near the viewport. Page progression updates the chapter rail and the score control; it must never force a YouTube track change without a user action.

At chapter boundaries, a related archive artifact appears between comic pages. The reader can open the source, continue reading, or browse the entire archive. Artifacts are optional narrative enrichment, never a gate on page navigation.

### Return Visits

The archive records the latest visited release in local storage. On a later visit, the page identifies entries published since that release and provides a **Continue From Latest Transmission** action. A visitor who has no saved state sees the canonical chronological order from the beginning.

## Components & Data

### Story Manifest

Add a versioned Wolves story manifest in `src/data/` with:

- Release ID and published date.
- Ordered chapters: ID, title, page range, description, soundtrack label, and associated artifact IDs.
- Ordered artifacts: stable ID, date, type, title, content/source metadata, and chapter ID.

The manifest is the single source of truth for reading order. Existing quotes and intercepted communications are migrated into its artifact records or referenced by ID. Random rotation is removed from canonical content.

### Archive

The archive renders one ordered collection, newest or oldest first according to a clearly labelled control. Artifact types are visually distinct:

- **Transmission:** terminal/message treatment.
- **Quote:** pull quote treatment.
- **News:** clipped bulletin treatment.
- **External source:** citation with destination and attribution.

Each record has a permalink fragment, semantic date, type label, and accessible heading. Filters and expanded artifact state are represented in the URL so shared links reproduce the same view.

### Soundtrack Control

The player is a Vue-owned shell around the existing user-initiated YouTube playlist embed. Before playback, it says **Start Soundtrack**; after the user starts it, it shows the actual active state. The control does not claim playback succeeded unless the embed has loaded. A normal link to the playlist provides an escape hatch if embedding fails.

Audio cues are descriptive labels tied to chapters, not automatic synchronization or playback control. This keeps the experience predictable, works with the iframe limitation, and honors browser autoplay rules.

### Comic Reader

Keep PDF.js and responsive canvas rendering, but:

- Default to page-by-page reading.
- Render the active page plus adjacent pages only.
- Render continuous pages with `IntersectionObserver` as they approach the viewport.
- Preserve page controls, select navigation, and keyboard navigation.
- Publish textual page descriptions in the story manifest for nonvisual access.

## Accessibility & Motion

- Every custom interactive surface is a semantic button or link with visible `:focus-visible` styling.
- The player and reader provide at least 44px touch targets.
- The soundtrack bar reserves mobile bottom safe-area space and the document receives matching bottom padding.
- Comic pages expose descriptive accessible text, not only page numbers.
- Artifact changes are never automatic. Decorative ambient motion and score visualizers are disabled by `prefers-reduced-motion`.
- The archive uses semantic headings, lists, times, and source links.

## Performance & Failure Handling

- Do not eagerly rasterize every PDF page.
- Preload only opening art and defer the PDF library until a reading action or reader viewport approach.
- Provide loading progress and a retry action when the PDF or player cannot load.
- Keep the page readable when YouTube, PDF.js CDN, or external source links fail.
- Use `import.meta.env.BASE_URL` for all first-party Wolves assets.

## Acceptance Criteria

1. `/wolves/` is deployed and returns the campaign page rather than a 404.
2. Above the fold, a visitor can choose soundtrack or silent reading.
3. Sound playback starts only from a user action and remains controllable across the experience.
4. Comic chapters, score cue labels, and related artifacts share one ordered manifest.
5. The archive is chronological, filterable, direct-linkable, and indicates entries new since a previous visit.
6. The reader does not render the full PDF on initial load.
7. Mobile navigation, comic controls, player controls, and archive filters are keyboard- and touch-accessible.
8. `npm run test:run`, `npm run typecheck`, `npm run lint`, and `npm run build` pass.
