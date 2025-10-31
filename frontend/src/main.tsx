import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'
import './index.css'
import App from './App.tsx'

scan();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
