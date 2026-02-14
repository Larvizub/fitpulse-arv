import type { TrainingPhase } from '../types'
import type { TabMeta } from '../shared/types'

export const TAB_META: TabMeta[] = [
  { key: 'resumen', label: 'Dashboard', icon: 'dashboard' },
  { key: 'perfil', label: 'Enrollment', icon: 'person_add' },
  { key: 'medidas', label: 'Health Metrics', icon: 'monitor_weight' },
  { key: 'ejercicios', label: 'Recommendations', icon: 'fitness_center' },
  { key: 'rutinas', label: 'Workout Tracker', icon: 'view_timeline' },
  { key: 'progreso', label: 'Progress', icon: 'bar_chart' },
]

export const PHASE_RECOMMENDATIONS: Record<TrainingPhase, string[]> = {
  adaptacion: ['Upper Body Power', 'Leg Hypertrophy', 'Active Recovery', 'Core Stability', 'Mobility Session'],
  volumen: ['Push Strength', 'Back Thickness', 'Lower Heavy Day', 'Arms Supersets', 'Conditioning Finisher'],
  definicion: ['HIIT Session', 'Metabolic Circuit', 'Explosive Legs', 'Upper Density', 'Core + Cardio'],
  mantenimiento: ['Balanced Full Body', 'Technique Session', 'Cardio Mix', 'Functional Strength', 'Recovery Flow'],
}
