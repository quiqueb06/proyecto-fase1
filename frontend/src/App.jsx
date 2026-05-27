// src/App.jsx
import { useState, useEffect, useRef } from 'react'
import FormularioItem from './components/FormularioItem'
import ListaItems     from './components/ListaItems'
import { useStorage } from './context/StorageProvider'
import { useTheme }   from './context/ThemeProvider'
import { useUser }    from './context/UserProvider'

export default function App() {
  const { modo, setModo, obtenerItems, guardarItem, eliminarItem, cargando, error } = useStorage()
  const { tema, toggleTema } = useTheme()
  const { nombre } = useUser()

  const [items, setItems] = useState([])

  // ── useRef 1: foco en el input nombre tras agregar un item ─────────────────
  const inputRef = useRef(null)

  // ── useRef 2: guardar ID del setInterval sin provocar re-render ───────────
  const intervalRef = useRef(null)

  // Carga inicial y cuando cambia el modo
  useEffect(() => {
    obtenerItems().then(data => setItems(data))
  }, [obtenerItems])

  // Intervalo de sincronizacion (guarda referencia en intervalRef)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      obtenerItems().then(data => setItems(data))
    }, 30000) // refresca cada 30s
    return () => clearInterval(intervalRef.current)
  }, [obtenerItems])

  // ── Atajos de teclado con cleanup ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Ctrl+B — enfocar input nombre
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // T — cambiar tema (solo si no estamos en un input)
      if (e.key === 't' || e.key === 'T') {
        const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
        if (!enInput) toggleTema()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleTema])

  // ── Handlers CRUD ──────────────────────────────────────────────────────────
  async function handleAgregar(nuevoItem) {
    await guardarItem(nuevoItem)
    const data = await obtenerItems()
    setItems(data)
    // useRef 1: foco al input despues de agregar
    inputRef.current?.focus()
  }

  async function handleArchivar(id) {
    await eliminarItem(id)
    const data = await obtenerItems()
    setItems(data)
  }

  async function handleEditar(itemActualizado) {
    await guardarItem(itemActualizado)
    const data = await obtenerItems()
    setItems(data)
  }

  async function handleCambiarEstado(id, nuevoEstado) {
    const item = items.find(i => i.id === id)
    if (!item) return
    await guardarItem({ ...item, estado: nuevoEstado, fechaActividad: new Date().toISOString() })
    const data = await obtenerItems()
    setItems(data)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mi Entrenamiento</h1>
        <p>{nombre ? `Hola, ${nombre}` : 'Bitacora personal de sesiones de gym'}</p>

        {/* Controles de modo y tema */}
        <div className="controles-bar">
          <button
            className={`btn-control ${modo === 'local' ? 'activo' : ''}`}
            onClick={() => setModo('local')}
          >
            Local
          </button>
          <button
            className={`btn-control ${modo === 'api' ? 'activo' : ''}`}
            onClick={() => setModo('api')}
          >
            API
          </button>
          <button className="btn-control" onClick={toggleTema}>
            Tema: {tema}
          </button>
        </div>
      </header>

      {error && <p className="error-msg">Error: {error}</p>}
      {cargando && <p style={{ textAlign: 'center', color: 'var(--color-texto-suave)', marginBottom: 12 }}>Cargando...</p>}

      <FormularioItem onAgregar={handleAgregar} inputRef={inputRef} />

      <ListaItems
        items={items}
        onArchivar={handleArchivar}
        onEditar={handleEditar}
        onCambiarEstado={handleCambiarEstado}
      />
    </div>
  )
}
