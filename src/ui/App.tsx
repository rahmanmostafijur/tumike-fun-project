import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import type { Mode } from '../engine/selection'
import type { QuizResult } from '../engine/scoring'
import { randomSeed } from '../engine/rng'
import { rarityOf } from '../engine/scoring'
import { getAnyPack, getPack, listedPacks, packErrors, packs } from '../packs'
import { useI18n } from '../i18n/I18n'
import { addToCollection, getCollection, getLastPack, setLastPack } from '../storage/storage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Landing } from './screens/Landing'
import { FanSince } from './screens/FanSince'
import { QuestionScreen } from './screens/Question'
import { Reveal } from './screens/Reveal'
import { Result } from './screens/Result'
import { Collection } from './screens/Collection'
import { ErrorScreen } from './screens/ErrorScreen'
import { applyTheme } from './util'
import { Scenery } from './scenery/Scenery'
import { DEFAULT_VIEW, SceneryViewProvider, type SceneryView } from './scenery/view'
import { DEFAULT_PACK_ID } from '../config'

type Screen =
  | { name: 'landing' }
  | { name: 'fanSince'; mode: Mode }
  | { name: 'quiz'; mode: Mode; seed: number; fanSinceId: string | null }
  // `mode` is the mode just played, so "Play again" repeats it.
  | { name: 'reveal'; mode: Mode; result: QuizResult; fanSinceId: string | null; isNew: boolean }
  | { name: 'result'; mode: Mode; result: QuizResult; fanSinceId: string | null; isNew: boolean }
  | { name: 'collection'; back: Screen }

/** Deep link (?pack= or #id) first, then the last viewed pack, then the default. */
function initialViewId(): string | undefined {
  const fromQuery = new URLSearchParams(window.location.search).get('pack')
  const fromHash = decodeURIComponent(window.location.hash.slice(1))
  const found = [fromQuery, fromHash, getLastPack(), DEFAULT_PACK_ID].map(getAnyPack).find(Boolean)
  return found?.id ?? listedPacks[0]?.id ?? packs[0]?.id
}

/** Dev-only QA shortcut: ?preview=<characterId> opens that result card directly. */
function previewScreen(): Screen | null {
  if (!import.meta.env.DEV) return null
  const params = new URLSearchParams(window.location.search)
  const pack = getPack(params.get('pack')) ?? getPack(DEFAULT_PACK_ID) ?? packs[0]
  const c = pack?.characters.find((ch) => ch.id === params.get('preview'))
  if (!pack || !c) return null
  const result: QuizResult = {
    characterId: c.id, tier: c.tier ?? 'legend', trait: c.trait ?? pack.traits[0]?.id ?? '', rarity: rarityOf(c),
    knowledgePercent: 80, correct: 5, knowledgeTotal: 6, matchPercent: 87, dark: c.kind === 'dark', secret: c.kind === 'secret',
  }
  const mode: Mode = params.get('mode') === 'full' ? 'full' : 'quick'
  return { name: params.get('reveal') ? 'reveal' : 'result', mode, result, fanSinceId: pack.fanSince.options[0]?.id ?? null, isNew: true }
}

