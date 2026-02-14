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
          <button className="fit-btn fit-btn-soft" type="button" onClick={props.onToggleMode}>
            {props.authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </form>
      </section>
    </main>
  )
}
