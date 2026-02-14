import { TAB_META } from '../constants/gym'
import type { TabKey } from '../shared/types'

interface AppHeaderProps {
  activeTab: TabKey
  trainingPhase: string
}

export function AppHeader({ activeTab, trainingPhase }: AppHeaderProps) {
  return (
    <header className="fit-main-header">
      <div>
        <h1>{TAB_META.find((tab) => tab.key === activeTab)?.label}</h1>
        <p>Fase activa: {trainingPhase} • Member dashboard</p>
      </div>
    </header>
  )
}
