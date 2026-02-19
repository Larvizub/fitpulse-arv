import type { FormEvent } from 'react'
import { useState } from 'react'
import type { TranslationKey } from '../../i18n/translations'
import type { TrainingPhase } from '../../types'
import { toast } from '../../shared/toast'

interface ProfileDraft {
  fullName: string
  phone: string
  age: number
  heightCm: number
  trainingPhase: TrainingPhase
  goal: string
}

interface PerfilSectionProps {
  profileDraft: ProfileDraft
  hasSavedProfile: boolean
  onSaveProfile: (event: FormEvent<HTMLFormElement>) => void
  onChangeProfile: (next: ProfileDraft) => void
  parseNumber: (value: string) => number
  t: (key: TranslationKey) => string
}

export function PerfilSection({
  profileDraft,
  hasSavedProfile,
  onSaveProfile,
  onChangeProfile,
  parseNumber,
  t,
}: PerfilSectionProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving'>('idle')
  const [editingRequested, setEditingRequested] = useState(false)
  const isEditing = !hasSavedProfile || editingRequested

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setSaveStatus('saving')
    try {
      await onSaveProfile(event)
      setSaveStatus('idle')
      setEditingRequested(false)
      toast.success(t('perfil.saved'))
    } catch {
      setSaveStatus('idle')
      toast.error(t('perfil.saveError'))
    }
  }

  if (!isEditing && hasSavedProfile) {
    return (
      <section className="fit-content-stack">
        <article className="glass-card panel-large">
          <div className="panel-head">
            <h2>{t('perfil.savedTitle')}</h2>
            <span>{t('perfil.step')}</span>
          </div>
          <p className="muted profile-saved-hint">{t('perfil.savedHint')}</p>
          <div className="profile-summary-grid">
            <div className="summary-item">
              <small>{t('perfil.fullName')}</small>
              <strong>{profileDraft.fullName || '-'}</strong>
            </div>
            <div className="summary-item">
              <small>{t('perfil.phone')}</small>
              <strong>{profileDraft.phone || '-'}</strong>
            </div>
            <div className="summary-item">
              <small>{t('perfil.age')}</small>
              <strong>{profileDraft.age || '-'}</strong>
            </div>
            <div className="summary-item">
              <small>{t('perfil.height')}</small>
              <strong>{profileDraft.heightCm || '-'} cm</strong>
            </div>
            <div className="summary-item">
              <small>{t('perfil.trainingPhase')}</small>
              <strong>{profileDraft.trainingPhase || '-'}</strong>
            </div>
            <div className="summary-item full">
              <small>{t('perfil.primaryGoal')}</small>
              <strong>{profileDraft.goal || '-'}</strong>
            </div>
          </div>
          <div className="profile-actions">
            <button className="fit-btn fit-btn-primary" type="button" onClick={() => setEditingRequested(true)}>
              {t('perfil.edit')}
            </button>
          </div>
        </article>
      </section>
    )
  }

  return (
    <section className="fit-content-stack">
      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>{t('perfil.title')}</h2>
          <span>{t('perfil.step')}</span>
        </div>
        <form onSubmit={handleSubmit} className="neon-form two">
          <label>
            {t('perfil.fullName')}
            <input value={profileDraft.fullName} onChange={(event) => onChangeProfile({ ...profileDraft, fullName: event.target.value })} required />
          </label>
          <label>
            {t('perfil.phone')}
            <input value={profileDraft.phone} onChange={(event) => onChangeProfile({ ...profileDraft, phone: event.target.value })} />
          </label>
          <label>
            {t('perfil.age')}
            <input
              type="number"
              min={12}
              max={100}
              value={profileDraft.age}
              onChange={(event) => onChangeProfile({ ...profileDraft, age: parseNumber(event.target.value) })}
              required
            />
          </label>
          <label>
            {t('perfil.height')}
            <input
              type="number"
              min={100}
              max={250}
              value={profileDraft.heightCm}
              onChange={(event) => onChangeProfile({ ...profileDraft, heightCm: parseNumber(event.target.value) })}
              required
            />
          </label>
          <label>
            {t('perfil.trainingPhase')}
            <select
              value={profileDraft.trainingPhase}
              onChange={(event) => onChangeProfile({ ...profileDraft, trainingPhase: event.target.value as TrainingPhase })}
            >
              <option value="adaptacion">Adaptación</option>
              <option value="volumen">Volumen</option>
              <option value="definicion">Definición</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </label>
          <label className="full">
            {t('perfil.primaryGoal')}
            <textarea value={profileDraft.goal} onChange={(event) => onChangeProfile({ ...profileDraft, goal: event.target.value })} />
          </label>
          <button className="fit-btn fit-btn-primary full" type="submit">
            {saveStatus === 'saving' ? t('perfil.saving') : hasSavedProfile ? t('perfil.saveChanges') : t('perfil.save')}
          </button>
          {hasSavedProfile ? (
            <button className="fit-btn fit-btn-soft full" type="button" onClick={() => setEditingRequested(false)}>
              {t('perfil.cancelEdit')}
            </button>
          ) : null}
        </form>
      </article>
    </section>
  )
}
