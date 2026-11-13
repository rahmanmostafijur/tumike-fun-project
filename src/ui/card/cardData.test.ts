import { describe, expect, test } from 'vitest'
import { getPack } from '../../packs/index'
import { computeResult } from '../../engine/scoring'
import { buildCardData } from './cardData'

const perfect = Array.from({ length: 8 }, () => ({ correct: true }))
const brave = [1, 2, 3].map((stage) => ({ stage, weights: { brave: 2 }, dark: false }))

function secretCard(packId: string, lang: 'bn' | 'en') {
  const pack = getPack(packId)!
  const result = computeResult(pack, 'full', perfect, brave)
  const character = pack.characters.find((c) => c.id === result.characterId)!
  return { character, card: buildCardData({ pack, character, result, lang, playerName: '', fanBadge: null }) }
}

describe('result card data', () => {
  test('the Tin Goyenda secret card shows no trait badge and no match percentage', () => {
    for (const lang of ['bn', 'en'] as const) {
      const { character, card } = secretCard('tin-goyenda', lang)
      expect(character.id).toBe('tin-goyenda')
      expect(card.traitLabel).toBeNull()
      expect(card.match).toBeNull()
    }
  })

  test('other secret cards keep their trait badge and match percentage', () => {
    for (const id of ['harry-potter', 'money-heist', 'breaking-bad', 'game-of-thrones', 'himu-misir-ali']) {
      const { card } = secretCard(id, 'en')
      expect(card.traitLabel, id).toBeTruthy()
      expect(card.match, id).toMatch(/\d+%/)
    }
  })
})
