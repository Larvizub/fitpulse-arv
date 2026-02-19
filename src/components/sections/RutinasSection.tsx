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
  onSelectRoutine: (routineId: string) => void
  onDeleteRoutine: (routineId: string) => Promise<void>
  onSetExerciseName: (value: string) => void
  onSetExerciseTarget: (value: number) => void
  onAddExerciseToDraft: () => void
  onDeleteExerciseFromDraft: (exerciseId: string) => void
  onSaveRoutine: (event: FormEvent<HTMLFormElement>) => void
  onUpdateExerciseReps: (routine: Routine, exercise: RoutineExercise, delta: number) => void
  onDeleteExerciseFromRoutine: (routine: Routine, exerciseId: string) => Promise<void>
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
  onSelectRoutine,
  onDeleteRoutine,
  onSetExerciseName,
  onSetExerciseTarget,
  onAddExerciseToDraft,
  onDeleteExerciseFromDraft,
  onSaveRoutine,
  onUpdateExerciseReps,
  onDeleteExerciseFromRoutine,
  parseNumber,
  t,
}: RutinasSectionProps) {
  const focusRoutine = activeRoutine

  return (
    <section className="fit-live-layout">
      <div className="routine-sidebar-stack">
        <article className="glass-card queue-panel live-sidebar">
          <div className="panel-head">
            <h2>{t('rutinas.queue')}</h2>
            <span>{routines.length} {t('rutinas.routines')}</span>
          </div>

          <ul className="fit-list live-queue-list">
            {routines.map((routine) => (
              <li key={routine.id} className={focusRoutine?.id === routine.id ? 'active' : ''}>
                <button className="routine-select-btn" type="button" onClick={() => onSelectRoutine(routine.id)}>
                  <strong>{routine.name}</strong>
                  <span>{routine.exercises.length} {t('rutinas.exercise')}</span>
                </button>
                <button className="fit-btn fit-btn-soft routine-remove-btn" type="button" onClick={() => onDeleteRoutine(routine.id)}>
                  {t('rutinas.delete')}
                </button>
              </li>
            ))}
            {!routines.length ? <li><span className="muted">{t('rutinas.createRoutineHint')}</span></li> : null}
          </ul>
          <p className="muted">{t('rutinas.manageHint')}</p>
        </article>

        <article className="glass-card">
          <form onSubmit={onSaveRoutine} className="neon-form">
            <label>
              {t('rutinas.routineName')}
              <input value={routineName} onChange={(event) => onSetRoutineName(event.target.value)} required />
            </label>
            <label>
              {t('rutinas.notes')}
              <textarea value={routineNotes} onChange={(event) => onSetRoutineNotes(event.target.value)} rows={2} />
            </label>
            <div className="form-separator" role="separator" aria-label={t('rutinas.exercisesSection')}>
              <span>{t('rutinas.exercisesSection')}</span>
            </div>
            <label>
              {t('rutinas.exerciseName')}
              <input value={exerciseName} onChange={(event) => onSetExerciseName(event.target.value)} />
            </label>
            <div className="inline-grid">
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
            <small className="muted">{t('rutinas.draftExercises')}</small>
            <ul className="fit-list compact">
              {routineExercisesDraft.map((exercise) => (
                <li key={exercise.id}>
                  <div className="draft-exercise-row">
                    <div>
                      <strong>{exercise.name}</strong>
                      <span>{exercise.targetReps} {t('rutinas.targetReps')}</span>
                    </div>
                    <button className="fit-btn fit-btn-soft routine-remove-btn" type="button" onClick={() => onDeleteExerciseFromDraft(exercise.id)}>
                      {t('rutinas.delete')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button className="fit-btn fit-btn-primary" type="submit">
              {t('rutinas.saveRoutine')}
            </button>
          </form>
        </article>
      </div>

      <article className="glass-card panel-large live-main-card">
        <header className="live-main-header">
          <div>
            <h2>{focusRoutine?.name || t('rutinas.tracker')}</h2>
            <p>{focusRoutine ? `${focusRoutine.exercises.length} ${t('rutinas.exercise')}` : t('rutinas.sessionLive')}</p>
          </div>
          {focusRoutine ? (
            <button className="fit-btn fit-btn-soft" type="button" onClick={() => onDeleteRoutine(focusRoutine.id)}>
              {t('rutinas.deleteRoutine')}
            </button>
          ) : null}
        </header>

        {focusRoutine ? (
          <div className="set-table live-set-table">
            <div className="set-row head">
              <span>{t('rutinas.exercise')}</span>
              <span>{t('rutinas.target')}</span>
              <span>{t('rutinas.completed')}</span>
              <span>{t('rutinas.actions')}</span>
            </div>
            {!focusRoutine.exercises.length ? <p className="muted routine-empty-state">{t('rutinas.emptyExercises')}</p> : null}
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
                  <button className="set-action-delete" type="button" onClick={() => onDeleteExerciseFromRoutine(focusRoutine, exercise.id)}>
                    {t('rutinas.delete')}
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
