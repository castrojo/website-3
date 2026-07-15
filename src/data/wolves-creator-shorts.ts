/**
 * Alternating YouTube Shorts feed for the Wolves immersive theater's Creator Shorts
 * interstitial (played once, between Track 0 and Track 1 of the soundtrack).
 * Video IDs are real public Shorts pulled from each creator's channel (never invented).
 * Order is content: strictly alternating, Lindsay Nikole always goes first.
 */

export interface WolvesCreatorShort {
  videoId: string
  title: string
  creatorName: string
  channelUrl: string
}

export const wolvesCreatorShorts: readonly WolvesCreatorShort[] = [
  { videoId: 'GjSzNxJG1dA', title: 'rocket needs some medicine', creatorName: 'Lindsay Nikole', channelUrl: 'https://www.youtube.com/@LindsayNikole' },
  { videoId: 'e6GCa-E75uk', title: 'My meeting persona vs my quiet working persona', creatorName: 'Cassidy Williams', channelUrl: 'https://www.youtube.com/@cassidoo' },
  { videoId: 'K1DJNw2zHlo', title: 'Hammerheads are getting hammered', creatorName: 'Lindsay Nikole', channelUrl: 'https://www.youtube.com/@LindsayNikole' },
  { videoId: 'Ffhu6TLyuuY', title: 'The boss always knows', creatorName: 'Cassidy Williams', channelUrl: 'https://www.youtube.com/@cassidoo' },
  { videoId: 'Xz8kStQDgUI', title: 'this is INSANE.', creatorName: 'Lindsay Nikole', channelUrl: 'https://www.youtube.com/@LindsayNikole' },
  { videoId: 'cLd205w04do', title: 'Where are the tests', creatorName: 'Cassidy Williams', channelUrl: 'https://www.youtube.com/@cassidoo' },
  { videoId: 'GnBTGEvOuRk', title: 'a gargantuan snack', creatorName: 'Lindsay Nikole', channelUrl: 'https://www.youtube.com/@LindsayNikole' },
  { videoId: 'xCjuz1Q4qbE', title: 'I accidentally discovered a clustering algorithm with Magna-Tiles', creatorName: 'Cassidy Williams', channelUrl: 'https://www.youtube.com/@cassidoo' },
  { videoId: 'vHEOX5i9HBE', title: 'complete and total freaks', creatorName: 'Lindsay Nikole', channelUrl: 'https://www.youtube.com/@LindsayNikole' },
  { videoId: 'yvhbINxBR6k', title: 'Beyonce knows eslint', creatorName: 'Cassidy Williams', channelUrl: 'https://www.youtube.com/@cassidoo' },
  { videoId: 'CqyzFjfmLhU', title: 'this is a real seal', creatorName: 'Lindsay Nikole', channelUrl: 'https://www.youtube.com/@LindsayNikole' },
  { videoId: 'cIaNRGkZQdM', title: 'React is like paella', creatorName: 'Cassidy Williams', channelUrl: 'https://www.youtube.com/@cassidoo' },
] as const
