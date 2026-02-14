import type { FormEvent } from 'react'
import type { TranslationKey } from '../../i18n/translations'

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
  t: (key: TranslationKey) => string
}

export function MedidasSection({
  measurementDraft,
  measurements,
  onChangeMeasurementDraft,
  onAddMeasurement,
  parseNumber,
  t,
}: MedidasSectionProps) {
  return (
    <section className="fit-split-grid">
      <article className="glass-card">
        <div className="panel-head">
          <h2>{t('medidas.title')}</h2>
          <span>{t('common.realtime')}</span>
        </div>
        <form onSubmit={onAddMeasurement} className="neon-form">
          <label>
            {t('medidas.weight')}
            <input
              type="number"
              value={measurementDraft.weightKg}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, weightKg: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            {t('medidas.bodyFat')}
            <input
              type="number"
              value={measurementDraft.bodyFatPercent}
              onChange={(event) =>
                onChangeMeasurementDraft({ ...measurementDraft, bodyFatPercent: parseNumber(event.target.value) })
              }
            />
          </label>
          <label>
            {t('medidas.waist')}
            <input
              type="number"
              value={measurementDraft.waistCm}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, waistCm: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            {t('medidas.chest')}
            <input
              type="number"
              value={measurementDraft.chestCm}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, chestCm: parseNumber(event.target.value) })}
            />
          </label>
          <label>
            {t('medidas.arm')}
            <input
              type="number"
              value={measurementDraft.armCm}
              onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, armCm: parseNumber(event.target.value) })}
            />
          </label>
          <button className="fit-btn fit-btn-primary" type="submit">
            {t('medidas.save')}
          </button>
        </form>
      </article>

      <article className="glass-card">
        <div className="panel-head">
          <h2>{t('medidas.history')}</h2>
          <span>{measurements.length} {t('medidas.entries')}</span>
        </div>
        <ul className="fit-list">
          {measurements.map((item) => (
            <li key={item.id}>
              <strong>{new Date(item.date).toLocaleDateString()}</strong>
              <span>
                {item.weightKg}kg • {item.bodyFatPercent}% • {t('medidas.waistShort')} {item.waistCm}cm
              </span>
            </li>
          ))}
        </ul>
      </article>
    </section>
  )
}
