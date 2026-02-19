import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { User } from 'firebase/auth'
import type {
  Measurement,
  ProgressEntry,
  Routine,
  RoutineExercise,
  TrainingPhase,
  UserProfile,
  WeeklyPlanItem,
} from '../types'
import {
  addMeasurement,
  addProgressEntry,
  addRoutine,
  clearMeasurementsHistory,
  clearProgressEntries,
  deleteMeasurement,
  deleteProgressEntry,
  deleteRoutine,
  saveUserProfile,
  saveWeeklyPlan,
  subscribeToUserData,
  updateMeasurement,
  updateRoutineExercises,
  updateRoutineExerciseReps,
} from '../services/gymService'
import { PHASE_RECOMMENDATIONS } from '../constants/gym'
import { getBmi, parseNumber } from '../shared/utils'

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DEFAULT_ROUTINE_NAMES = new Set(Object.values(PHASE_RECOMMENDATIONS).flat())

function buildDefaultWeeklyPlan(exercises: string[]): WeeklyPlanItem[] {
  return WEEK_DAYS.map((day, index) => {
    const hasExercises = exercises.length > 0
    const isRestDay = !hasExercises || index >= 5
    return {
      day,
      exerciseName: isRestDay ? 'Rest Day' : exercises[index % exercises.length],
      durationMin: isRestDay ? 0 : index < 2 ? 65 : 45,
      isRestDay,
    }
  })
}

