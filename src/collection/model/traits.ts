interface Traits {
  background?: TraitData
  body?: TraitData
  face?: TraitData
  hair?: TraitData
  head?: TraitData
  piercing?: TraitData
}

interface TraitData {
  [key: string]: number
}

const traits = {
  background: { type: String, required: false },
  body: { type: String, required: false },
  face: { type: String, required: false },
  hair: { type: String, required: false },
  head: { type: String, required: false },
  piercing: { type: String, required: false },
}

export { Traits, TraitData, traits }
