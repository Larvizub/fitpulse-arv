export type Language = 'es' | 'en'

export const translations = {
  es: {
    tab: {
      resumen: 'Resumen',
      perfil: 'Inscripción',
      medidas: 'Métricas',
      ejercicios: 'Recomendaciones',
      rutinas: 'Rutinas',
      progreso: 'Progreso',
    },
    common: {
      activePhase: 'Fase activa',
      memberDashboard: 'Panel del miembro',
      logout: 'Cerrar sesión',
      gymMember: 'Miembro Gym',
      spanish: 'Español',
      english: 'Inglés',
      live: 'En vivo',
      daily: 'Diario',
      realtime: 'Tiempo real',
    },
    auth: {
      chip: 'Nueva sede abierta',
      titleTop: 'TRANSFORMA TU CUERPO',
      titleBottom: 'DOMINA TU MENTE',
      subtitle: 'Plataforma integral para inscripción, métricas de salud, rutinas interactivas y seguimiento completo del progreso en gimnasio.',
      loginTitle: 'Iniciar sesión',
      registerTitle: 'Únete',
      loginSubtitle: 'Accede a tu panel',
      registerSubtitle: 'Crea tu perfil inicial',
      fullName: 'Nombre completo',
      primaryGoal: 'Objetivo principal',
      email: 'Correo',
      password: 'Contraseña',
      signIn: 'Entrar',
      createAccount: 'Crear cuenta',
      googleContinue: 'Continuar con Google',
      toRegister: '¿No tienes cuenta? Regístrate',
      toLogin: '¿Ya tienes cuenta? Inicia sesión',
      connecting: 'Conectando...',
      setupFirebase: 'Configura Firebase en .env.local para habilitar Authentication y Realtime Database.',
    },
    resumen: {
      bmi: 'IMC actual',
      performance: 'Rendimiento',
      workouts: 'Entrenamientos',
      measurements: 'Mediciones',
      strengthProgression: 'Progresión de fuerza',
      goal: 'Objetivo',
      goalFallback: 'Define un objetivo en Inscripción para personalizar esta sección.',
      phase: 'Fase',
    },
    perfil: {
      title: 'Formulario de inscripción',
      step: 'Paso 1 de 3',
      fullName: 'Nombre completo',
      phone: 'Teléfono',
      age: 'Edad',
      height: 'Estatura (cm)',
      trainingPhase: 'Fase de entrenamiento',
      primaryGoal: 'Objetivo principal',
      save: 'Guardar inscripción',
      saving: 'Guardando...',
      saved: 'Inscripción guardada correctamente',
      saveError: 'No se pudo guardar la inscripción',
      savedTitle: 'Información guardada',
      savedHint: 'Tus datos ya están guardados. Puedes editar cuando lo necesites.',
      edit: 'Editar inscripción',
      cancelEdit: 'Cancelar edición',
      saveChanges: 'Guardar cambios',
    },
    medidas: {
      title: 'Métricas de salud',
      history: 'Historial',
      entries: 'registros',
      weight: 'Peso (kg)',
      bodyFat: 'Grasa corporal (%)',
      waist: 'Cintura (cm)',
      chest: 'Pecho (cm)',
      arm: 'Brazo (cm)',
      save: 'Guardar medición',
      waistShort: 'cintura',
      clearHistory: 'Borrar historial',
      clearing: 'Borrando...',
      clearConfirm: '¿Seguro que deseas borrar todo el historial de métricas?',
      cleared: 'Historial borrado correctamente',
      clearError: 'No se pudo borrar el historial',
    },
    ejercicios: {
      title: 'Recomendaciones por fase',
      weekly: 'Plan semanal',
      range: '23 Oct - 29 Oct',
      intensity: 'Intensidad',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    },
    rutinas: {
      queue: 'Cola de rutinas',
      routines: 'rutinas',
      routineName: 'Nombre de rutina',
      notes: 'Notas',
      exercise: 'Ejercicio',
      reps: 'Reps',
      add: 'Agregar',
      targetReps: 'reps objetivo',
      saveRoutine: 'Guardar rutina',
      tracker: 'Tracker de entrenamiento interactivo',
      sessionLive: 'Sesión en vivo',
      target: 'Objetivo',
      completed: 'Completado',
      actions: 'Acciones',
      createRoutineHint: 'Crea una rutina para activar el tracker interactivo.',
    },
    progreso: {
      title: 'Registrar progreso',
      timeline: 'Línea de progreso',
      logs: 'registros',
      mood: 'Ánimo',
      energy: 'Energía (1-10)',
      notes: 'Notas',
      save: 'Guardar progreso',
      noNotes: 'Sin notas',
      moodLabel: 'Ánimo',
      energyLabel: 'Energía',
    },
    phase: {
      adaptacion: 'Adaptación',
      volumen: 'Volumen',
      definicion: 'Definición',
      mantenimiento: 'Mantenimiento',
    },
  },
  en: {
    tab: {
      resumen: 'Dashboard',
      perfil: 'Enrollment',
      medidas: 'Metrics',
      ejercicios: 'Recommendations',
      rutinas: 'Workouts',
      progreso: 'Progress',
    },
    common: {
      activePhase: 'Active phase',
      memberDashboard: 'Member dashboard',
      logout: 'Log out',
      gymMember: 'Gym Member',
      spanish: 'Spanish',
      english: 'English',
      live: 'Live',
      daily: 'Daily',
      realtime: 'Realtime',
    },
    auth: {
      chip: 'New facility open',
      titleTop: 'TRANSFORM YOUR BODY',
      titleBottom: 'MASTER YOUR MIND',
      subtitle: 'All-in-one platform for enrollment, health metrics, interactive routines, and full gym progress tracking.',
      loginTitle: 'Log In',
      registerTitle: 'Join Now',
      loginSubtitle: 'Access your dashboard',
      registerSubtitle: 'Create your initial profile',
      fullName: 'Full name',
      primaryGoal: 'Primary goal',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign in',
      createAccount: 'Create account',
      googleContinue: 'Continue with Google',
      toRegister: "Don't have an account? Sign up",
      toLogin: 'Already have an account? Sign in',
      connecting: 'Connecting...',
      setupFirebase: 'Configure Firebase in .env.local to enable Authentication and Realtime Database.',
    },
    resumen: {
      bmi: 'Current BMI',
      performance: 'Performance',
      workouts: 'Workouts',
      measurements: 'Measurements',
      strengthProgression: 'Strength progression',
      goal: 'Goal',
      goalFallback: 'Set a goal in Enrollment to personalize this section.',
      phase: 'Phase',
    },
    perfil: {
      title: 'Enrollment form',
      step: 'Step 1 of 3',
      fullName: 'Full name',
      phone: 'Phone',
      age: 'Age',
      height: 'Height (cm)',
      trainingPhase: 'Training phase',
      primaryGoal: 'Primary goal',
      save: 'Save enrollment',
      saving: 'Saving...',
      saved: 'Enrollment saved successfully',
      saveError: 'Could not save enrollment',
      savedTitle: 'Saved information',
      savedHint: 'Your data is saved. You can edit it whenever you need.',
      edit: 'Edit enrollment',
      cancelEdit: 'Cancel editing',
      saveChanges: 'Save changes',
    },
    medidas: {
      title: 'Health metrics',
      history: 'History',
      entries: 'entries',
      weight: 'Weight (kg)',
      bodyFat: 'Body fat (%)',
      waist: 'Waist (cm)',
      chest: 'Chest (cm)',
      arm: 'Arm (cm)',
      save: 'Save measurement',
      waistShort: 'waist',
      clearHistory: 'Clear history',
      clearing: 'Clearing...',
      clearConfirm: 'Are you sure you want to delete the entire metrics history?',
      cleared: 'History cleared successfully',
      clearError: 'Could not clear history',
    },
    ejercicios: {
      title: 'Phase recommendations',
      weekly: 'Weekly schedule',
      range: 'Oct 23 - Oct 29',
      intensity: 'Intensity',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
    rutinas: {
      queue: 'Workout queue',
      routines: 'routines',
      routineName: 'Routine name',
      notes: 'Notes',
      exercise: 'Exercise',
      reps: 'Reps',
      add: 'Add',
      targetReps: 'target reps',
      saveRoutine: 'Save routine',
      tracker: 'Interactive workout tracker',
      sessionLive: 'Live session',
      target: 'Target',
      completed: 'Completed',
      actions: 'Actions',
      createRoutineHint: 'Create a routine to activate the interactive tracker.',
    },
    progreso: {
      title: 'Log progress',
      timeline: 'Progress timeline',
      logs: 'logs',
      mood: 'Mood',
      energy: 'Energy (1-10)',
      notes: 'Notes',
      save: 'Save progress',
      noNotes: 'No notes',
      moodLabel: 'Mood',
      energyLabel: 'Energy',
    },
    phase: {
      adaptacion: 'Adaptation',
      volumen: 'Bulking',
      definicion: 'Cutting',
      mantenimiento: 'Maintenance',
    },
  },
} as const

export type TranslationKey =
  | 'tab.resumen'
  | 'tab.perfil'
  | 'tab.medidas'
  | 'tab.ejercicios'
  | 'tab.rutinas'
  | 'tab.progreso'
  | 'common.activePhase'
  | 'common.memberDashboard'
  | 'common.logout'
  | 'common.gymMember'
  | 'common.spanish'
  | 'common.english'
  | 'common.live'
  | 'common.daily'
  | 'common.realtime'
  | 'auth.chip'
  | 'auth.titleTop'
  | 'auth.titleBottom'
  | 'auth.subtitle'
  | 'auth.loginTitle'
  | 'auth.registerTitle'
  | 'auth.loginSubtitle'
  | 'auth.registerSubtitle'
  | 'auth.fullName'
  | 'auth.primaryGoal'
  | 'auth.email'
  | 'auth.password'
  | 'auth.signIn'
  | 'auth.createAccount'
  | 'auth.googleContinue'
  | 'auth.toRegister'
  | 'auth.toLogin'
  | 'auth.connecting'
  | 'auth.setupFirebase'
  | 'resumen.bmi'
  | 'resumen.performance'
  | 'resumen.workouts'
  | 'resumen.measurements'
  | 'resumen.strengthProgression'
  | 'resumen.goal'
  | 'resumen.goalFallback'
  | 'resumen.phase'
  | 'perfil.title'
  | 'perfil.step'
  | 'perfil.fullName'
  | 'perfil.phone'
  | 'perfil.age'
  | 'perfil.height'
  | 'perfil.trainingPhase'
  | 'perfil.primaryGoal'
  | 'perfil.save'
  | 'perfil.saving'
  | 'perfil.saved'
  | 'perfil.saveError'
  | 'perfil.savedTitle'
  | 'perfil.savedHint'
  | 'perfil.edit'
  | 'perfil.cancelEdit'
  | 'perfil.saveChanges'
  | 'medidas.title'
  | 'medidas.history'
  | 'medidas.entries'
  | 'medidas.weight'
  | 'medidas.bodyFat'
  | 'medidas.waist'
  | 'medidas.chest'
  | 'medidas.arm'
  | 'medidas.save'
  | 'medidas.waistShort'
  | 'medidas.clearHistory'
  | 'medidas.clearing'
  | 'medidas.clearConfirm'
  | 'medidas.cleared'
  | 'medidas.clearError'
  | 'ejercicios.title'
  | 'ejercicios.weekly'
  | 'ejercicios.range'
  | 'ejercicios.intensity'
  | 'ejercicios.high'
  | 'ejercicios.medium'
  | 'ejercicios.low'
  | 'rutinas.queue'
  | 'rutinas.routines'
  | 'rutinas.routineName'
  | 'rutinas.notes'
  | 'rutinas.exercise'
  | 'rutinas.reps'
  | 'rutinas.add'
  | 'rutinas.targetReps'
  | 'rutinas.saveRoutine'
  | 'rutinas.tracker'
  | 'rutinas.sessionLive'
  | 'rutinas.target'
  | 'rutinas.completed'
  | 'rutinas.actions'
  | 'rutinas.createRoutineHint'
  | 'progreso.title'
  | 'progreso.timeline'
  | 'progreso.logs'
  | 'progreso.mood'
  | 'progreso.energy'
  | 'progreso.notes'
  | 'progreso.save'
  | 'progreso.noNotes'
  | 'progreso.moodLabel'
  | 'progreso.energyLabel'
  | 'phase.adaptacion'
  | 'phase.volumen'
  | 'phase.definicion'
  | 'phase.mantenimiento'

export function createTranslator(language: Language) {
  const source = translations[language]

  return function t(key: TranslationKey): string {
    const [namespace, value] = key.split('.')
    return (source as Record<string, Record<string, string>>)[namespace][value]
  }
}
