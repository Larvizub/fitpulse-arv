import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase'
import type { UserProfile } from '../types'

export interface RegisterInput {
  email: string
  password: string
  fullName: string
  goal: string
}

export interface LoginInput {
  email: string
  password: string
}

export function watchAuthState(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null)
    return () => undefined
  }

  return onAuthStateChanged(auth, callback)
}

export async function registerWithEmail(input: RegisterInput) {
  if (!auth || !db) {
    throw new Error('Firebase no está configurado')
  }

  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password)

  const profileData: UserProfile = {
    uid: credential.user.uid,
    fullName: input.fullName,
    email: credential.user.email ?? input.email,
    phone: '',
    age: 20,
    heightCm: 170,
    trainingPhase: 'adaptacion',
    goal: input.goal,
    createdAt: new Date().toISOString(),
  }

  await set(ref(db, `users/${credential.user.uid}/profile`), profileData)
}

export async function loginWithEmail(input: LoginInput) {
  if (!auth) {
    throw new Error('Firebase no está configurado')
  }

  await signInWithEmailAndPassword(auth, input.email, input.password)
}

export async function logoutSession() {
  if (!auth) {
    return
  }

  await signOut(auth)
}
