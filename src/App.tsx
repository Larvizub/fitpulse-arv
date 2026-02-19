import { useState } from 'react'
import type { User } from 'firebase/auth'
import { firebaseEnabled } from './firebase'
import { AppHeader } from './components/AppHeader'
import { AppSidebar } from './components/AppSidebar'
import { AuthLanding } from './components/AuthLanding'
import { EjerciciosSection } from './components/sections/EjerciciosSection.tsx'
import { MedidasSection } from './components/sections/MedidasSection.tsx'
import { PerfilSection } from './components/sections/PerfilSection.tsx'
import { ProgresoSection } from './components/sections/ProgresoSection.tsx'
import { ResumenSection } from './components/sections/ResumenSection.tsx'
import { RutinasSection } from './components/sections/RutinasSection.tsx'
import { useAuthSession } from './hooks/useAuthSession'
import { useGymData } from './hooks/useGymData'
import { useLanguage } from './hooks/useLanguage'
import type { TabKey } from './shared/types'

function App() {
  const authSession = useAuthSession()
  const languageState = useLanguage()

  if (!firebaseEnabled) {
    return (
      <main className="fit-landing-shell">
        <section className="landing-card">
          <h1>Fitpulse</h1>
          <p>{languageState.t('auth.setupFirebase')}</p>
        </section>
      </main>
    )
  }

  if (authSession.loadingAuth) {
    return (
      <main className="fit-landing-shell">
        <section className="landing-card">
          <h1>{languageState.t('auth.connecting')}</h1>
        </section>
      </main>
    )
  }

  if (!authSession.currentUser) {
    return (
      <AuthLanding
        authMode={authSession.authMode}
        language={languageState.language}
        t={languageState.t}
        email={authSession.email}
        password={authSession.password}
        registerName={authSession.registerName}
        registerGoal={authSession.registerGoal}
        errorMessage={authSession.errorMessage}
        onEmailChange={authSession.setEmail}
        onPasswordChange={authSession.setPassword}
        onRegisterNameChange={authSession.setRegisterName}
        onRegisterGoalChange={authSession.setRegisterGoal}
        onChangeLanguage={languageState.setLanguage}
        onGoogleLogin={authSession.loginGoogle}
        onToggleMode={authSession.toggleMode}
        onSubmit={authSession.handleSubmit}
      />
    )
  }

  return (
    <AuthenticatedApp
      currentUser={authSession.currentUser}
      onLogout={authSession.logout}
      language={languageState.language}
      t={languageState.t}
      onChangeLanguage={languageState.setLanguage}
    />
  )
}

interface AuthenticatedAppProps {
  currentUser: User
  onLogout: () => Promise<void>
  language: 'es' | 'en'
  t: ReturnType<typeof useLanguage>['t']
  onChangeLanguage: (language: 'es' | 'en') => void
}

function AuthenticatedApp({ currentUser, onLogout, language, t, onChangeLanguage }: AuthenticatedAppProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen')
  const gymData = useGymData(currentUser)
  const phaseLabel = t(`phase.${gymData.profile?.trainingPhase ?? 'adaptacion'}`)

  return (
    <main className="fit-app">
      <AppSidebar
        activeTab={activeTab}
        userName={gymData.profile?.fullName || t('common.gymMember')}
        email={currentUser.email ?? ''}
        t={t}
        onChangeTab={setActiveTab}
        onLogout={onLogout}
      />

      <section className="fit-main">
        <AppHeader
          activeTab={activeTab}
          trainingPhase={phaseLabel}
          language={language}
          t={t}
          onChangeLanguage={onChangeLanguage}
        />

        {activeTab === 'resumen' ? (
          <ResumenSection
            bmi={gymData.bmi}
            completionRate={gymData.completionRate}
            routineCount={gymData.routines.length}
            measurementCount={gymData.measurements.length}
            routines={gymData.routines}
            progressEntries={gymData.progressEntries}
            profile={gymData.profile}
            t={t}
          />
        ) : null}

        {activeTab === 'perfil' ? (
          <PerfilSection
            profileDraft={gymData.profileDraft}
            hasSavedProfile={Boolean(gymData.profile)}
            onSaveProfile={gymData.onSaveProfile}
            onChangeProfile={gymData.setProfileDraft}
            parseNumber={gymData.parseNumber}
            t={t}
          />
        ) : null}

        {activeTab === 'medidas' ? (
          <MedidasSection
            measurementDraft={gymData.measurementDraft}
            measurements={gymData.measurements}
            onChangeMeasurementDraft={gymData.setMeasurementDraft}
            onAddMeasurement={gymData.onAddMeasurement}
            onClearHistory={gymData.onClearMeasurementsHistory}
            onUpdateMeasurement={gymData.onUpdateMeasurement}
            onDeleteMeasurement={gymData.onDeleteMeasurement}
            parseNumber={gymData.parseNumber}
            t={t}
          />
        ) : null}

        {activeTab === 'ejercicios' ? (
          <EjerciciosSection
            phase={phaseLabel}
            routines={gymData.routines}
            weeklyPlan={gymData.weeklyPlan}
            onUpdateWeeklyPlanItem={gymData.onUpdateWeeklyPlanItem}
            onSaveQuickWorkout={gymData.onSaveQuickWorkout}
            onGoToRoutines={() => setActiveTab('rutinas')}
            t={t}
          />
        ) : null}

        {activeTab === 'rutinas' ? (
          <RutinasSection
            routines={gymData.routines}
            activeRoutine={gymData.activeRoutine}
            routineName={gymData.routineName}
            routineNotes={gymData.routineNotes}
            exerciseName={gymData.exerciseName}
            exerciseTarget={gymData.exerciseTarget}
            routineExercisesDraft={gymData.routineExercisesDraft}
            onSetRoutineName={gymData.setRoutineName}
            onSetRoutineNotes={gymData.setRoutineNotes}
            onSelectRoutine={gymData.setSelectedRoutineId}
            onDeleteRoutine={gymData.onDeleteRoutine}
            onSetExerciseName={gymData.setExerciseName}
            onSetExerciseTarget={gymData.setExerciseTarget}
            onAddExerciseToDraft={gymData.onAddExerciseToDraft}
            onDeleteExerciseFromDraft={gymData.onDeleteExerciseFromDraft}
            onSaveRoutine={gymData.onSaveRoutine}
            onUpdateExerciseReps={gymData.onUpdateExerciseReps}
            onDeleteExerciseFromRoutine={gymData.onDeleteExerciseFromRoutine}
            parseNumber={gymData.parseNumber}
            t={t}
          />
        ) : null}

        {activeTab === 'progreso' ? (
          <ProgresoSection
            progressDraft={gymData.progressDraft}
            progressEntries={gymData.progressEntries}
            onSetProgressDraft={gymData.setProgressDraft}
            onAddProgress={gymData.onAddProgress}
            onDeleteProgress={gymData.onDeleteProgress}
            onClearProgress={gymData.onClearProgress}
            parseNumber={gymData.parseNumber}
            t={t}
          />
        ) : null}
      </section>
    </main>
  )
}

export default App
