import type { FormEvent } from 'react'
import type { TranslationKey } from '../../i18n/translations'
import type { Routine, RoutineExercise } from '../../types'

interface RutinasSectionProps {
  routines: Routine[]
  activeRoutine?: Routine
  routineName: string
  routineNotes: string
  exerciseName: string
  exerciseTarget: number
  routineExercisesDraft: RoutineExercise[]
  onSetRoutineName: (value: string) => void
  onSetRoutineNotes: (value: string) => void
  onSetExerciseName: (value: string) => void
  onSetExerciseTarget: (value: number) => void
  onAddExerciseToDraft: () => void
  onSaveRoutine: (event: FormEvent<HTMLFormElement>) => void
  onUpdateExerciseReps: (routine: Routine, exercise: RoutineExercise, delta: number) => void
  parseNumber: (value: string) => number
  t: (key: TranslationKey) => string
}

export function RutinasSection({
  routines,
  activeRoutine,
  routineName,
  routineNotes,
  exerciseName,
  exerciseTarget,
  routineExercisesDraft,
  onSetRoutineName,
  onSetRoutineNotes,
  onSetExerciseName,
  onSetExerciseTarget,
  onAddExerciseToDraft,
  onSaveRoutine,
  onUpdateExerciseReps,
  parseNumber,
  t,
}: RutinasSectionProps) {
  const focusRoutine = activeRoutine
  const focusExercise = focusRoutine?.exercises[0]

  return (
    <section className="fit-live-layout">
      <article className="glass-card queue-panel live-sidebar">
        <div className="panel-head">
          <h2>{t('rutinas.queue')}</h2>
          <span>{routines.length} {t('rutinas.routines')}</span>
        </div>

        <ul className="fit-list live-queue-list">
          {routines.map((routine) => (
            <li key={routine.id} className={focusRoutine?.id === routine.id ? 'active' : ''}>
              <strong>{routine.name}</strong>
              <span>{routine.exercises.length} {t('rutinas.exercise')}</span>
            </li>
          ))}
          {!routines.length ? <li><span className="muted">{t('rutinas.createRoutineHint')}</span></li> : null}
        </ul>

        <form onSubmit={onSaveRoutine} className="neon-form live-form-compact">
          <label>
            {t('rutinas.routineName')}
            <input value={routineName} onChange={(event) => onSetRoutineName(event.target.value)} required />
          </label>
          <label>
            {t('rutinas.notes')}
            <textarea value={routineNotes} onChange={(event) => onSetRoutineNotes(event.target.value)} rows={2} />
          </label>
          <div className="inline-grid">
            <input placeholder={t('rutinas.exercise')} value={exerciseName} onChange={(event) => onSetExerciseName(event.target.value)} />
            <input
              type="number"
              min={1}
              placeholder={t('rutinas.reps')}
              value={exerciseTarget}
              onChange={(event) => onSetExerciseTarget(parseNumber(event.target.value))}
            />
            <button className="fit-btn fit-btn-soft" type="button" onClick={onAddExerciseToDraft}>
              {t('rutinas.add')}
            </button>
          </div>
          <ul className="fit-list compact">
            {routineExercisesDraft.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.name}</strong>
                <span>{exercise.targetReps} {t('rutinas.targetReps')}</span>
              </li>
            ))}
          </ul>
          <button className="fit-btn fit-btn-primary" type="submit">
            {t('rutinas.saveRoutine')}
          </button>
        </form>
      </article>

      <article className="glass-card panel-large live-main-card">
        <header className="live-main-header">
          <div>
            <h2>{focusExercise?.name || t('rutinas.tracker')}</h2>
            <p>{focusRoutine?.name || t('rutinas.sessionLive')}</p>
          </div>
          <div className="live-header-actions">
            <button className="fit-btn fit-btn-soft" type="button">Settings</button>
            <button className="fit-btn fit-btn-soft" type="button">End Workout</button>
          </div>
        </header>

        {focusRoutine ? (
          <div className="set-table live-set-table">
            <div className="set-row head">
              <span>{t('rutinas.exercise')}</span>
              <span>{t('rutinas.target')}</span>
              <span>{t('rutinas.completed')}</span>
              <span>{t('rutinas.actions')}</span>
            </div>
            {focusRoutine.exercises.map((exercise, index) => (
              <div className={index === 0 ? 'set-row active-row' : 'set-row'} key={exercise.id}>
                <strong>{exercise.name}</strong>
                <span>{exercise.targetReps}</span>
                <span>{exercise.completedReps}</span>
                <div className="set-actions">
                  <button type="button" onClick={() => onUpdateExerciseReps(focusRoutine, exercise, -1)}>
                    -
                  </button>
                  <button type="button" onClick={() => onUpdateExerciseReps(focusRoutine, exercise, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">{t('rutinas.createRoutineHint')}</p>
        )}
      </article>
    </section>
  )
}
