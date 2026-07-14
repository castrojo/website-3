export interface WolvesNarrativeSlot {
  artifactId: string
  startTime: number
  endTime: number
}

interface WolvesNarrativeLock {
  artifactId: string
  startTime: number
  endTime?: number
}

export const lockedNarrativeSlots: readonly WolvesNarrativeLock[] = [
  { artifactId: 'arthur-c-clarke-4', startTime: 0 },
  { artifactId: 'lorem-pursuit-1', startTime: 150, endTime: 220 },
  { artifactId: 'blue-universal-acquires-wayland-yutani', startTime: 398, endTime: 425 },
]

export const wolvesNarrativeTimeline: readonly WolvesNarrativeSlot[] = [
  { artifactId: 'arthur-c-clarke-4', startTime: 0, endTime: 5.680359435173299 },
  { artifactId: 'arthur-c-clarke-1', startTime: 5.680359435173299, endTime: 14.441591784338897 },
  { artifactId: 'arthur-c-clarke-2', startTime: 14.441591784338897, endTime: 25.41720154043646 },
  { artifactId: 'arthur-c-clarke-3', startTime: 25.41720154043646, endTime: 29.043645699614892 },
  { artifactId: 'ishtar-gardener-and-winnower', startTime: 29.043645699614892, endTime: 36.55327342747112 },
  { artifactId: 'ishtar-flower-game', startTime: 36.55327342747112, endTime: 49.229781771501926 },
  { artifactId: 'ishtar-first-knife', startTime: 49.229781771501926, endTime: 62.51604621309371 },
  { artifactId: 'ishtar-the-wager', startTime: 62.51604621309371, endTime: 77.37483953786906 },
  { artifactId: 'reckoning-of-the-three', startTime: 77.37483953786906, endTime: 85.26957637997432 },
  { artifactId: 'ishtar-patternfall', startTime: 85.26957637997432, endTime: 101.18741976893453 },
  { artifactId: 'committee-report-personal-transmission', startTime: 101.18741976893453, endTime: 109.59563543003851 },
  { artifactId: 'ishtar-cambrian-explosion', startTime: 109.59563543003851, endTime: 124.93581514762516 },
  { artifactId: 'john-bazzite-interview', startTime: 124.93581514762516, endTime: 136.8100128369705 },
  { artifactId: 'ishtar-final-shape', startTime: 136.8100128369705, endTime: 150 },
  { artifactId: 'lorem-pursuit-1', startTime: 150, endTime: 220 },
  { artifactId: 'lorem-awakening-1', startTime: 220, endTime: 226.59259259259258 },
  { artifactId: 'do-not-reply', startTime: 226.59259259259258, endTime: 231.2856246076585 },
  { artifactId: 'quote-unmarked-grave', startTime: 231.2856246076585, endTime: 233.37141661435444 },
  { artifactId: 'quote-third-disciple', startTime: 233.37141661435444, endTime: 236.50010462439838 },
  { artifactId: 'maintenance-window', startTime: 236.50010462439838, endTime: 242.1242937853107 },
  { artifactId: 'quote-berkus', startTime: 242.1242937853107, endTime: 247.48775894538602 },
  { artifactId: 'lorem-prologue-1', startTime: 247.48775894538602, endTime: 257.09730069052097 },
  { artifactId: 'lorem-prologue-2', startTime: 257.09730069052097, endTime: 279.85478133500726 },
  { artifactId: 'forbidden-factory', startTime: 279.85478133500726, endTime: 286.0749110692613 },
  { artifactId: 'jordan-adrian', startTime: 286.0749110692613, endTime: 307.417032852061 },
  { artifactId: 'quote-childhoods-end-future', startTime: 307.417032852061, endTime: 308.68340657041216 },
  { artifactId: 'quote-natasha-woods', startTime: 308.68340657041216, endTime: 310.84369114877586 },
  { artifactId: 'childhoods-end-wager', startTime: 310.84369114877586, endTime: 321.98033061309894 },
  { artifactId: 'glorious-eggroll', startTime: 321.98033061309894, endTime: 350.54823184766684 },
  { artifactId: 'project-neptune', startTime: 350.54823184766684, endTime: 356.8428541535886 },
  { artifactId: 'john-seager', startTime: 356.8428541535886, endTime: 398 },
  { artifactId: 'blue-universal-acquires-wayland-yutani', startTime: 398, endTime: 425 },
]

export function getNarrativeSlotForTime(time: number): WolvesNarrativeSlot {
  const normalizedTime = Math.max(0, time)
  return wolvesNarrativeTimeline.find(slot => normalizedTime < slot.endTime)
    ?? wolvesNarrativeTimeline[wolvesNarrativeTimeline.length - 1]
}
