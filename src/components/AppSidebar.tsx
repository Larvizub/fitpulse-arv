import { TAB_META } from '../constants/gym'
import type { TabKey } from '../shared/types'
import type { TranslationKey } from '../i18n/translations'

interface AppSidebarProps {
  activeTab: TabKey
  userName: string
  email: string
  t: (key: TranslationKey) => string
  onChangeTab: (tab: TabKey) => void
  onLogout: () => void
}

export function AppSidebar({ activeTab, userName, email, t, onChangeTab, onLogout }: AppSidebarProps) {
  return (
    <aside className="fit-sidebar">
      <div className="fit-brand">
        <div className="fit-brand-badge">F</div>
        <span>
          Fit<span>Track</span>
        </span>
      </div>

      <nav className="fit-nav">
        {TAB_META.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'fit-nav-link active' : 'fit-nav-link'}
            onClick={() => onChangeTab(tab.key)}
            type="button"
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            <span>{t(`tab.${tab.key}` as TranslationKey)}</span>
          </button>
        ))}
      </nav>

      <div className="fit-user-box">
        <p>{userName}</p>
        <small>{email}</small>
        <button className="fit-btn fit-btn-soft" onClick={onLogout} type="button">
          {t('common.logout')}
        </button>
      </div>
    </aside>
  )
}
