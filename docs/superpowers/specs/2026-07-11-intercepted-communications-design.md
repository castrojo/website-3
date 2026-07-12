# Intercepted Communications Panel

## Goal

Replace the current quote presentation in the Wolves right column with a
data-driven intercepted-communications transcript. The panel should feel like a
cold terminal capture while remaining easy to maintain by editing JSON.

## Data

Add `src/data/intercepted-communications.json`. Each conversation has:

```json
{
  "title": "Conversation title",
  "channel": "Channel identifier",
  "date": "2326-07-09",
  "messages": [
    {
      "speaker": "CALLER",
      "text": "Message contents.",
      "timestamp": "03:14:22"
    }
  ]
}
```

`timestamp` is optional. Messages remain ordered as authored. The existing
`bazzite-quotes.json` remains available for other content but is no longer the
source for this panel.

## Presentation

The existing right-column card becomes an “Intercepted Communications” panel.
Its header contains a terminal command, channel/status metadata, and the active
conversation title. The body renders each message as a monospace row with an
optional timestamp, speaker label, and message text. Subtle dividers and
terminal coloring provide the intercept-log aesthetic without introducing
animation-heavy effects.

## Interaction

The existing previous/next buttons and ArrowLeft/ArrowRight keyboard controls
rotate between conversations with wrap-around behavior. Manual navigation resets
the existing nine-second automatic rotation timer. Existing input/contenteditable
keyboard guards remain in effect.

## Compatibility and validation

The implementation stays within `WolvesApp.vue` and the new JSON data file,
preserving the existing sticky right-column behavior, responsive layout, and
accessibility labels. TypeScript types will describe the conversation schema.
Existing lint, test, and production build commands must pass.
