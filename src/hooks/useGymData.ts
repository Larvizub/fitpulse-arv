import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { User } from 'firebase/auth'
import type { Measurement, ProgressEntry, Routine, RoutineExercise, TrainingPhase, UserProfile } from '../types'
import {
  addMeasurement,
  addProgressEntry,
  addRoutine,
  saveUserProfile,
  subscribeToUserData,
  updateRoutineExerciseReps,
} from '../services/gymService'
import { PHASE_RECOMMENDATIONS } from '../constants/gym'
import { getBmi, parseNumber } from '../shared/utils'

export function useGymData(currentUser: User) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [routines, setRoutines] = useState<Routine[]>([])
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([])

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
    })
  }, [currentUser])

  const latestMeasurement = measurements[0]
  const bmi = latestMeasurement && profile?.heightCm ? getBmi(latestMeasurement.weightKg, profile.heightCm) : 0

  const completionRate = useMemo(() => {
    const allExercises = routines.flatMap((routine) => routine.exercises)
    const total = allExercises.reduce((acc, exercise) => acc + exercise.targetReps, 0)
    const done = allExercises.reduce((acc, exercise) => acc + Math.min(exercise.completedReps, exercise.targetReps), 0)
    return total ? Math.round((done / total) * 100) : 0
  }, [routines])

  const recommended = PHASE_RECOMMENDATIONS[profile?.trainingPhase ?? 'adaptacion']

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

  async function onAddProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await addProgressEntry(currentUser.uid, progressDraft)
    setProgressDraft({ mood: 'media', energyLevel: 6, notes: '' })
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
    bmi,
    completionRate,
    recommended,
    activeRoutine: routines[0],
    parseNumber,
    setProfileDraft,
    setMeasurementDraft,
    setRoutineName,
    setRoutineNotes,
    setExerciseName,
    setExerciseTarget,
    setProgressDraft,
    onSaveProfile,
    onAddMeasurement,
    onAddExerciseToDraft,
    onSaveRoutine,
    onUpdateExerciseReps,
    onAddProgress,
  }
}
