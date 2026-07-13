import type { WolvesChapter } from '../../data/wolves-story'
import yaml from 'js-yaml'

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

function parseMarkdown<T>(rawContent: string): { metadata: T, body: string } {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (match) {
    const metadata = yaml.load(match[1]) as T
    const body = match[2].trim()
    return { metadata, body }
  }
  return { metadata: {} as T, body: rawContent.trim() }
}

const rawQuotesFiles = import.meta.glob('../../data/lore/quotes/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const rawCommsFiles = import.meta.glob('../../data/lore/communications/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const bazziteQuotes: BazziteQuote[] = Object.values(rawQuotesFiles).map((raw) => {
  const { metadata, body } = parseMarkdown<Omit<BazziteQuote, 'quote'>>(raw)
  return {
    ...metadata,
    quote: body
  }
})

export const interceptedCommunications: InterceptedConversation[] = Object.values(rawCommsFiles).map((raw) => {
  const { metadata, body } = parseMarkdown<Omit<InterceptedConversation, 'messages'>>(raw)

  // Parse body into messages
  const messageBlocks = body.split(/\n{2,}/)
  const messages: InterceptedMessage[] = messageBlocks.map((block) => {
    // Format: **SPEAKER** [03:14:22]: text OR **SPEAKER**: text
    const match = block.match(/^\*\*([^*]+)\*\*(?:\s+\[(.*?)\])?:(.*)$/s)
    if (match) {
      return {
        speaker: match[1],
        timestamp: match[2] || undefined,
        text: match[3].replace(/<br>/g, '\n').trim()
      }
    }
    // Fallback if parsing fails
    return { speaker: 'UNKNOWN', text: block }
  })

  return {
    ...metadata,
    messages
  }
})

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
