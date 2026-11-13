import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ChangeEvent } from 'react'
import type { Character, Pack } from '../../engine/schema'
import type { QuizResult } from '../../engine/scoring'
import { useI18n } from '../../i18n/I18n'
import { useSceneryView } from '../scenery/view'
import { IconButton, PrimaryButton, SecondaryButton } from '../components/Button'
import { Icon } from '../components/Icon'
import { ResultCard } from '../card/ResultCard'
import { buildCardData, shareText } from '../card/cardData'
import { renderCardImage, type ExportFormat } from '../card/exportCard'
import { downloadBlob, shareImage } from '../card/share'
import { PHOTO_ACCEPT, readPhoto, type PhotoSource } from '../photo/decode'
import { PhotoCrop } from '../photo/PhotoCrop'
import { treatPhoto } from '../photo/render'
import { initialPhotoState, photoReducer, type PhotoAction, type PhotoState } from '../photo/state'
import { photoLook } from '../photo/treatment'
import { haptic } from '../util'

interface ResultProps {
  pack: Pack
  result: QuizResult
  character: Character
  playerName: string
  fanSinceId: string | null
  unlocked: number
  isNew: boolean
  /** The player's cropped photo for this result, kept in memory by the parent. */
  photo: HTMLCanvasElement | null
  onPhotoChange: (photo: HTMLCanvasElement | null) => void
  onPlayAgain: () => void
  onHome: () => void
  onCollection: () => void
}

type Toast = { kind: 'info' | 'error'; text: string } | null
type CardPhotoState = PhotoState<PhotoSource, HTMLCanvasElement>
type CardPhotoAction = PhotoAction<PhotoSource, HTMLCanvasElement>
const TOAST_MS = 4200
const PHOTO_BUTTON_ID = 'result-photo-button'

const cardPhotoReducer = (s: CardPhotoState, a: CardPhotoAction): CardPhotoState => photoReducer(s, a)

function Notice({ kind, text }: { kind: 'info' | 'error'; text: string }) {
  return (
    <p className={`fade-in mt-3 flex items-start gap-2 rounded-[14px] border px-3.5 py-2.5 text-[14px] ${kind === 'error' ? 'border-danger/60 text-danger' : 'border-line text-ink'}`}>
      <Icon name={kind === 'error' ? 'alert' : 'check'} size={18} className="mt-0.5 shrink-0" />
      <span>{text}</span>
    </p>
  )
}

