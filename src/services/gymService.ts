import { onValue, push, ref, set, update } from 'firebase/database'
import { db } from '../firebase'
import type { Measurement, ProgressEntry, Routine, RoutineExercise, UserProfile } from '../types'

export interface UserSubscriptions {
  profile: (value: UserProfile | null) => void
  measurements: (value: Measurement[]) => void
  routines: (value: Routine[]) => void
  progressEntries: (value: ProgressEntry[]) => void
}

function mapList<T>(value: T | Record<string, T> | null | undefined): T[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return Object.values(value)
}

export function subscribeToUserData(uid: string, subscriptions: UserSubscriptions) {
  if (!db) {
    subscriptions.profile(null)
    subscriptions.measurements([])
    subscriptions.routines([])
    subscriptions.progressEntries([])
    return () => undefined
  }

  const profileRef = ref(db, `users/${uid}/profile`)
  const measurementsRef = ref(db, `users/${uid}/measurements`)
  const routinesRef = ref(db, `users/${uid}/routines`)
  const progressRef = ref(db, `users/${uid}/progress`)

  const unsubProfile = onValue(profileRef, (snapshot) => {
    subscriptions.profile(snapshot.val() as UserProfile | null)
  })

  const unsubMeasurements = onValue(measurementsRef, (snapshot) => {
    const value = snapshot.val() as Record<string, Measurement> | null
    const list = mapList(value).sort((a, b) => (a.date < b.date ? 1 : -1))
    subscriptions.measurements(list)
  })

  const unsubRoutines = onValue(routinesRef, (snapshot) => {
    const value = snapshot.val() as Record<string, Routine> | null
    const list = mapList(value).sort((a, b) => (a.date < b.date ? 1 : -1))
    subscriptions.routines(list)
  })

  const unsubProgress = onValue(progressRef, (snapshot) => {
    const value = snapshot.val() as Record<string, ProgressEntry> | null
    const list = mapList(value).sort((a, b) => (a.date < b.date ? 1 : -1))
    subscriptions.progressEntries(list)
  })

  return () => {
    unsubProfile()
    unsubMeasurements()
    unsubRoutines()
    unsubProgress()
  }
}

export async function saveUserProfile(uid: string, payload: UserProfile) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/profile`), payload)
}

export async function addMeasurement(uid: string, payload: Omit<Measurement, 'id' | 'date'>) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  const node = push(ref(db, `users/${uid}/measurements`))
  await set(node, {
    id: node.key ?? crypto.randomUUID(),
    ...payload,
    date: new Date().toISOString(),
  } satisfies Measurement)
}

export async function addRoutine(uid: string, payload: Omit<Routine, 'id' | 'date'>) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  const node = push(ref(db, `users/${uid}/routines`))
  await set(node, {
    id: node.key ?? crypto.randomUUID(),
    ...payload,
    date: new Date().toISOString(),
  } satisfies Routine)
}

export async function updateRoutineExerciseReps(
  uid: string,
  routine: Routine,
  exercise: RoutineExercise,
  delta: number,
) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  const nextReps = Math.max(0, exercise.completedReps + delta)
  const exercises = routine.exercises.map((item) =>
    item.id === exercise.id ? { ...item, completedReps: nextReps } : item,
  )

  await update(ref(db, `users/${uid}/routines/${routine.id}`), { exercises })
}

export async function addProgressEntry(uid: string, payload: Omit<ProgressEntry, 'id' | 'date'>) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  const node = push(ref(db, `users/${uid}/progress`))
  await set(node, {
    id: node.key ?? crypto.randomUUID(),
    ...payload,
    date: new Date().toISOString(),
  } satisfies ProgressEntry)
}
