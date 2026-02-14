export type TrainingPhase = 'adaptacion' | 'volumen' | 'definicion' | 'mantenimiento'

export interface UserProfile {
  uid: string
  fullName: string
  email: string
  phone: string
  age: number
  heightCm: number
  trainingPhase: TrainingPhase
  goal: string
  createdAt: string
}

export interface Measurement {
  id: string
  weightKg: number
  bodyFatPercent: number
  waistCm: number
  chestCm: number
  armCm: number
  date: string
}

export interface RoutineExercise {
  id: string
  name: string
  targetReps: number
  completedReps: number
}

export interface Routine {
  id: string
  name: string
  notes: string
  date: string
  exercises: RoutineExercise[]
}

export interface ProgressEntry {
  id: string
  date: string
  mood: 'baja' | 'media' | 'alta'
  energyLevel: number
  notes: string
}
