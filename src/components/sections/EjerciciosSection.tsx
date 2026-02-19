import { useEffect, useMemo, useState } from 'react'
import type { TranslationKey } from '../../i18n/translations'
import type { Routine, WeeklyPlanItem } from '../../types'

interface EjerciciosSectionProps {
  phase: string
  routines: Routine[]
  weeklyPlan: WeeklyPlanItem[]
  onUpdateWeeklyPlanItem: (index: number, updates: Partial<WeeklyPlanItem>) => Promise<void>
  onSaveQuickWorkout: (payload: { exerciseName: string; reps: number; sets: number; durationSec: number }) => Promise<void>
  onGoToRoutines: () => void
  t: (key: TranslationKey) => string
}

export function EjerciciosSection({
  phase,
  routines,
  weeklyPlan,
  onUpdateWeeklyPlanItem,
  onSaveQuickWorkout,
  onGoToRoutines,
  t,
}: EjerciciosSectionProps) {
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [sessionSets, setSessionSets] = useState(1)
  const [sessionReps, setSessionReps] = useState(8)
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)

  const routineOptions = useMemo(
    () => Array.from(new Set(routines.flatMap((routine) => routine.exercises.map((exercise) => exercise.name)))),
    [routines],
  )
  const planOptions = useMemo(() => routineOptions, [routineOptions])
  const hasRoutineOptions = planOptions.length > 0
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const activePlan = weeklyPlan[todayIndex] ?? weeklyPlan[0]
  const workoutQueue = useMemo(() => {
    const queue = weeklyPlan.filter((slot) => !slot.isRestDay)
    return queue
  }, [weeklyPlan])
  const activeTrack = workoutQueue[activeTrackIndex] ?? workoutQueue[0]
  const trackDurationSec = Math.max(60, (activeTrack?.durationMin || 0) * 60)
  const progressPercent = Math.min(100, (elapsedSec / trackDurationSec) * 100)

  useEffect(() => {
    if (!workoutStarted || !isPlaying) {
      return
    }

    const interval = window.setInterval(() => {
      setElapsedSec((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [isPlaying, workoutStarted])

  async function handleStartWorkout() {
    if (!hasRoutineOptions || !activePlan || activePlan.isRestDay) {
      return
    }

    setElapsedSec(0)
    setSessionSets(1)
    setSessionReps(Math.max(1, activePlan?.durationMin ? Math.round(activePlan.durationMin / 6) : 8))
    const currentTrackIndex = workoutQueue.findIndex((slot) => slot.day === activePlan?.day)
    setActiveTrackIndex(currentTrackIndex >= 0 ? currentTrackIndex : 0)
    setWorkoutStarted(true)
    setIsPlaying(true)
  }

  async function handleStopWorkout() {
    await onSaveQuickWorkout({
      exerciseName: activeTrack?.exerciseName || activePlan?.exerciseName || 'Workout',
      reps: sessionReps,
      sets: sessionSets,
      durationSec: elapsedSec,
    })
    setWorkoutStarted(false)
    setIsPlaying(false)
    setElapsedSec(0)
  }

  function handlePrevTrack() {
    if (workoutQueue.length === 0) {
      return
    }
    setActiveTrackIndex((current) => (current - 1 + workoutQueue.length) % workoutQueue.length)
    setElapsedSec(0)
  }

  function handleNextTrack() {
    if (workoutQueue.length === 0) {
      return
    }
    setActiveTrackIndex((current) => (current + 1) % workoutQueue.length)
    setElapsedSec(0)
  }

  function handleCancelWorkout() {
    setWorkoutStarted(false)
    setIsPlaying(false)
    setElapsedSec(0)
  }

  return (
    <section className="fit-planner-layout fit-planner-workout-layout">
      {workoutStarted ? (
        <aside className="workout-player workout-player-top">
          <div className="workout-player-main">
            <div>
              <small>Workout Player</small>
              <strong>{activeTrack?.exerciseName || 'Workout Session'}</strong>
            </div>
            <div className="workout-player-controls">
              <button className="fit-btn fit-btn-soft workout-control-btn" type="button" onClick={handlePrevTrack}>
                <span className="material-symbols-outlined">skip_previous</span>
              </button>
              <button className="fit-btn fit-btn-primary workout-control-btn" type="button" onClick={() => setIsPlaying((current) => !current)}>
                <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
              <button className="fit-btn fit-btn-soft workout-control-btn" type="button" onClick={handleNextTrack}>
                <span className="material-symbols-outlined">skip_next</span>
              </button>
            </div>
          </div>

          <div className="workout-player-progress">
            <div className="workout-progress-track">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="workout-player-times">
              <span>{Math.floor(elapsedSec / 60).toString().padStart(2, '0')}:{(elapsedSec % 60).toString().padStart(2, '0')}</span>
              <span>{Math.floor(trackDurationSec / 60).toString().padStart(2, '0')}:{(trackDurationSec % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          <div className="workout-player-stats">
            <label>
              Sets
              <input type="number" min={1} value={sessionSets} onChange={(event) => setSessionSets(Number(event.target.value))} />
            </label>
            <label>
              Reps
              <input type="number" min={1} value={sessionReps} onChange={(event) => setSessionReps(Number(event.target.value))} />
            </label>
            <div className="workout-player-actions">
              <button className="fit-btn fit-btn-soft" type="button" onClick={handleCancelWorkout}>Cancelar</button>
              <button className="fit-btn fit-btn-primary" type="button" onClick={handleStopWorkout}>Guardar sesión</button>
            </div>
          </div>
        </aside>
      ) : null}

      <aside className="planner-sidebar">
        <article className="glass-card">
          <small className="muted">Current Phase</small>
          <h3>{phase}</h3>
          <div className="planner-progress">
            <span style={{ width: '45%' }} />
          </div>
          <p className="muted">45% complete</p>
          <button className="fit-btn fit-btn-soft" type="button">View Analytics</button>
        </article>

        <article className="glass-card">
          <div className="panel-head">
            <h2>{t('ejercicios.userRoutines')}</h2>
            <span>{phase}</span>
          </div>
          {routines.length ? (
            <ul className="recommend-list planner-recommend-list">
              {routines.map((routine) => (
                <li key={routine.id}>
                  <div>
                    <h4>{routine.name}</h4>
                    <p>{routine.exercises.length} {t('rutinas.exercise')}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="planner-empty-routines">
              <p className="muted">{t('ejercicios.noRoutines')}</p>
              <button className="fit-btn fit-btn-primary" type="button" onClick={onGoToRoutines}>
                {t('ejercicios.createRoutinesCta')}
              </button>
            </div>
          )}
        </article>
      </aside>

      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>{t('ejercicios.weekly')}</h2>
          <span>{t('ejercicios.range')}</span>
        </div>
        <div className="planner-week-grid">
          {weeklyPlan.map((slot, index) => (
            <div key={slot.day} className={index === 0 ? 'week-day active planner-day' : 'week-day planner-day'}>
              <header>
                <small>{slot.day}</small>
                <strong>{23 + index}</strong>
              </header>
              {!slot.isRestDay ? (
                <div className="planner-session">
                  <select
                    value={slot.exerciseName}
                    onChange={(event) => onUpdateWeeklyPlanItem(index, { exerciseName: event.target.value, isRestDay: false })}
                  >
                    {planOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <label>
                    <span>Duración (min)</span>
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={slot.durationMin}
                      onChange={(event) =>
                        onUpdateWeeklyPlanItem(index, { durationMin: Number(event.target.value), isRestDay: false })
                      }
                    />
                  </label>
                  <button className="fit-btn fit-btn-soft" type="button" onClick={() => onUpdateWeeklyPlanItem(index, { isRestDay: true, exerciseName: 'Rest Day' })}>
                    Rest Day
                  </button>
                </div>
              ) : (
                <div className="planner-session planner-session-rest">
                  <p className="muted">Rest Day</p>
                  <button
                    className="fit-btn fit-btn-soft"
                    type="button"
                    disabled={!hasRoutineOptions}
                    onClick={() => {
                      if (!hasRoutineOptions) {
                        onGoToRoutines()
                        return
                      }

                      onUpdateWeeklyPlanItem(index, { isRestDay: false, exerciseName: planOptions[0], durationMin: 45 })
                    }}
                  >
                    Activar sesión
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="planner-footer">
          <div>
            <small>Total volume</small>
            <strong>124,500 kg</strong>
          </div>
          <div>
            <small>Duration</small>
            <strong>5h 45m</strong>
          </div>
          <div>
            <small>Est. Burn</small>
            <strong>3,200 kcal</strong>
          </div>
          <button className="fit-btn fit-btn-primary" type="button" onClick={handleStartWorkout} disabled={!hasRoutineOptions || !activePlan || activePlan.isRestDay}>
            Start today's workout
          </button>
        </footer>
      </article>
    </section>
  )
}
