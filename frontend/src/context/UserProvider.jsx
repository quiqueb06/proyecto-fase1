import { createContext, useContext, useState } from 'react'
export const UserContext = createContext(null)
export function UserProvider({ children }) {
  const [nombre, setNombre] = useState(() =>
    localStorage.getItem('user_nombre') || ''
  )
  const [preferencias, setPreferencias] = useState(() => {
    try {
      const data = localStorage.getItem('user_preferencias')
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  })
  function actualizarNombre(nuevoNombre) {
    setNombre(nuevoNombre)
    localStorage.setItem('user_nombre', nuevoNombre)
  }
  function actualizarPreferencias(nuevasPrefs) {
    const merged = { ...preferencias, ...nuevasPrefs }
    setPreferencias(merged)
    localStorage.setItem('user_preferencias', JSON.stringify(merged))
  }
  return (
    <UserContext.Provider value={{
      nombre, preferencias,
      actualizarNombre, actualizarPreferencias,
    }}>
      {children}
    </UserContext.Provider>
  )
}
export function useUser() {
  return useContext(UserContext)
}
