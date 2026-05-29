import { createContext, useContext, useState, useEffect } from 'react'
export const ThemeContext = createContext(null)
export function ThemeProvider({ children }) {
  const [tema, setTemaState] = useState(() =>
    localStorage.getItem('tema') || 'oscuro'
  )
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
