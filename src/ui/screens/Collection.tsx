import type { CSSProperties } from 'react'
import type { Character, Pack, Rarity } from '../../engine/schema'
import { rarityOf } from '../../engine/scoring'
import { useI18n } from '../../i18n/I18n'
import { useSceneryView } from '../scenery/view'
import { IconButton, PrimaryButton } from '../components/Button'
import { MiniCard } from '../card/ResultCard'
import { monogramOf } from '../util'

interface CollectionProps {
  pack: Pack
  unlocked: readonly string[]
  onBack: () => void
  onPlay: () => void
}

const ORDER: Rarity[] = ['legend', 'skilled', 'beginner', 'dark', 'secret']

function sortCharacters(characters: readonly Character[], traitOrder: readonly string[]): Character[] {
  return [...characters].sort((a, b) => {
    const r = ORDER.indexOf(rarityOf(a)) - ORDER.indexOf(rarityOf(b))
    return r !== 0 ? r : traitOrder.indexOf(a.trait ?? '') - traitOrder.indexOf(b.trait ?? '')
  })
}

export function Collection({ pack, unlocked, onBack, onPlay }: CollectionProps) {
  const { t, loc } = useI18n()
  useSceneryView('dim')
  const total = pack.characters.length
  const count = pack.characters.filter((c) => unlocked.includes(c.id)).length
  const characters = sortCharacters(pack.characters, pack.traits.map((tr) => tr.id))

  return (
    <main className="screen screen-enter">
      <header className="relative grid grid-cols-[44px_1fr_44px] items-center">
        <IconButton icon="arrowLeft" label={t('collection.back')} onClick={onBack} />
        <h1 className="text-center font-display text-[20px] text-ink">{t('collection.title')}</h1>
        <span aria-hidden="true" />
      </header>

      <section className="relative mt-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[15px] font-semibold text-ink">{t('collection.count', { u: count, n: total })}</p>
          <p className="text-[13px] text-muted">{loc(pack.title)}</p>
        </div>
        <div
          className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={count}
          aria-label={t('collection.count', { u: count, n: total })}
        >
          <div className="h-full origin-left rounded-full bg-accent transition-transform duration-700" style={{ transform: `scaleX(${total ? count / total : 0})` }} />
        </div>
      </section>

      {count === 0 && (
        <div className="relative mt-5 rounded-[14px] border border-dashed border-line px-4 py-4 text-center">
          <p className="text-[15px] leading-6 text-ink">{t('collection.empty')}</p>
          <PrimaryButton className="mt-3.5" onClick={onPlay}>{t('collection.play')}</PrimaryButton>
        </div>
      )}

      <ul className="stagger relative mt-5 grid grid-cols-3 gap-2.5">
        {characters.map((c, i) => {
          const isUnlocked = unlocked.includes(c.id)
          const rarity = rarityOf(c)
          return (
            <li key={c.id} style={{ '--i': Math.min(i, 12) } as CSSProperties}>
              <MiniCard
                name={loc(c.name)}
                monogram={monogramOf(c)}
                rarity={rarity}
                rarityLabel={loc(pack.tiers.labels[rarity])}
                locked={!isUnlocked}
                lockedLabel={`${t('collection.locked')}, ${loc(pack.tiers.labels[rarity])}`}
              />
            </li>
          )
        })}
      </ul>
      {count > 0 && count < total && <p className="relative mt-5 text-center text-[13.5px] text-muted">{t('collection.hint')}</p>}
    </main>
  )
}
