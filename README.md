# Total Training (React + TypeScript + Vite)

Aplicación web para el seguimiento completo del proceso en gimnasio:

- Inscripción de usuario y perfil deportivo
- Registro de medidas e índices (IMC)
- Ejercicios recomendados por fase de entrenamiento
- Rutinas guardadas con interacción de repeticiones en tiempo real
- Tracking de progreso y estado diario
- Firebase Authentication + Realtime Database

## Requisitos

- Node.js 20+
- pnpm 10+

## Configuración

1. Copia `.env.example` a `.env.local`
2. Rellena variables desde tu proyecto Firebase
3. Activa en Firebase:
   - Authentication (Email/Password)
   - Realtime Database

## Ejecutar

```bash
pnpm install
pnpm dev
```

## Build y lint

```bash
pnpm lint
pnpm build
```

## Deploy a Firebase Hosting

1. Edita `.firebaserc` y reemplaza `TU_PROJECT_ID_FIREBASE` por tu project id real.
2. Inicia sesión en Firebase CLI:

```bash
pnpm firebase:login
```

3. Publica hosting:

```bash
pnpm deploy:hosting
```

## Estructura de datos esperada (Realtime Database)

```text
users/{uid}/profile
users/{uid}/measurements/{measurementId}
users/{uid}/routines/{routineId}
users/{uid}/progress/{progressId}
```
