import { createContext, useContext, useEffect } from 'react'

/** What the shared background should show for the current screen. */
export type SceneryKind = 'landing' | 'journey' | 'reveal' | 'dim'

export interface SceneryView {
  kind: SceneryKind
  /** Journey progress from 0 (first stage) to 1 (last stage). */
  progress: number
}

export const DEFAULT_VIEW: SceneryView = { kind: 'landing', progress: 0 }

const SetViewContext = createContext<(view: SceneryView) => void>(() => undefined)

export const SceneryViewProvider = SetViewContext.Provider

/** Screens call this to tell the shared background what to show. */
export function useSceneryView(kind: SceneryKind, progress = 0): void {
  const setView = useContext(SetViewContext)
  useEffect(() => {
    setView({ kind, progress })
  }, [setView, kind, progress])
}
