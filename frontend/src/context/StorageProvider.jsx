// src/context/StorageProvider.jsx
import { createContext, useContext, useState, useCallback } from 'react'

export const StorageContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(() =>
    localStorage.getItem('modo') || 'local'
  )
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)

  function setModo(nuevoModo) {
    setModoState(nuevoModo)
    localStorage.setItem('modo', nuevoModo)
  }

  // ── obtenerItems ────────────────────────────────────────────────────────────
  const obtenerItems = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } else {
        const data = localStorage.getItem('items')
        return data ? JSON.parse(data) : []
      }
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setCargando(false)
    }
  }, [modo])

  // ── guardarItem ─────────────────────────────────────────────────────────────
  // Si el item ya tiene id y existe en la lista => PUT, si no => POST (modo api)
  // En local: lee, reemplaza o agrega, guarda
  const guardarItem = useCallback(async (item) => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const esNuevo = !item.id
        const url     = esNuevo ? `${API_URL}/api/items` : `${API_URL}/api/items/${item.id}`
        const metodo  = esNuevo ? 'POST' : 'PUT'
        const res = await fetch(url, {
          method:  metodo,
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(item),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } else {
        const data  = localStorage.getItem('items')
        const lista = data ? JSON.parse(data) : []
        if (!item.id) {
          item.id = crypto.randomUUID()
        }
        const idx   = lista.findIndex(i => i.id === item.id)
        if (idx >= 0) {
          lista[idx] = item
        } else {
          lista.unshift(item)
        }
        localStorage.setItem('items', JSON.stringify(lista))
        return item
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setCargando(false)
    }
  }, [modo])

  // ── eliminarItem ────────────────────────────────────────────────────────────
  const eliminarItem = useCallback(async (id) => {
    setCargando(true)
    setError(null)
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return await res.json()
      } else {
        const data  = localStorage.getItem('items')
        const lista = data ? JSON.parse(data) : []
        const nueva = lista.map(i => i.id === id ? { ...i, activo: false } : i)
        localStorage.setItem('items', JSON.stringify(nueva))
        return { id }
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setCargando(false)
    }
  }, [modo])

  return (
    <StorageContext.Provider value={{
      modo, setModo,
      cargando, error,
      obtenerItems, guardarItem, eliminarItem,
    }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  return useContext(StorageContext)
}
