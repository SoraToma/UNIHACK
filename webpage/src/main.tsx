import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SupabaseProvider } from './providers/supabaseProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SupabaseProvider>
      <Router>
        <App />
      </Router>
    </SupabaseProvider>
  </StrictMode>,
)
