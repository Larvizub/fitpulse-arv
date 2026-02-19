import { onValue, push, ref, set, update } from 'firebase/database'
import { db } from '../firebase'
import type { Measurement, ProgressEntry, Routine, RoutineExercise, UserProfile, WeeklyPlanItem } from '../types'

export interface UserSubscriptions {
  profile: (value: UserProfile | null) => void
  measurements: (value: Measurement[]) => void
  routines: (value: Routine[]) => void
  progressEntries: (value: ProgressEntry[]) => void
  weeklyPlan: (value: WeeklyPlanItem[]) => void
}

function mapList<T>(value: T | T[] | Record<string, T> | null | undefined): T[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return Object.values(value)
}

function normalizeRoutineExercise(raw: unknown): RoutineExercise | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const source = raw as Partial<RoutineExercise>
  if (!source.name) {
    return null
  }

  return {
    id: source.id ?? crypto.randomUUID(),
    name: String(source.name),
    targetReps: Number(source.targetReps ?? 0),
    completedReps: Number(source.completedReps ?? 0),
  }
}

function normalizeRoutine(raw: unknown): Routine | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const source = raw as Partial<Routine> & { exercises?: RoutineExercise[] | Record<string, RoutineExercise> }
  if (!source.name) {
    return null
  }

  const normalizedExercises = mapList(source.exercises)
    .map((exercise) => normalizeRoutineExercise(exercise))
    .filter((exercise): exercise is RoutineExercise => Boolean(exercise))

  return {
    id: source.id ?? crypto.randomUUID(),
    name: String(source.name),
    notes: String(source.notes ?? ''),
    date: String(source.date ?? new Date().toISOString()),
    exercises: normalizedExercises,
  }
}

export function subscribeToUserData(uid: string, subscriptions: UserSubscriptions) {
  if (!db) {
    subscriptions.profile(null)
    subscriptions.measurements([])
    subscriptions.routines([])
    subscriptions.progressEntries([])
    subscriptions.weeklyPlan([])
    return () => undefined
  }

  const profileRef = ref(db, `users/${uid}/profile`)
  const measurementsRef = ref(db, `users/${uid}/measurements`)
  const routinesRef = ref(db, `users/${uid}/routines`)
  const progressRef = ref(db, `users/${uid}/progress`)
  const weeklyPlanRef = ref(db, `users/${uid}/weeklyPlan`)

  const unsubProfile = onValue(profileRef, (snapshot) => {
    subscriptions.profile(snapshot.val() as UserProfile | null)
  })

  const unsubMeasurements = onValue(measurementsRef, (snapshot) => {
    const value = snapshot.val() as Record<string, Measurement> | null
    const list = mapList(value).sort((a, b) => (a.date < b.date ? 1 : -1))
    subscriptions.measurements(list)
  })

  const unsubRoutines = onValue(routinesRef, (snapshot) => {
    const value = snapshot.val() as Record<string, unknown> | null
    const list = mapList(value)
      .map((routine) => normalizeRoutine(routine))
      .filter((routine): routine is Routine => Boolean(routine))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    subscriptions.routines(list)
  })

  const unsubProgress = onValue(progressRef, (snapshot) => {
    const value = snapshot.val() as Record<string, ProgressEntry> | null
    const list = mapList(value).sort((a, b) => (a.date < b.date ? 1 : -1))
    subscriptions.progressEntries(list)
  })

  const unsubWeeklyPlan = onValue(weeklyPlanRef, (snapshot) => {
    const value = snapshot.val() as Record<string, WeeklyPlanItem> | WeeklyPlanItem[] | null
    subscriptions.weeklyPlan(mapList(value))
  })

  return () => {
    unsubProfile()
    unsubMeasurements()
    unsubRoutines()
    unsubProgress()
    unsubWeeklyPlan()
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

export async function clearMeasurementsHistory(uid: string) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/measurements`), null)
}

export async function updateMeasurement(uid: string, measurementId: string, payload: Partial<Measurement>) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await update(ref(db, `users/${uid}/measurements/${measurementId}`), payload)
}

export async function deleteMeasurement(uid: string, measurementId: string) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/measurements/${measurementId}`), null)
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

export async function deleteRoutine(uid: string, routineId: string) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/routines/${routineId}`), null)
}

export async function updateRoutineExercises(uid: string, routineId: string, exercises: RoutineExercise[]) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await update(ref(db, `users/${uid}/routines/${routineId}`), { exercises })
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

export async function deleteProgressEntry(uid: string, progressEntryId: string) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/progress/${progressEntryId}`), null)
}

export async function clearProgressEntries(uid: string) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/progress`), null)
}

export async function saveWeeklyPlan(uid: string, weeklyPlan: WeeklyPlanItem[]) {
  if (!db) {
    throw new Error('Firebase no está configurado')
  }

  await set(ref(db, `users/${uid}/weeklyPlan`), weeklyPlan)
}
