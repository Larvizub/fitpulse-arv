import type { FormEvent } from 'react'
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
}: RutinasSectionProps) {
  return (
    <section className="fit-tracker-layout">
      <article className="glass-card queue-panel">
        <div className="panel-head">
          <h2>Workout Queue</h2>
          <span>{routines.length} rutinas</span>
        </div>
        <form onSubmit={onSaveRoutine} className="neon-form">
          <label>
            Routine Name
            <input value={routineName} onChange={(event) => onSetRoutineName(event.target.value)} required />
          </label>
          <label>
            Notes
            <textarea value={routineNotes} onChange={(event) => onSetRoutineNotes(event.target.value)} rows={2} />
          </label>
          <div className="inline-grid">
            <input placeholder="Exercise" value={exerciseName} onChange={(event) => onSetExerciseName(event.target.value)} />
            <input
              type="number"
              min={1}
              placeholder="Reps"
              value={exerciseTarget}
              onChange={(event) => onSetExerciseTarget(parseNumber(event.target.value))}
            />
            <button className="fit-btn fit-btn-soft" type="button" onClick={onAddExerciseToDraft}>
              Add
            </button>
          </div>
          <ul className="fit-list compact">
            {routineExercisesDraft.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.name}</strong>
                <span>{exercise.targetReps} reps objetivo</span>
              </li>
            ))}
          </ul>
          <button className="fit-btn fit-btn-primary" type="submit">
            Save Routine
          </button>
        </form>
      </article>

      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>Interactive Workout Tracker</h2>
          <span>Live Session</span>
        </div>
        {activeRoutine ? (
          <div className="set-table">
            <div className="set-row head">
              <span>Exercise</span>
              <span>Target</span>
              <span>Completed</span>
              <span>Actions</span>
            </div>
            {activeRoutine.exercises.map((exercise) => (
              <div className="set-row" key={exercise.id}>
                <strong>{exercise.name}</strong>
                <span>{exercise.targetReps}</span>
                <span>{exercise.completedReps}</span>
                <div className="set-actions">
                  <button type="button" onClick={() => onUpdateExerciseReps(activeRoutine, exercise, -1)}>
                    -
                  </button>
                  <button type="button" onClick={() => onUpdateExerciseReps(activeRoutine, exercise, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Crea una rutina para activar el tracker interactivo.</p>
        )}
      </article>
    </section>
  )
}
