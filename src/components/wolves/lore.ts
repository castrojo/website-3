import type { WolvesChapter } from '../../data/wolves-story'
import rawBazziteQuotes from '../../data/bazzite-quotes.json'
import rawInterceptedCommunications from '../../data/intercepted-communications.json'

export interface BazziteQuote {
  quote: string
  attribution: string
  context?: string
  date?: string
}

export interface InterceptedMessage {
  speaker: string
  text: string
  timestamp?: string
}

export interface InterceptedConversation {
  title: string
  channel: string
  date: string
  sourceTitle?: string
  sourceCollection?: string
  sourceUrl?: string
  attribution?: string
  messages: InterceptedMessage[]
}

export type WolvesLoreEntry
  = { type: 'quote', data: BazziteQuote }
    | { type: 'conversation', data: InterceptedConversation }

export const bazziteQuotes: BazziteQuote[] = rawBazziteQuotes
export const interceptedCommunications: InterceptedConversation[] = rawInterceptedCommunications

const targetQuoteText = 'In the space of a few days, humanity had lost its future, for the heart of any race is destroyed, and its will to survive is utterly broken, when its children are taken from it.'

const firstQuote = bazziteQuotes.find(q => q.quote === targetQuoteText)
const remainingQuotes = bazziteQuotes.filter(q => q.quote !== targetQuoteText)

export const loreEntries: WolvesLoreEntry[] = [
  ...(firstQuote ? [{ type: 'quote' as const, data: firstQuote }] : []),
  ...remainingQuotes.map(data => ({ type: 'quote' as const, data })),
  ...interceptedCommunications.map(data => ({ type: 'conversation' as const, data }))
]

export function getChapterIdForLore(_entry: WolvesLoreEntry): string {
  return 'prologue'
}

export function getLoreEntriesForChapter(_chapter: WolvesChapter | undefined): WolvesLoreEntry[] {
  return loreEntries
}

export function formatQuoteSource(quote: BazziteQuote): string | null {
  return quote.context ?? null
}
