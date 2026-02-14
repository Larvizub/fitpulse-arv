import type { FormEvent } from 'react'
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
}

export function ProgresoSection({
  progressDraft,
  progressEntries,
  onSetProgressDraft,
  onAddProgress,
  parseNumber,
}: ProgresoSectionProps) {
  return (
    <section className="fit-split-grid">
      <article className="glass-card">
        <div className="panel-head">
          <h2>Log Progress</h2>
          <span>Daily</span>
        </div>
        <form onSubmit={onAddProgress} className="neon-form">
          <label>
            Mood
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
            Energy (1-10)
            <input
              type="number"
              min={1}
              max={10}
              value={progressDraft.energyLevel}
              onChange={(event) => onSetProgressDraft({ ...progressDraft, energyLevel: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            Notes
            <textarea value={progressDraft.notes} onChange={(event) => onSetProgressDraft({ ...progressDraft, notes: event.target.value })} />
          </label>
          <button className="fit-btn fit-btn-primary" type="submit">
            Save Progress
          </button>
        </form>
      </article>

      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>Progress Timeline</h2>
          <span>{progressEntries.length} logs</span>
        </div>
        <ul className="fit-list">
          {progressEntries.map((entry) => (
            <li key={entry.id}>
              <strong>{new Date(entry.date).toLocaleDateString()}</strong>
              <span>
                Ánimo: {entry.mood} • Energía: {entry.energyLevel}/10 • {entry.notes || 'Sin notas'}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
