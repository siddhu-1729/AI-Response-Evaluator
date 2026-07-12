import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { EvaluationProvider } from './context/EvaluationContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EvaluationProvider>
         <App />
      </EvaluationProvider>
    </BrowserRouter>
  </StrictMode>,
)
