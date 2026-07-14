# Wolves Change Guardrails

Follow `AGENTS.md` for the repository-wide workflow. These rules prevent regressions in the Wolves fullscreen experience.

## Content boundaries

- Treat Wolves top-bar communications, lower thesis story, and lore-column narrative as separate content layers.
- `WolvesThesisState.hudLabel` is for top-bar communications. `WolvesThesisState.text` is for the lower thesis overlay. Never route, replace, or reuse text across those layers.
- Treat the thesis timeline as locked authored data. Before modifying `src/data/wolves-thesis-sequence.ts`, inspect its history and canonical Wolves documentation. Preserve exact text and timing boundaries with regression tests.
- Editable incoming-signal data may change the top-bar communications only. It must never erase, replace, reorder, or otherwise alter thesis-story text.

## Visual changes and verification

- Before changing Wolves layout, inspect the fullscreen regions in `src/WolvesApp.vue`: the top HUD has an 80px budget, the footer has a 140px budget, and the desktop content split is `2fr 1fr`.
- Do not add prominent controls or widgets to the footer unless local desktop and mobile screenshots prove they fit without displacing controls.
- Keep visual and layout experiments local until screenshots have been reviewed and approved before committing or pushing.
- For every Wolves change, verify the rendered page by moving the real soundtrack progress bar to each affected Track 0 timestamp. Assert the visible top-bar and lower-overlay DOM separately; a successful build or bundle-string check is not sufficient.