export function App() {
  const { t } = useI18n()
  // The carousel can show any pack; games always use the last playable one.
  const [viewId, setViewId] = useState(initialViewId)
  const viewPack = getAnyPack(viewId)
  const [packId, setPackId] = useState(() => getPack(viewId)?.id ?? getPack(DEFAULT_PACK_ID)?.id ?? packs[0]?.id)
  const pack = getPack(packId)
  const [screen, setScreen] = useState<Screen>(() => previewScreen() ?? { name: 'landing' })
  const [playerName, setPlayerName] = useState('')
  const [view, setView] = useState<SceneryView>(DEFAULT_VIEW)
  const [unlocked, setUnlocked] = useState<string[]>(() => (packId ? getCollection(packId) : []))

  // Landing shows listed packs, plus the current one if it was opened by URL.
  const visiblePacks = useMemo(
    () => (viewPack && !viewPack.listed ? [...listedPacks, viewPack] : listedPacks),
    [viewPack],
  )

  // Landing follows the carousel; every other screen belongs to the playable pack.
  const scenePack = screen.name === 'landing' ? (viewPack ?? pack) : pack

  useLayoutEffect(() => {
    if (scenePack) applyTheme(scenePack.theme)
  }, [scenePack])

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [screen.name])

  const selectPack = useCallback((id: string) => {
    setViewId(id)
    setLastPack(id)
    if (getPack(id)) {
      setPackId(id)
      setUnlocked(getCollection(id))
    }
    try {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${encodeURIComponent(id)}`)
    } catch {
      // Some embedded browsers block history updates; the deep link is optional.
    }
  }, [])

  // Follow in-page #hash changes (deep links opened while the app is running).
  useEffect(() => {
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (getAnyPack(id)) selectPack(id)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [selectPack])

  const finishQuiz = useCallback(
    (result: QuizResult, fanSinceId: string | null, mode: Mode) => {
      if (!pack) return
      // In-memory state is the source of truth, so the collection still works
      // for this session when localStorage is blocked.
      const isNew = !unlocked.includes(result.characterId)
      addToCollection(pack.id, result.characterId)
      if (isNew) setUnlocked([...unlocked, result.characterId])
      setScreen({ name: 'reveal', mode, result, fanSinceId, isNew })
    },
    [pack, unlocked],
  )

  const home = useCallback(() => setScreen({ name: 'landing' }), [])

  if (!pack) {
    return (
      <div className="app-frame">
        <ErrorScreen message={packErrors.length ? `${t('error.noPack')} (${packErrors[0]?.message})` : t('error.noPack')} onRestart={() => window.location.reload()} />
      </div>
    )
  }

  const character = (id: string) => pack.characters.find((c) => c.id === id)

  const renderScreen = () => {
    switch (screen.name) {
      case 'landing':
        return (
          <Landing
            packs={visiblePacks}
            selected={viewPack ?? pack}
            onSelect={selectPack}
            name={playerName}
            onNameChange={setPlayerName}
            onStart={(mode) => setScreen({ name: 'fanSince', mode })}
            onCollection={() => setScreen({ name: 'collection', back: screen })}
          />
        )
      case 'fanSince':
        return (
          <FanSince
            pack={pack}
            onBack={home}
            onPick={(fanSinceId) => setScreen({ name: 'quiz', mode: screen.mode, seed: randomSeed(), fanSinceId })}
          />
        )
      case 'quiz':
        return (
          <QuestionScreen
            key={screen.seed}
            pack={pack}
            mode={screen.mode}
            seed={screen.seed}
            onQuit={home}
            onFinish={(result) => finishQuiz(result, screen.fanSinceId, screen.mode)}
          />
        )
      case 'reveal': {
        const c = character(screen.result.characterId)
        if (!c) return <ErrorScreen onRestart={home} />
        return (
          <Reveal
            pack={pack}
            character={c}
            rarity={screen.result.rarity}
            playerName={playerName}
            onDone={() => setScreen({ ...screen, name: 'result' })}
          />
        )
      }
      case 'result': {
        const c = character(screen.result.characterId)
        if (!c) return <ErrorScreen onRestart={home} />
        return (
          <Result
            pack={pack}
            result={screen.result}
            character={c}
            playerName={playerName}
            fanSinceId={screen.fanSinceId}
            unlocked={unlocked.length}
            isNew={screen.isNew}
            onHome={home}
            onPlayAgain={() => setScreen({ name: 'fanSince', mode: screen.mode })}
            onCollection={() => setScreen({ name: 'collection', back: { ...screen, isNew: false } })}
          />
        )
      }
      case 'collection':
        return (
          <Collection
            pack={pack}
            unlocked={unlocked}
            onBack={() => setScreen(screen.back)}
            onPlay={() => setScreen({ name: 'fanSince', mode: 'quick' })}
          />
        )
    }
  }

  return (
    <SceneryViewProvider value={setView}>
      <div className="app-frame">
        <Scenery pack={scenePack ?? pack} view={view} />
        <ErrorBoundary fallback={(reset) => <ErrorScreen onRestart={() => { reset(); home() }} />}>
          {renderScreen()}
        </ErrorBoundary>
      </div>
    </SceneryViewProvider>
  )
}
