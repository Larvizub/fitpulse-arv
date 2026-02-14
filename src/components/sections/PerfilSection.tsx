import type { FormEvent } from 'react'
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
}

export function PerfilSection({ profileDraft, onSaveProfile, onChangeProfile, parseNumber }: PerfilSectionProps) {
  return (
    <section className="fit-content-stack">
      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>Enrollment Form</h2>
          <span>Step 1 of 3</span>
        </div>
        <form onSubmit={onSaveProfile} className="neon-form two">
          <label>
            Full Name
            <input value={profileDraft.fullName} onChange={(event) => onChangeProfile({ ...profileDraft, fullName: event.target.value })} required />
          </label>
          <label>
            Phone
            <input value={profileDraft.phone} onChange={(event) => onChangeProfile({ ...profileDraft, phone: event.target.value })} />
          </label>
          <label>
            Age
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
            Height (cm)
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
            Training Phase
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
            Primary Goal
            <textarea value={profileDraft.goal} onChange={(event) => onChangeProfile({ ...profileDraft, goal: event.target.value })} />
          </label>
          <button className="fit-btn fit-btn-primary full" type="submit">
            Save Enrollment Data
          </button>
        </form>
      </article>
    </section>
  )
}
