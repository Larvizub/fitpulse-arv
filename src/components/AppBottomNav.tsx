import { TAB_META } from '../constants/gym'
import type { TranslationKey } from '../i18n/translations'
import type { TabKey } from '../shared/types'

interface AppBottomNavProps {
  activeTab: TabKey
  t: (key: TranslationKey) => string
  onChangeTab: (tab: TabKey) => void
}

export function AppBottomNav({ activeTab, t, onChangeTab }: AppBottomNavProps) {
  return (
    <nav className="fit-bottom-nav" aria-label="Mobile primary navigation">
      {TAB_META.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? 'fit-bottom-nav-link active' : 'fit-bottom-nav-link'}
          onClick={() => onChangeTab(tab.key)}
          type="button"
          aria-current={activeTab === tab.key ? 'page' : undefined}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {tab.icon}
          </span>
          <span>{t(`tab.${tab.key}` as TranslationKey)}</span>
        </button>
      ))}
    </nav>
  )
}