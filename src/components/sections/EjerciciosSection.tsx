import type { TranslationKey } from '../../i18n/translations'

interface EjerciciosSectionProps {
  phase: string
  recommended: string[]
  t: (key: TranslationKey) => string
}

export function EjerciciosSection({ phase, recommended, t }: EjerciciosSectionProps) {
  return (
    <section className="fit-split-grid">
      <article className="glass-card">
        <div className="panel-head">
          <h2>{t('ejercicios.title')}</h2>
          <span>{phase}</span>
        </div>
        <ul className="recommend-list">
          {recommended.map((exercise, index) => (
            <li key={exercise}>
              <div className="recommend-index">{index + 1}</div>
              <div>
                <h4>{exercise}</h4>
                <p>
                  {t('ejercicios.intensity')}: {index < 2 ? t('ejercicios.high') : index === 2 ? t('ejercicios.medium') : t('ejercicios.low')} • 45-75 min
                </p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>{t('ejercicios.weekly')}</h2>
          <span>{t('ejercicios.range')}</span>
        </div>
        <div className="week-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className={index === 0 ? 'week-day active' : 'week-day'}>
              <header>{day}</header>
              <p>{recommended[index % recommended.length]}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