export function Result({ pack, result, character, playerName, fanSinceId, unlocked, isNew, photo, onPhotoChange, onPlayAgain, onHome, onCollection }: ResultProps) {
  const { t, loc, lang } = useI18n()
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const storyBlob = useRef<{ lang: string; blob: Blob } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [photoState, dispatch] = useReducer(cardPhotoReducer, photo, (p) => initialPhotoState<PhotoSource, HTMLCanvasElement>(p))

  // The parent keeps the photo so it survives a visit to the collection.
  useEffect(() => {
    if (photoState.photo !== photo) onPhotoChange(photoState.photo)
  }, [photoState.photo, photo, onPhotoChange])

  // The photo in this pack's look; dark and secret cards use their own accent.
  const cardPhoto = useMemo(
    () => (photoState.photo ? treatPhoto(photoState.photo, photoLook(pack.theme, result.rarity)) : null),
    [photoState.photo, pack.theme, result.rarity],
  )

  const fanBadge = pack.fanSince.options.find((o) => o.id === fanSinceId)?.badge ?? null
  const card = useMemo(
    () => buildCardData({ pack, character, result, lang, playerName, fanBadge, photo: cardPhoto }),
    [pack, character, result, lang, playerName, fanBadge, cardPhoto],
  )
  useSceneryView('dim')
  const filename = (format: ExportFormat) => `tumike-${character.id}-${format}.png`

  const render = useCallback(
    (format: ExportFormat) => renderCardImage({ card, theme: pack.theme, backdrop: pack.background?.src, format }),
    [card, pack],
  )

  // Pre-render the story image so "Share" opens the share sheet instantly
  // (some browsers drop the user gesture if we wait too long).
  useEffect(() => {
    let alive = true
    storyBlob.current = null
    render('story')
      .then((blob) => {
        if (alive) storyBlob.current = { lang, blob }
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [render, lang])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), TOAST_MS)
    return () => window.clearTimeout(id)
  }, [toast])

  const onShare = async () => {
    haptic(10)
    setBusy('story')
    try {
      const blob = storyBlob.current?.lang === lang ? storyBlob.current.blob : await render('story')
      const outcome = await shareImage(blob, filename('story'), shareText(card))
      if (outcome === 'unsupported') {
        downloadBlob(blob, filename('story'))
        setToast({ kind: 'info', text: t('result.saved') })
      }
    } catch {
      setToast({ kind: 'error', text: t('result.error') })
    } finally {
      setBusy(null)
    }
  }

  const onDownload = async () => {
    haptic(10)
    setBusy('feed')
    try {
      downloadBlob(await render('feed'), filename('feed'))
      setToast({ kind: 'info', text: t('result.feedSaved') })
    } catch {
      setToast({ kind: 'error', text: t('result.error') })
    } finally {
      setBusy(null)
    }
  }

  // Photo: decoded and cropped in the browser only; nothing is uploaded or stored.
  const pickPhoto = () => fileInput.current?.click()
  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // picking the same file again should still work
    if (!file) return
    const source = await readPhoto(file)
    dispatch(source ? { type: 'picked', source } : { type: 'unreadable' })
  }
  const closeCrop = useCallback((action: CardPhotoAction) => {
    dispatch(action)
    document.getElementById(PHOTO_BUTTON_ID)?.focus()
  }, [])
  const onCropCancel = useCallback(() => closeCrop({ type: 'cancel' }), [closeCrop])

  return (
    <main className="screen screen-enter">
      <header className="relative flex items-center justify-between">
        <IconButton icon="home" label={t('result.home')} onClick={onHome} />
        <button
          type="button"
          onClick={onCollection}
          className="press flex h-11 items-center gap-2 rounded-full border border-line bg-bg/60 px-4 text-[14px] font-semibold text-ink"
        >
          <Icon name="cards" size={18} className="text-accent" />
          <span>{t('result.collection', { u: unlocked, n: pack.characters.length })}</span>
          {isNew && <span className="pop rounded-full bg-accent px-2 py-0.5 text-[11px] text-on-accent">{t('result.newCard')}</span>}
        </button>
      </header>

      <div className="relative mt-4">
        <ResultCard card={card} className="card-in" />
      </div>

      <div className="relative mt-3 flex gap-2.5">
        <SecondaryButton id={PHOTO_BUTTON_ID} icon="camera" className="px-2! text-[14.5px]!" onClick={pickPhoto}>
          {cardPhoto ? t('photo.change') : t('photo.add')}
        </SecondaryButton>
        {cardPhoto && (
          <SecondaryButton className="px-2! text-[14.5px]!" onClick={() => dispatch({ type: 'remove' })}>
            {t('photo.remove')}
          </SecondaryButton>
        )}
        <input ref={fileInput} type="file" accept={PHOTO_ACCEPT} className="hidden" onChange={onFile} tabIndex={-1} aria-hidden="true" />
      </div>

      <div className="relative mt-2.5 flex flex-col gap-2.5">
        <PrimaryButton icon="share" onClick={onShare} disabled={busy !== null} aria-busy={busy === 'story'}>
          {busy === 'story' ? t('result.preparing') : t('result.share')}
        </PrimaryButton>
        <div className="grid grid-cols-2 gap-2.5">
          <SecondaryButton className="px-2! text-[14.5px]!" onClick={onDownload} disabled={busy !== null} aria-busy={busy === 'feed'}>
            {busy === 'feed' ? t('result.preparing') : t('result.download')}
          </SecondaryButton>
          <SecondaryButton className="px-2! text-[14.5px]!" onClick={onPlayAgain}>
            {t('result.again')}
          </SecondaryButton>
        </div>
      </div>

      <div role="status" aria-live="polite" className="relative min-h-0">
        {photoState.error && <Notice kind="error" text={t('photo.error')} />}
        {toast && <Notice kind={toast.kind} text={toast.text} />}
      </div>

      <section className="relative mt-7 border-t border-line pt-5">
        <h2 className="text-[13px] font-semibold text-muted">{t('result.about')}</h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-ink">{loc(character.description)}</p>
        <p className="mt-3 text-[13.5px] text-muted">{t('result.score', { c: result.correct, t: result.knowledgeTotal })}</p>
      </section>

      {photoState.editing && (
        <PhotoCrop source={photoState.editing} onCancel={onCropCancel} onDone={(cropped) => closeCrop({ type: 'done', photo: cropped })} />
      )}
    </main>
  )
}
