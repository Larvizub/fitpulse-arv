import type { FormEvent } from 'react'

interface MeasurementDraft {
  weightKg: number
  bodyFatPercent: number
  waistCm: number
  chestCm: number
  armCm: number
}

interface MeasurementItem {
  id: string
  date: string
  weightKg: number
  bodyFatPercent: number
  waistCm: number
}

interface MedidasSectionProps {
  measurementDraft: MeasurementDraft
  measurements: MeasurementItem[]
  onChangeMeasurementDraft: (next: MeasurementDraft) => void
  onAddMeasurement: (event: FormEvent<HTMLFormElement>) => void
  parseNumber: (value: string) => number
}

export function MedidasSection({
  measurementDraft,
  measurements,
  onChangeMeasurementDraft,
  onAddMeasurement,
  parseNumber,
}: MedidasSectionProps) {
  return (
    <section className="fit-split-grid">
      <article className="glass-card">
        <div className="panel-head">
          <h2>Health Metrics</h2>
          <span>Realtime</span>
        </div>
        <form onSubmit={onAddMeasurement} className="neon-form">
          <label>
            Weight (kg)
            <input
              type="number"
              value={measurementDraft.weightKg}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, weightKg: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            Body Fat (%)
            <input
              type="number"
              value={measurementDraft.bodyFatPercent}
              onChange={(event) =>
                onChangeMeasurementDraft({ ...measurementDraft, bodyFatPercent: parseNumber(event.target.value) })
              }
            />
          </label>
          <label>
            Waist (cm)
            <input
              type="number"
              value={measurementDraft.waistCm}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, waistCm: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            Chest (cm)
            <input
              type="number"
              value={measurementDraft.chestCm}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, chestCm: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            Arm (cm)
            <input
              type="number"
              value={measurementDraft.armCm}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, armCm: parseNumber(event.target.value) })}
            />
          </label>
          <button className="fit-btn fit-btn-primary" type="submit">
            Save Measurement
          </button>
        </form>
      </article>

      <article className="glass-card">
        <div className="panel-head">
          <h2>History</h2>
          <span>{measurements.length} entries</span>
        </div>
        <ul className="fit-list">
          {measurements.map((item) => (
            <li key={item.id}>
              <strong>{new Date(item.date).toLocaleDateString()}</strong>
              <span>
                {item.weightKg}kg • {item.bodyFatPercent}% grasa • cintura {item.waistCm}cm
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
