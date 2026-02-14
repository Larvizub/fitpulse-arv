import type { FormEvent } from 'react'
import type { TranslationKey } from '../../i18n/translations'
import type { ProgressEntry } from '../../types'

interface ProgressDraft {
  mood: ProgressEntry['mood']
  energyLevel: number
  notes: string
}

interface ProgresoSectionProps {
  progressDraft: ProgressDraft
  progressEntries: ProgressEntry[]
  onSetProgressDraft: (next: ProgressDraft) => void
  onAddProgress: (event: FormEvent<HTMLFormElement>) => void
  parseNumber: (value: string) => number
  t: (key: TranslationKey) => string
}

export function ProgresoSection({
  progressDraft,
  progressEntries,
  onSetProgressDraft,
  onAddProgress,
  parseNumber,
  t,
}: ProgresoSectionProps) {
  return (
    <section className="fit-split-grid">
      <article className="glass-card">
        <div className="panel-head">
          <h2>{t('progreso.title')}</h2>
          <span>{t('common.daily')}</span>
        </div>
        <form onSubmit={onAddProgress} className="neon-form">
          <label>
            {t('progreso.mood')}
            <select
              value={progressDraft.mood}
              onChange={(event) => onSetProgressDraft({ ...progressDraft, mood: event.target.value as ProgressEntry['mood'] })}
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </label>
          <label>
            {t('progreso.energy')}
            <input
              type="number"
              min={1}
              max={10}
              value={progressDraft.energyLevel}
              onChange={(event) => onSetProgressDraft({ ...progressDraft, energyLevel: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            {t('progreso.notes')}
            <textarea value={progressDraft.notes} onChange={(event) => onSetProgressDraft({ ...progressDraft, notes: event.target.value })} />
          </label>
          <button className="fit-btn fit-btn-primary" type="submit">
            {t('progreso.save')}
          </button>
        </form>
      </article>

      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>{t('progreso.timeline')}</h2>
          <span>{progressEntries.length} {t('progreso.logs')}</span>
        </div>
        <ul className="fit-list">
          {progressEntries.map((entry) => (
            <li key={entry.id}>
              <strong>{new Date(entry.date).toLocaleDateString()}</strong>
              <span>
                {t('progreso.moodLabel')}: {entry.mood} • {t('progreso.energyLabel')}: {entry.energyLevel}/10 • {entry.notes || t('progreso.noNotes')}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