export function useGymData(currentUser: User) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([])
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanItem[]>([])

  const [profileDraft, setProfileDraft] = useState({
    fullName: '',
    phone: '',
    age: 20,
    heightCm: 170,
    trainingPhase: 'adaptacion' as TrainingPhase,
    goal: '',
  })

  const [measurementDraft, setMeasurementDraft] = useState({
    weightKg: 70,
    bodyFatPercent: 18,
    waistCm: 80,
    chestCm: 90,
    armCm: 32,
  })

  const [routineName, setRoutineName] = useState('')
  const [routineNotes, setRoutineNotes] = useState('')
  const [exerciseName, setExerciseName] = useState('')
  const [exerciseTarget, setExerciseTarget] = useState(10)
  const [routineExercisesDraft, setRoutineExercisesDraft] = useState<RoutineExercise[]>([])
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null)
  const cleanedTemplateRoutinesRef = useRef(false)

  const [progressDraft, setProgressDraft] = useState({
    mood: 'media' as ProgressEntry['mood'],
    energyLevel: 6,
    notes: '',
  })

  useEffect(() => {
    return subscribeToUserData(currentUser.uid, {
      profile: (value) => {
        setProfile(value)
        if (value) {
          setProfileDraft({
            fullName: value.fullName,
            phone: value.phone,
            age: value.age,
            heightCm: value.heightCm,
            trainingPhase: value.trainingPhase,
            goal: value.goal,
          })
        }
      },
      measurements: setMeasurements,
      routines: setRoutines,
      progressEntries: setProgressEntries,
      weeklyPlan: setWeeklyPlan,
    })
  }, [currentUser])

  useEffect(() => {
    if (cleanedTemplateRoutinesRef.current || !routines.length) {
      return
    }

    const onlyDefaultTemplates = routines.every((routine) => {
      const templateName = DEFAULT_ROUTINE_NAMES.has(routine.name)
      const noNotes = !routine.notes.trim()
      const noProgress = routine.exercises.every((exercise) => exercise.completedReps === 0)
      return templateName && noNotes && noProgress
    })

    if (!onlyDefaultTemplates) {
      cleanedTemplateRoutinesRef.current = true
      return
    }

    cleanedTemplateRoutinesRef.current = true
    Promise.all(routines.map((routine) => deleteRoutine(currentUser.uid, routine.id))).catch(() => {
      cleanedTemplateRoutinesRef.current = false
    })
  }, [currentUser.uid, routines])

  const latestMeasurement = measurements[0]
  const bmi = latestMeasurement && profile?.heightCm ? getBmi(latestMeasurement.weightKg, profile.heightCm) : 0

  const completionRate = useMemo(() => {
    const allExercises = routines.flatMap((routine) => routine.exercises).filter(Boolean)
    const total = allExercises.reduce((acc, exercise) => acc + Number(exercise.targetReps ?? 0), 0)
    const done = allExercises.reduce(
      (acc, exercise) => acc + Math.min(Number(exercise.completedReps ?? 0), Number(exercise.targetReps ?? 0)),
      0,
    )
    return total ? Math.round((done / total) * 100) : 0
  }, [routines])

  const recommended = useMemo(() => {
    const phaseRecommendations = PHASE_RECOMMENDATIONS[profile?.trainingPhase ?? 'adaptacion']
    const routineBased = routines
      .flatMap((routine) => routine.exercises.map((exercise) => exercise?.name).filter(Boolean))
      .slice(0, 4)
    const adaptive = completionRate >= 70
      ? ['Progressive Overload Session', 'Power Endurance Block']
      : ['Foundation Strength Circuit', 'Technique + Recovery']

    return Array.from(new Set([...phaseRecommendations, ...routineBased, ...adaptive])).slice(0, 8)
  }, [profile?.trainingPhase, routines, completionRate])

  async function onSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const payload: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email ?? '',
      createdAt: profile?.createdAt ?? new Date().toISOString(),
      ...profileDraft,
    }

    await saveUserProfile(currentUser.uid, payload)
  }

  async function onAddMeasurement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await addMeasurement(currentUser.uid, measurementDraft)
  }

  async function onClearMeasurementsHistory() {
    await clearMeasurementsHistory(currentUser.uid)
  }

  async function onUpdateMeasurement(measurementId: string, payload: Omit<Measurement, 'id' | 'date'>) {
    await updateMeasurement(currentUser.uid, measurementId, payload)
  }

  async function onDeleteMeasurement(measurementId: string) {
    await deleteMeasurement(currentUser.uid, measurementId)
  }

  function onAddExerciseToDraft() {
    if (!exerciseName.trim()) {
      return
    }

    setRoutineExercisesDraft((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: exerciseName.trim(),
        targetReps: exerciseTarget,
        completedReps: 0,
      },
    ])

    setExerciseName('')
    setExerciseTarget(10)
  }

  function onDeleteExerciseFromDraft(exerciseId: string) {
    setRoutineExercisesDraft((current) => current.filter((exercise) => exercise.id !== exerciseId))
  }

  async function onSaveRoutine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!routineName.trim() || !routineExercisesDraft.length) {
      return
    }

    await addRoutine(currentUser.uid, {
      name: routineName.trim(),
      notes: routineNotes.trim(),
      exercises: routineExercisesDraft,
    })

    setRoutineName('')
    setRoutineNotes('')
    setRoutineExercisesDraft([])
  }

  async function onUpdateExerciseReps(routine: Routine, exercise: RoutineExercise, delta: number) {
    await updateRoutineExerciseReps(currentUser.uid, routine, exercise, delta)
  }

  async function onDeleteExerciseFromRoutine(routine: Routine, exerciseId: string) {
    const exercises = routine.exercises.filter((exercise) => exercise.id !== exerciseId)
    await updateRoutineExercises(currentUser.uid, routine.id, exercises)
  }

  async function onDeleteRoutine(routineId: string) {
    await deleteRoutine(currentUser.uid, routineId)
  }

  async function onAddProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await addProgressEntry(currentUser.uid, progressDraft)
    setProgressDraft({ mood: 'media', energyLevel: 6, notes: '' })
  }

  async function onDeleteProgress(progressEntryId: string) {
    await deleteProgressEntry(currentUser.uid, progressEntryId)
  }

  async function onClearProgress() {
    await clearProgressEntries(currentUser.uid)
  }

  const routineExerciseNames = useMemo(
    () => Array.from(new Set(routines.flatMap((routine) => routine.exercises.map((exercise) => exercise.name).filter(Boolean)))),
    [routines],
  )

  const weeklyPlanData = useMemo(() => {
    if (!routineExerciseNames.length) {
      return buildDefaultWeeklyPlan([])
    }

    const sourcePlan = weeklyPlan.length ? weeklyPlan : buildDefaultWeeklyPlan(routineExerciseNames)
    return sourcePlan.map((slot) => {
      if (slot.isRestDay) {
        return slot
      }

      if (!routineExerciseNames.includes(slot.exerciseName)) {
        return {
          ...slot,
          exerciseName: routineExerciseNames[0],
        }
      }

      return slot
    })
  }, [routineExerciseNames, weeklyPlan])

  async function onUpdateWeeklyPlanItem(index: number, updates: Partial<WeeklyPlanItem>) {
    const nextPlan = weeklyPlanData.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return item
      }

      const isRestDay = updates.isRestDay ?? item.isRestDay
      return {
        ...item,
        ...updates,
        isRestDay,
        durationMin: isRestDay ? 0 : updates.durationMin ?? item.durationMin,
      }
    })

    setWeeklyPlan(nextPlan)
    await saveWeeklyPlan(currentUser.uid, nextPlan)
  }

  async function onSaveQuickWorkout(payload: { exerciseName: string; reps: number; sets: number; durationSec: number }) {
    const minutes = Math.max(1, Math.round(payload.durationSec / 60))
    await addProgressEntry(currentUser.uid, {
      mood: 'alta',
      energyLevel: 8,
      notes: `Workout rápido: ${payload.exerciseName} • ${payload.sets} sets • ${payload.reps} reps • ${minutes} min`,
    })
  }

  return {
    profile,
    measurements,
    routines,
    progressEntries,
    profileDraft,
    measurementDraft,
    routineName,
    routineNotes,
    exerciseName,
    exerciseTarget,
    routineExercisesDraft,
    progressDraft,
    weeklyPlan: weeklyPlanData,
    bmi,
    completionRate,
    recommended,
    activeRoutine: routines.find((routine) => routine.id === selectedRoutineId) ?? routines[0],
    parseNumber,
    setProfileDraft,
    setMeasurementDraft,
    setRoutineName,
    setRoutineNotes,
    setSelectedRoutineId,
    setExerciseName,
    setExerciseTarget,
    setProgressDraft,
    onSaveProfile,
    onAddMeasurement,
    onClearMeasurementsHistory,
    onUpdateMeasurement,
    onDeleteMeasurement,
    onAddExerciseToDraft,
    onDeleteExerciseFromDraft,
    onSaveRoutine,
    onUpdateExerciseReps,
    onDeleteExerciseFromRoutine,
    onDeleteRoutine,
    onAddProgress,
    onDeleteProgress,
    onClearProgress,
    onUpdateWeeklyPlanItem,
    onSaveQuickWorkout,
  }
}
