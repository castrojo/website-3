export interface SignalCharacter {
  value: string
  highlighted: boolean
}

export interface SignalDisplay {
  title: readonly SignalCharacter[]
  subtitle: readonly SignalCharacter[] | null
}

function createCharacters(text: string, highlightedLetters: Set<number>, offset: number): readonly SignalCharacter[] {
  return Object.freeze(
    [...text].map((value, index) => ({
      value,
      highlighted: highlightedLetters.has(offset + index),
    })),
  )
}

export function createSignalDisplay(text: string): SignalDisplay {
  const delimiterIndex = text.indexOf(':')
  const titleText = (delimiterIndex === -1 ? text : text.slice(0, delimiterIndex)).trimEnd()
  const subtitleText = delimiterIndex === -1 ? null : text.slice(delimiterIndex + 1).trimStart()
  const characters = [...(subtitleText ? `${titleText}${subtitleText}` : titleText)]
  const highlightedLetters = new Set<number>()
  let foundB = false
  let foundF = false

  for (const [index, character] of characters.entries()) {
    const lowerCaseCharacter = character.toLowerCase()
    if (lowerCaseCharacter === 'b' && !foundB) {
      highlightedLetters.add(index)
      foundB = true
    }
    else if (lowerCaseCharacter === 'f' && !foundF) {
      highlightedLetters.add(index)
      foundF = true
    }
  }

  return {
    title: createCharacters(titleText, highlightedLetters, 0),
    subtitle: subtitleText
      ? createCharacters(subtitleText, highlightedLetters, [...titleText].length)
      : null,
  }
}
