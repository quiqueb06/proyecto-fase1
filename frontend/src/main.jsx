import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StorageProvider } from './context/StorageProvider.jsx'
import { ThemeProvider }   from './context/ThemeProvider.jsx'
import { UserProvider }    from './context/UserProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <StorageProvider>
          <App />
        </StorageProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
