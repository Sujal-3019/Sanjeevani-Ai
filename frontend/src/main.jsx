import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css' // आपकी ग्लोबल CSS स्टाइलशीट

// HTML के 'root' एलिमेंट में React ऐप को रेंडर करना
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)