import { useI18n } from '../../i18n/I18n'
import { APP } from '../../config'
import { PrimaryButton } from '../components/Button'
import { Icon } from '../components/Icon'
import { useSceneryView } from '../scenery/view'

interface ErrorScreenProps {
  message?: string
  onRestart: () => void
}

export function ErrorScreen({ message, onRestart }: ErrorScreenProps) {
  const { t } = useI18n()
  useSceneryView('dim')
  return (
    <main className="screen screen-enter items-center justify-center text-center" role="alert">
      <span className="font-display text-[22px] text-accent">{APP.wordmark}</span>
      <div className="mt-10 grid size-16 place-items-center rounded-full border border-line text-accent">
        <Icon name="alert" size={30} />
      </div>
      <h1 className="mt-5 font-display text-[24px] text-ink">{t('error.title')}</h1>
      <p className="mt-2 max-w-[30ch] text-[15px] leading-6 text-muted">{message ?? t('error.body')}</p>
      <div className="mt-8 w-full">
        <PrimaryButton icon="replay" onClick={onRestart}>{t('error.restart')}</PrimaryButton>
      </div>
    </main>
  )
}
