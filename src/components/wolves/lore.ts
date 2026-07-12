import type { WolvesChapter } from '../../data/wolves-story'
import rawBazziteQuotes from '../../data/bazzite-quotes.json'
import { shuffleLoreEntries } from '../../utils/loreRotation'

export interface BazziteQuote {
  quote: string
  attribution: string
  context?: string
  date?: string
}

export interface WolvesLoreEntry { type: 'quote', data: BazziteQuote }

export const bazziteQuotes: BazziteQuote[] = rawBazziteQuotes

// Placeholder quote entries are intentionally loaded from bazzite-quotes.json
// until approved Discord quotes are provided.
const loreEntries = shuffleLoreEntries([
  ...bazziteQuotes.map(data => ({ type: 'quote' as const, data })),
])

export function getChapterIdForLore(entry: WolvesLoreEntry): string {
  const chapterIds = ['prologue', 'pursuit', 'awakening'] as const
  const quoteIndex = bazziteQuotes.findIndex(quote => quote.quote === entry.data.quote)
  if (quoteIndex === -1) {
    return 'prologue'
  }
  return chapterIds[quoteIndex % chapterIds.length]
}

export function getLoreEntriesForChapter(chapter: WolvesChapter | undefined): WolvesLoreEntry[] {
  if (!chapter) {
    return []
  }

  return loreEntries.filter(entry => getChapterIdForLore(entry) === chapter.id)
}

export function formatQuoteSource(quote: BazziteQuote): string | null {
  return quote.context ?? null
}
