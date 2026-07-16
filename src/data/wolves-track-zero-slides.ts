export const jonoBaconSlideId = 'wolves/people/interview-jono-bacon-cult-psychology-kubernetes.webp'
export const jonoBaconTrackZeroWindow = {
  startTime: 167.8,
  endTime: 171.88,
} as const

/**
 * The first People slot is Jono's fixed 167.8s–171.88s Track 0 window.
 * Keep him first even when generated wallpaper input order changes.
 */
export function pinJonoBaconAtTrackZeroWindow<T extends { id: string }>(slides: readonly T[]): T[] {
  const jonoIndex = slides.findIndex(slide => slide.id === jonoBaconSlideId)
  if (jonoIndex <= 0) {
    return [...slides]
  }

  return [
    slides[jonoIndex],
    ...slides.slice(0, jonoIndex),
    ...slides.slice(jonoIndex + 1),
  ]
}

// Explicit reservation of ten user-supplied People photos for the fast finale.
export const trackZeroFastFinalePhotoIds: ReadonlySet<string> = new Set([
  'wolves/people/20260709-osc26-distrobox-1.jpg',
  'wolves/people/abigailcabunoc30360.web_.jpg',
  'wolves/people/amberleighruth_reference.jpg',
  'wolves/people/ashleymcnamara35365.jpg',
  'wolves/people/dirkhohndel.faces21994.web_.jpg',
  'wolves/people/faces.jessiefrazella25358.web_.jpg',
  'wolves/people/liz.jpg',
  'wolves/people/rikkiendsley28095-2.jpg',
  'wolves/people/stormy.faces23764.web_.jpg',
  'wolves/people/vmbrasseur.webp',
] as const)

export function splitTrackZeroFastFinaleSlides<T extends { id: string }>(slides: readonly T[]) {
  const finaleSlides = slides.filter(slide => trackZeroFastFinalePhotoIds.has(slide.id))
  const regularSlides = slides.filter(slide => !trackZeroFastFinalePhotoIds.has(slide.id))
  return { regularSlides, finaleSlides }
}
