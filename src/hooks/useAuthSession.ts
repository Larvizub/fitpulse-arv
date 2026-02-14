import { useEffect, useState, type FormEvent } from 'react'
import type { User } from 'firebase/auth'
import { loginWithEmail, loginWithGoogle, logoutSession, registerWithEmail, watchAuthState } from '../services/authService'

export interface AuthSessionState {
  currentUser: User | null
  loadingAuth: boolean
  authMode: 'login' | 'registro'
  email: string
  password: string
  registerName: string
  registerGoal: string
  errorMessage: string
}

export function useAuthSession() {
  const [state, setState] = useState<AuthSessionState>({
    currentUser: null,
    loadingAuth: true,
    authMode: 'login',
    email: '',
    password: '',
    registerName: '',
    registerGoal: '',
    errorMessage: '',
  })

  useEffect(() => {
    const unsubscribe = watchAuthState((user) => {
      setState((prev) => ({ ...prev, currentUser: user, loadingAuth: false }))
    })

    return unsubscribe
  }, [])

  const actions = {
    setEmail(value: string) {
      setState((prev) => ({ ...prev, email: value }))
    },
    setPassword(value: string) {
      setState((prev) => ({ ...prev, password: value }))
    },
    setRegisterName(value: string) {
      setState((prev) => ({ ...prev, registerName: value }))
    },
    setRegisterGoal(value: string) {
      setState((prev) => ({ ...prev, registerGoal: value }))
    },
    toggleMode() {
      setState((prev) => ({
        ...prev,
        authMode: prev.authMode === 'login' ? 'registro' : 'login',
        errorMessage: '',
      }))
    },
    async handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault()
      setState((prev) => ({ ...prev, errorMessage: '' }))

      try {
        if (state.authMode === 'registro') {
          await registerWithEmail({
            email: state.email,
            password: state.password,
            fullName: state.registerName,
            goal: state.registerGoal,
          })
        } else {
          await loginWithEmail({ email: state.email, password: state.password })
        }

        setState((prev) => ({
          ...prev,
          email: '',
          password: '',
          registerName: '',
          registerGoal: '',
          errorMessage: '',
        }))
      } catch (error) {
        setState((prev) => ({ ...prev, errorMessage: (error as Error).message }))
      }
    },
    async logout() {
      await logoutSession()
    },
    async loginGoogle() {
      setState((prev) => ({ ...prev, errorMessage: '' }))

      try {
        await loginWithGoogle()
      } catch (error) {
        setState((prev) => ({ ...prev, errorMessage: (error as Error).message }))
      }
    },
  }

  return {
    ...state,
    ...actions,
  }
}
