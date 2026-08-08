import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CareerLensProvider } from './context/CareerLensContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CareerLensProvider>
        <App />
      </CareerLensProvider>
    </BrowserRouter>
  </StrictMode>,
)
