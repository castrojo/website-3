export interface DinosaurSpecies {
  id: string
  scientificName: string
  documentationUrl: string
  artwork: string
}

export const dinosaurSpecies = [
  {
    id: 'bluefin',
    scientificName: 'Deinonychus antirrhopus',
    documentationUrl: 'https://docs.projectbluefin.io/dinosaurs/#bluefin',
    artwork: './characters/bluefin-small.webp',
  },
  {
    id: 'achillobator',
    scientificName: 'Achillobator giganticus',
    documentationUrl: 'https://docs.projectbluefin.io/dinosaurs/#bluefin-lts-and-gdx',
    artwork: './characters/achillobator.webp',
  },
  {
    id: 'karl',
    scientificName: 'Amargasaurus cazaui',
    documentationUrl: 'https://docs.projectbluefin.io/dinosaurs/#kubernetes',
    artwork: './characters/karl.webp',
  },
  {
    id: 'dolly',
    scientificName: 'Dimetrodon limbatus',
    documentationUrl: 'https://docs.projectbluefin.io/dinosaurs/#homebrew',
    artwork: './characters/dolly.webp',
  },
  {
    id: 'dakotaraptor',
    scientificName: 'Dakotaraptor steini',
    documentationUrl: 'https://docs.projectbluefin.io/dinosaurs/#-redacted-',
    artwork: './characters/dakota.webp',
  },
  {
    id: 'utahraptor',
    scientificName: 'Utahraptor ostrommaysi',
    documentationUrl: 'https://docs.projectbluefin.io/dinosaurs/#-redacted--1',
    artwork: './characters/utah.webp',
  },
] as const satisfies readonly DinosaurSpecies[]
