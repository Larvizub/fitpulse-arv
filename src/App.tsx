import { useState } from 'react'
import type { User } from 'firebase/auth'
import { firebaseEnabled } from './services/backendClient'
import { AppHeader } from './components/AppHeader'
import { AppSidebar } from './components/AppSidebar'
import { AuthLanding } from './components/AuthLanding'
import { EjerciciosSection } from './components/sections/EjerciciosSection'
import { MedidasSection } from './components/sections/MedidasSection'
import { PerfilSection } from './components/sections/PerfilSection'
import { ProgresoSection } from './components/sections/ProgresoSection'
import { ResumenSection } from './components/sections/ResumenSection'
import { RutinasSection } from './components/sections/RutinasSection'
import { useAuthSession } from './hooks/useAuthSession'
import { useGymData } from './hooks/useGymData'
import type { TabKey } from './shared/types'

function App() {
  const authSession = useAuthSession()

  if (!firebaseEnabled) {
    return (
      <main className="fit-landing-shell">
        <section className="landing-card">
          <h1>Total Training</h1>
          <p>Configura Firebase en .env.local para habilitar Authentication y Realtime Database.</p>
        </section>
      </main>
    )
  }

  if (authSession.loadingAuth) {
    return (
      <main className="fit-landing-shell">
        <section className="landing-card">
          <h1>Conectando...</h1>
        </section>
      </main>
    )
  }

  if (!authSession.currentUser) {
    return (
      <AuthLanding
        authMode={authSession.authMode}
        email={authSession.email}
        password={authSession.password}
        registerName={authSession.registerName}
        registerGoal={authSession.registerGoal}
        errorMessage={authSession.errorMessage}
        onEmailChange={authSession.setEmail}
        onPasswordChange={authSession.setPassword}
        onRegisterNameChange={authSession.setRegisterName}
        onRegisterGoalChange={authSession.setRegisterGoal}
        onToggleMode={authSession.toggleMode}
        onSubmit={authSession.handleSubmit}
      />
    )
  }

  return <AuthenticatedApp currentUser={authSession.currentUser} onLogout={authSession.logout} />
}

interface AuthenticatedAppProps {
  currentUser: User
  onLogout: () => Promise<void>
}

function AuthenticatedApp({ currentUser, onLogout }: AuthenticatedAppProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('resumen')
  const gymData = useGymData(currentUser)

  return (
    <main className="fit-app">
      <AppSidebar
        activeTab={activeTab}
        userName={gymData.profile?.fullName || 'Gym Member'}
        email={currentUser.email ?? ''}
        onChangeTab={setActiveTab}
        onLogout={onLogout}
      />

      <section className="fit-main">
        <AppHeader activeTab={activeTab} trainingPhase={gymData.profile?.trainingPhase ?? 'adaptacion'} />

        {activeTab === 'resumen' ? (
          <ResumenSection
            bmi={gymData.bmi}
            completionRate={gymData.completionRate}
            routineCount={gymData.routines.length}
            measurementCount={gymData.measurements.length}
            profile={gymData.profile}
          />
        ) : null}

        {activeTab === 'perfil' ? (
          <PerfilSection
            profileDraft={gymData.profileDraft}
            onSaveProfile={gymData.onSaveProfile}
            onChangeProfile={gymData.setProfileDraft}
            parseNumber={gymData.parseNumber}
          />
        ) : null}

        {activeTab === 'medidas' ? (
          <MedidasSection
            measurementDraft={gymData.measurementDraft}
            measurements={gymData.measurements}
            onChangeMeasurementDraft={gymData.setMeasurementDraft}
            onAddMeasurement={gymData.onAddMeasurement}
            parseNumber={gymData.parseNumber}
          />
        ) : null}

        {activeTab === 'ejercicios' ? (
          <EjerciciosSection
            phase={gymData.profile?.trainingPhase ?? 'adaptacion'}
            recommended={gymData.recommended}
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
            onSetExerciseName={gymData.setExerciseName}
            onSetExerciseTarget={gymData.setExerciseTarget}
            onAddExerciseToDraft={gymData.onAddExerciseToDraft}
            onSaveRoutine={gymData.onSaveRoutine}
            onUpdateExerciseReps={gymData.onUpdateExerciseReps}
            parseNumber={gymData.parseNumber}
          />
        ) : null}

        {activeTab === 'progreso' ? (
          <ProgresoSection
            progressDraft={gymData.progressDraft}
            progressEntries={gymData.progressEntries}
            onSetProgressDraft={gymData.setProgressDraft}
            onAddProgress={gymData.onAddProgress}
            parseNumber={gymData.parseNumber}
          />
        ) : null}
      </section>
    </main>
  )
}

export default App
