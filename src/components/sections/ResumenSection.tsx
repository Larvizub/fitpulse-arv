import type { UserProfile } from '../../types'
import type { TranslationKey } from '../../i18n/translations'

interface ResumenSectionProps {
  bmi: number
  completionRate: number
  routineCount: number
  measurementCount: number
  profile: UserProfile | null
  t: (key: TranslationKey) => string
}

export function ResumenSection({ bmi, completionRate, routineCount, measurementCount, profile, t }: ResumenSectionProps) {
  return (
    <section className="fit-content-stack">
      <div className="fit-kpi-grid">
        <article className="glass-card">
          <div className="kpi-icon primary"><span className="material-symbols-outlined">monitor_weight</span></div>
          <p>{t('resumen.bmi')}</p>
          <h3>{bmi ? bmi.toFixed(2) : '—'}</h3>
        </article>
        <article className="glass-card">
          <div className="kpi-icon blue"><span className="material-symbols-outlined">query_stats</span></div>
          <p>{t('resumen.performance')}</p>
          <h3>{completionRate}%</h3>
        </article>
        <article className="glass-card">
          <div className="kpi-icon orange"><span className="material-symbols-outlined">checklist</span></div>
          <p>{t('resumen.workouts')}</p>
          <h3>{routineCount}</h3>
        </article>
        <article className="glass-card">
          <div className="kpi-icon purple"><span className="material-symbols-outlined">monitoring</span></div>
          <p>{t('resumen.measurements')}</p>
          <h3>{measurementCount}</h3>
        </article>
      </div>

      <div className="fit-analytics-grid">
        <article className="glass-card panel-large">
          <div className="panel-head">
            <h2>{t('resumen.strengthProgression')}</h2>
            <span>{profile?.trainingPhase ?? 'adaptacion'}</span>
          </div>
          <div className="mock-chart">
            <div className="mock-line green" />
            <div className="mock-line blue" />
            <div className="mock-line purple" />
          </div>
        </article>
        <article className="glass-card">
          <div className="panel-head">
            <h2>{t('resumen.goal')}</h2>
            <span>{t('common.live')}</span>
          </div>
          <p className="muted">{profile?.goal || t('resumen.goalFallback')}</p>
          <div className="phase-pill">{t('resumen.phase')}: {profile?.trainingPhase ?? 'adaptacion'}</div>
        </article>
      </div>
    </section>
  )
}
