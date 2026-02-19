import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(12, 42, 28, 0.95)',
          color: 'var(--text)',
          border: '1px solid rgba(19, 236, 91, 0.35)',
        },
      }}
    />
  </StrictMode>,
)
