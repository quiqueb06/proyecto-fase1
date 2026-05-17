// src/App.jsx
import { useState, useEffect } from 'react'
import FormularioItem from './components/FormularioItem'
import ListaItems     from './components/ListaItems'

export default function App() {
  // useState con lazy initializer — solo se ejecuta una vez al montar
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('items')
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  // useEffect: sincroniza items → LocalStorage en cada cambio
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  function handleAgregar(nuevoItem) {
    setItems(prev => [nuevoItem, ...prev])
  }

  function handleArchivar(id) {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, activo: false } : i)
    )
  }

  function handleEditar(itemActualizado) {
    setItems(prev =>
      prev.map(i => i.id === itemActualizado.id ? itemActualizado : i)
    )
  }

  function handleCambiarEstado(id, nuevoEstado) {
    setItems(prev =>
      prev.map(i => i.id === id
        ? { ...i, estado: nuevoEstado, fechaActividad: new Date().toISOString() }
        : i
      )
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mi Entrenamiento</h1>
        <p>Bitácora personal de sesiones de gym</p>
      </header>

      <FormularioItem onAgregar={handleAgregar} />

      <ListaItems
        items={items}
        onArchivar={handleArchivar}
        onEditar={handleEditar}
        onCambiarEstado={handleCambiarEstado}
      />
    </div>
  )
}
