import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config' // Initialize i18n
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // TEMPORARILY DISABLE StrictMode to fix production content disappearing issue
  // <StrictMode>
    <App />
  // </StrictMode>,
)
