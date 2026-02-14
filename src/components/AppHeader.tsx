import type { TabKey } from '../shared/types'
import type { Language, TranslationKey } from '../i18n/translations'

interface AppHeaderProps {
  activeTab: TabKey
  trainingPhase: string
  language: Language
  t: (key: TranslationKey) => string
  onChangeLanguage: (language: Language) => void
}

export function AppHeader({ activeTab, trainingPhase, language, t, onChangeLanguage }: AppHeaderProps) {
  const activeTabLabel = t(`tab.${activeTab}` as TranslationKey)

  return (
    <header className="fit-main-header">
      <div>
        <h1>{activeTabLabel}</h1>
        <p>
          {t('common.activePhase')}: {trainingPhase} • {t('common.memberDashboard')}
        </p>
      </div>
      <div className="header-actions-wrap">
        <div className="lang-switch" role="group" aria-label="Language switch">
        <button
          className={language === 'es' ? 'fit-btn fit-btn-soft active-lang' : 'fit-btn fit-btn-soft'}
          type="button"
          onClick={() => onChangeLanguage('es')}
        >
          {t('common.spanish')}
        </button>
        <button
          className={language === 'en' ? 'fit-btn fit-btn-soft active-lang' : 'fit-btn fit-btn-soft'}
          type="button"
          onClick={() => onChangeLanguage('en')}
        >
          {t('common.english')}
        </button>
        </div>
      </div>
    </header>
  )
}
