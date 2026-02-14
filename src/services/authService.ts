import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { get, ref, set } from 'firebase/database'
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

const googleProvider = new GoogleAuthProvider()

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

export async function loginWithGoogle() {
  if (!auth || !db) {
    throw new Error('Firebase no está configurado')
  }

  const credential = await signInWithPopup(auth, googleProvider)
  const user = credential.user

  const profileRef = ref(db, `users/${user.uid}/profile`)
  const existingProfile = await get(profileRef)

  if (!existingProfile.exists()) {
    const profileData: UserProfile = {
      uid: user.uid,
      fullName: user.displayName ?? 'Gym Member',
      email: user.email ?? '',
      phone: '',
      age: 20,
      heightCm: 170,
      trainingPhase: 'adaptacion',
      goal: '',
      createdAt: new Date().toISOString(),
    }

    await set(profileRef, profileData)
  }
}

export async function logoutSession() {
  if (!auth) {
    return
  }

  await signOut(auth)
}
