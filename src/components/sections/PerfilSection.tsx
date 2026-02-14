import type { FormEvent } from 'react'
import { useState } from 'react'
import type { TranslationKey } from '../../i18n/translations'
import type { TrainingPhase } from '../../types'

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
  onSaveProfile: (event: FormEvent<HTMLFormElement>) => void
  onChangeProfile: (next: ProfileDraft) => void
  parseNumber: (value: string) => number
  t: (key: TranslationKey) => string
}

export function PerfilSection({ profileDraft, onSaveProfile, onChangeProfile, parseNumber, t }: PerfilSectionProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setSaveStatus('saving')
    try {
      await onSaveProfile(event)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
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
            {saveStatus === 'saving' ? t('perfil.saving') : t('perfil.save')}
          </button>
          {saveStatus === 'saved' ? <p className="save-feedback success">{t('perfil.saved')}</p> : null}
          {saveStatus === 'error' ? <p className="save-feedback error-state">{t('perfil.saveError')}</p> : null}
        </form>
      </article>
    </section>
  )
}
