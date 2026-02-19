import type { FormEvent } from 'react'
import { useState } from 'react'
import type { TranslationKey } from '../../i18n/translations'
import { showConfirmToast, toast } from '../../shared/toast'

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
  chestCm: number
  armCm: number
}

interface MedidasSectionProps {
  measurementDraft: MeasurementDraft
  measurements: MeasurementItem[]
  onChangeMeasurementDraft: (next: MeasurementDraft) => void
  onAddMeasurement: (event: FormEvent<HTMLFormElement>) => void
  onClearHistory: () => Promise<void>
  onUpdateMeasurement: (measurementId: string, payload: Omit<MeasurementItem, 'id' | 'date'>) => Promise<void>
  onDeleteMeasurement: (measurementId: string) => Promise<void>
  parseNumber: (value: string) => number
  t: (key: TranslationKey) => string
}

export function MedidasSection({
  measurementDraft,
  measurements,
  onChangeMeasurementDraft,
  onAddMeasurement,
  onClearHistory,
  onUpdateMeasurement,
  onDeleteMeasurement,
  parseNumber,
  t,
}: MedidasSectionProps) {
  const [isClearing, setIsClearing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingMeasurementId, setEditingMeasurementId] = useState<string | null>(null)
  const latest = measurements[0]
  const previous = measurements[1]
  const weightDelta = latest && previous ? latest.weightKg - previous.weightKg : 0
  const bodyFatDelta = latest && previous ? latest.bodyFatPercent - previous.bodyFatPercent : 0
  const muscleMass = latest ? Math.max(0, latest.weightKg * (1 - latest.bodyFatPercent / 100)).toFixed(1) : '0.0'
  const baselineWeight = measurements.length ? measurements[measurements.length - 1]?.weightKg ?? latest?.weightKg ?? 0 : 0
  const totalLoss = latest ? latest.weightKg - baselineWeight : 0

  async function handleClearHistory() {
    showConfirmToast({
      message: t('medidas.clearConfirm'),
      actionLabel: t('medidas.clearHistory'),
      cancelLabel: t('medidas.cancel'),
      onConfirm: async () => {
        setIsClearing(true)
        try {
          await onClearHistory()
          toast.success(t('medidas.cleared'))
        } catch {
          toast.error(t('medidas.clearError'))
        } finally {
          setIsClearing(false)
        }
      },
    })
  }

  async function handleSaveMeasurement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)

    try {
      if (editingMeasurementId) {
        await onUpdateMeasurement(editingMeasurementId, {
          weightKg: measurementDraft.weightKg,
          bodyFatPercent: measurementDraft.bodyFatPercent,
          waistCm: measurementDraft.waistCm,
          chestCm: measurementDraft.chestCm,
          armCm: measurementDraft.armCm,
        })
      } else {
        await onAddMeasurement(event)
      }

      toast.success(t('medidas.saveSuccess'))
      setEditingMeasurementId(null)
    } catch {
      toast.error(t('medidas.saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  function handleEditMeasurement(item: MeasurementItem) {
    setEditingMeasurementId(item.id)
    onChangeMeasurementDraft({
      weightKg: item.weightKg,
      bodyFatPercent: item.bodyFatPercent,
      waistCm: item.waistCm,
      chestCm: item.chestCm,
      armCm: item.armCm,
    })
  }

  async function handleDeleteMeasurement(measurementId: string) {
    showConfirmToast({
      message: t('medidas.deleteConfirm'),
      actionLabel: t('rutinas.delete'),
      cancelLabel: t('medidas.cancel'),
      onConfirm: async () => {
        try {
          await onDeleteMeasurement(measurementId)
          toast.success(t('medidas.deleteSuccess'))
        } catch {
          toast.error(t('medidas.deleteError'))
        }
      },
    })
  }

  return (
    <section className="fit-metrics-layout">
      <div className="fit-kpi-grid fit-kpi-grid-metrics">
        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon primary"><span className="material-symbols-outlined">monitor_weight</span></div>
            <span className={weightDelta <= 0 ? 'kpi-chip positive' : 'kpi-chip warm'}>
              {weightDelta >= 0 ? '+' : ''}
              {weightDelta.toFixed(1)}kg
            </span>
          </div>
          <p>{t('medidas.weight')}</p>
          <h3>{latest?.weightKg?.toFixed(1) ?? measurementDraft.weightKg.toFixed(1)} kg</h3>
        </article>

        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon blue"><span className="material-symbols-outlined">water_drop</span></div>
            <span className={bodyFatDelta <= 0 ? 'kpi-chip positive' : 'kpi-chip warm'}>
              {bodyFatDelta >= 0 ? '+' : ''}
              {bodyFatDelta.toFixed(1)}%
            </span>
          </div>
          <p>{t('medidas.bodyFat')}</p>
          <h3>{latest?.bodyFatPercent?.toFixed(1) ?? measurementDraft.bodyFatPercent.toFixed(1)}%</h3>
        </article>

        <article className="glass-card kpi-card">
          <div className="kpi-card-head">
            <div className="kpi-icon orange"><span className="material-symbols-outlined">accessibility_new</span></div>
            <span className="kpi-chip info">Promedio</span>
          </div>
          <p>Masa muscular</p>
          <h3>{muscleMass} kg</h3>
        </article>
      </div>

      <div className="fit-analytics-grid fit-analytics-grid-large">
        <article className="glass-card panel-large metrics-main-card">
          <div className="panel-head">
            <h2>Progress Over Time</h2>
            <span>
              {measurements.length} {t('medidas.entries')}
            </span>
          </div>
          <div className="mock-chart metrics-chart">
            <div className="mock-line green curve-a" />
          </div>
        </article>

        <article className="glass-card comparison-card">
          <div className="panel-head">
            <h2>Assessment Comparison</h2>
            <span>{t('common.realtime')}</span>
          </div>
          <div className="comparison-row">
            <small>Initial</small>
            <strong>{baselineWeight.toFixed(1)} kg</strong>
          </div>
          <div className="comparison-row">
            <small>Current</small>
            <strong>{latest?.weightKg?.toFixed(1) ?? measurementDraft.weightKg.toFixed(1)} kg</strong>
          </div>
          <div className="comparison-progress">
            <span style={{ width: `${Math.min(100, Math.max(8, 100 - (latest?.bodyFatPercent ?? measurementDraft.bodyFatPercent) * 2))}%` }} />
          </div>
          <p className={totalLoss <= 0 ? 'save-feedback success' : 'save-feedback'}>
            {totalLoss >= 0 ? '+' : ''}
            {totalLoss.toFixed(1)} kg desde el inicio
          </p>
          <button className="fit-btn fit-btn-soft" type="button" onClick={handleClearHistory} disabled={isClearing}>
            {isClearing ? t('medidas.clearing') : t('medidas.clearHistory')}
          </button>
        </article>
      </div>

      <div className="fit-analytics-grid fit-analytics-grid-bottom">
        <article className="glass-card">
          <div className="panel-head">
            <h2>{t('medidas.title')}</h2>
            <span>{t('common.live')}</span>
          </div>
          <form onSubmit={handleSaveMeasurement} className="neon-form two">
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
            <label className="full">
              {t('medidas.arm')}
              <input
                type="number"
                value={measurementDraft.armCm}
                onChange={(event) => onChangeMeasurementDraft({ ...measurementDraft, armCm: parseNumber(event.target.value) })}
              />
            </label>
            <button className="fit-btn fit-btn-primary full" type="submit">
              {isSaving ? 'Guardando...' : editingMeasurementId ? 'Guardar cambios' : t('medidas.save')}
            </button>
            {editingMeasurementId ? (
              <button
                className="fit-btn fit-btn-soft full"
                type="button"
                onClick={() => {
                  setEditingMeasurementId(null)
                  setIsSaving(false)
                }}
              >
                Cancelar edición
              </button>
            ) : null}
          </form>
        </article>

        <article className="glass-card">
          <div className="panel-head">
            <h2>{t('medidas.history')}</h2>
            <span>
              {measurements.length} {t('medidas.entries')}
            </span>
          </div>
          <ul className="fit-list recent-list">
            {measurements.map((item) => (
              <li key={item.id}>
                <strong>{new Date(item.date).toLocaleDateString()}</strong>
                <span>
                  {item.weightKg}kg • {item.bodyFatPercent}% • {t('medidas.waistShort')} {item.waistCm}cm
                </span>
                <div className="history-actions">
                  <button className="fit-btn fit-btn-soft" type="button" onClick={() => handleEditMeasurement(item)}>
                    Editar
                  </button>
                  <button className="fit-btn fit-btn-soft" type="button" onClick={() => handleDeleteMeasurement(item.id)}>
                    Borrar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
