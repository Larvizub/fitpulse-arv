import type { ProgressEntry, Routine, UserProfile } from '../../types'
import type { TranslationKey } from '../../i18n/translations'

interface ResumenSectionProps {
  bmi: number
  completionRate: number
  routineCount: number
  measurementCount: number
  routines: Routine[]
  progressEntries: ProgressEntry[]
  profile: UserProfile | null
  t: (key: TranslationKey) => string
}

export function ResumenSection({
  bmi,
  completionRate,
  routineCount,
  measurementCount,
  routines,
  progressEntries,
  profile,
  t,
}: ResumenSectionProps) {
  const estimatedVolume = routineCount * 6200 + measurementCount * 150
  const streakWeeks = Math.max(1, Math.round(completionRate / 18))
  const recordsBroken = Math.max(0, Math.round((completionRate + routineCount) / 25))
  const activityByDay = [...routines.map((routine) => routine.date), ...progressEntries.map((entry) => entry.date)]
  const weeklyConsistency = Array.from({ length: 6 }).map((_, index) => {
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - (6 - index) * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const sessions = activityByDay.filter((dateValue) => {
      const date = new Date(dateValue)
      return date >= start && date <= end
    }).length

    return {
      label: `W${index + 1}`,
      sessions,
      score: Math.min(100, sessions * 18),
    }
  })

  return (
    <section className="fit-dashboard-layout">
      <div className="fit-kpi-grid fit-kpi-grid-analytics">
        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon primary"><span className="material-symbols-outlined">fitness_center</span></div>
            <span className="kpi-chip positive">+12% vs mes anterior</span>
          </div>
          <p>Volumen total levantado</p>
          <h3>{estimatedVolume.toLocaleString()} kg</h3>
        </article>
        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon blue"><span className="material-symbols-outlined">calendar_month</span></div>
            <span className="kpi-chip info">On Track</span>
          </div>
          <p>{t('resumen.workouts')}</p>
          <h3>{routineCount} sesiones</h3>
        </article>
        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon orange"><span className="material-symbols-outlined">local_fire_department</span></div>
            <span className="kpi-chip warm">Keep it up!</span>
          </div>
          <p>Racha actual</p>
          <h3>{streakWeeks} semanas</h3>
        </article>
        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon purple"><span className="material-symbols-outlined">emoji_events</span></div>
            <span className="kpi-chip purple">New Record</span>
          </div>
          <p>Récords superados</p>
          <h3>{recordsBroken} este mes</h3>
        </article>
      </div>

      <div className="fit-analytics-grid fit-analytics-grid-large">
        <article className="glass-card panel-large analytics-main-card">
          <div className="panel-head">
            <h2>Strength Progression (Big 3)</h2>
            <div className="chart-legend">
              <span className="legend-dot squat">Squat</span>
              <span className="legend-dot bench">Bench</span>
              <span className="legend-dot deadlift">Deadlift</span>
            </div>
          </div>
          <div className="mock-chart analytics-chart">
            <div className="mock-line green curve-a" />
            <div className="mock-line blue curve-b" />
            <div className="mock-line purple curve-c" />
          </div>
        </article>

        <article className="glass-card physique-card">
          <div className="panel-head">
            <h2>Physique Update</h2>
            <span className="link-accent">View Gallery</span>
          </div>
          <div className="before-after">
            <div className="before-after-col before">
              <small>Before</small>
            </div>
            <div className="before-after-col after">
              <small>Current</small>
            </div>
          </div>
          <div className="mini-metrics-row">
            <article>
              <small>{t('medidas.weight')}</small>
              <strong>{bmi ? (bmi * 3.2).toFixed(1) : '0.0'} kg</strong>
            </article>
            <article>
              <small>{t('medidas.bodyFat')}</small>
              <strong>{Math.max(0, 24 - bmi).toFixed(1)}%</strong>
            </article>
          </div>
        </article>
      </div>

      <div className="fit-analytics-grid fit-analytics-grid-bottom">
        <article className="glass-card">
          <div className="panel-head">
            <h2>Consistency Tracking</h2>
            <span>{weeklyConsistency.reduce((acc, item) => acc + item.sessions, 0)} sesiones</span>
          </div>
          <div className="consistency-functional-grid">
            {weeklyConsistency.map((item) => (
              <article key={item.label} className="consistency-metric-card">
                <small>{item.label}</small>
                <div className="consistency-meter">
                  <span style={{ width: `${item.score}%` }} />
                </div>
                <strong>{item.score}%</strong>
                <p>{item.sessions} sesiones</p>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-card">
          <div className="panel-head">
            <h2>Recent Workouts</h2>
            <span>{t('common.live')}</span>
          </div>
          <ul className="fit-list recent-list">
            <li>
              <strong>{profile?.trainingPhase ? `${profile.trainingPhase} Day` : 'Upper Day'} · Chest Focus</strong>
              <span>8,450 kg • 1h 15m</span>
            </li>
            <li>
              <strong>Morning Cardio</strong>
              <span>5.2 km • 32m</span>
            </li>
            <li>
              <strong>{profile?.goal || t('resumen.goalFallback')}</strong>
              <span>{t('resumen.phase')}: {profile?.trainingPhase ?? 'adaptacion'}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}
