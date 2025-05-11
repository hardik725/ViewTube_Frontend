import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // this is not important as app can run without the strictmode also
  <StrictMode>
    <App />
  </StrictMode>,
)
