import type { FormEvent } from 'react'

interface AuthLandingProps {
  authMode: 'login' | 'registro'
  email: string
  password: string
  registerName: string
  registerGoal: string
  errorMessage: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onRegisterNameChange: (value: string) => void
  onRegisterGoalChange: (value: string) => void
  onGoogleLogin: () => void
  onToggleMode: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthLanding(props: AuthLandingProps) {
  return (
    <main className="fit-landing-shell">
      <section className="fit-hero-grid">
        <div className="fit-hero-copy">
          <span className="hero-chip">New Facility Open</span>
          <h1>
            TRANSFORM YOUR BODY
            <br />
            <span>MASTER YOUR MIND</span>
          </h1>
          <p>
            Plataforma integral para inscripción, métricas de salud, rutinas interactivas y seguimiento completo del progreso en
            gimnasio.
          </p>
        </div>

        <form className="landing-card" onSubmit={props.onSubmit}>
          <div className="card-title">
            <h2>{props.authMode === 'login' ? 'Log In' : 'Join Now'}</h2>
            <p>{props.authMode === 'login' ? 'Accede a tu dashboard' : 'Crea tu perfil inicial'}</p>
          </div>

          {props.authMode === 'registro' ? (
            <>
              <label>
                Full Name
                <input value={props.registerName} onChange={(event) => props.onRegisterNameChange(event.target.value)} required />
              </label>
              <label>
                Primary Goal
                <input value={props.registerGoal} onChange={(event) => props.onRegisterGoalChange(event.target.value)} required />
              </label>
            </>
          ) : null}

          <label>
            Email
            <input type="email" value={props.email} onChange={(event) => props.onEmailChange(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" minLength={6} value={props.password} onChange={(event) => props.onPasswordChange(event.target.value)} required />
          </label>

          {props.errorMessage ? <p className="error">{props.errorMessage}</p> : null}

          <button className="fit-btn fit-btn-primary" type="submit">
            {props.authMode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
          <button className="fit-btn fit-btn-soft google-btn" type="button" onClick={props.onGoogleLogin}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.44a5.5 5.5 0 0 1-2.39 3.61v2.99h3.87c2.26-2.08 3.57-5.15 3.57-8.62z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.08 7.95-2.92l-3.87-2.99c-1.08.73-2.46 1.17-4.08 1.17-3.13 0-5.78-2.11-6.73-4.95H1.28v3.11A12 12 0 0 0 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.31A7.22 7.22 0 0 1 4.9 12c0-.8.14-1.57.37-2.31V6.58H1.28A12 12 0 0 0 0 12c0 1.93.46 3.75 1.28 5.42l3.99-3.11z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.33.61 4.57 1.8l3.43-3.43C17.95 1.16 15.23 0 12 0A12 12 0 0 0 1.28 6.58l3.99 3.11c.95-2.84 3.6-4.92 6.73-4.92z"
              />
            </svg>
            Continuar con Google
          </button>
          <button className="fit-btn fit-btn-soft" type="button" onClick={props.onToggleMode}>
            {props.authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </form>
      </section>
    </main>
  )
}
