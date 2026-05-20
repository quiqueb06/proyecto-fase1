// src/context/ThemeProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [tema, setTemaState] = useState(() =>
    localStorage.getItem('tema') || 'oscuro'
  )

  // Aplica data-theme al body cada vez que cambia el tema
  useEffect(() => {
    document.body.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  function toggleTema() {
    setTemaState(prev => prev === 'oscuro' ? 'claro' : 'oscuro')
  }

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
