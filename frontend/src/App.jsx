// src/App.jsx
import { useReducer, useMemo, useCallback, useEffect, useRef } from 'react'
import { itemsReducer, estadoInicial } from './reducers/itemsReducer'
import { useStorage } from './context/StorageProvider'
import { useTheme } from './context/ThemeProvider'
import { useUser } from './context/UserProvider'
import FormularioItem from './components/FormularioItem'
import ListaItems from './components/ListaItems'
import Graficas from './components/Graficas'
import { CATEGORIAS, ESTADOS } from './utils/categorias'

export default function App() {
  const { modo, setModo, obtenerItems, guardarItem, eliminarItem, cargando, error } = useStorage()
  const { tema, toggleTema } = useTheme()
  const { nombre } = useUser()

  const [estado, dispatch] = useReducer(itemsReducer, estadoInicial)

  // useRef 1: foco en input nombre tras agregar
  const inputRef = useRef(null)
  // useRef 2: ID del setInterval sin provocar re-render
  const intervalRef = useRef(null)

  // Carga inicial
  useEffect(() => {
    obtenerItems().then(data => {
      dispatch({ type: 'HIDRATAR', payload: data })
    })
  }, [obtenerItems])

  // Refresco periodico sin re-render del intervalo
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      obtenerItems().then(data => {
        dispatch({ type: 'HIDRATAR', payload: data })
      })
    }, 30000)
    return () => clearInterval(intervalRef.current)
  }, [obtenerItems])

  // Atajos de teclado con cleanup
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if ((e.key === 't' || e.key === 'T') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        toggleTema()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleTema])

  // useMemo: lista filtrada
  const itemsVisibles = useMemo(() => {
    let res = estado.lista.filter(i => i.activo)
    if (estado.busqueda)
      res = res.filter(i => i.nombre.toLowerCase().includes(estado.busqueda.toLowerCase()))
    if (estado.filtroCategoria !== 'todas')
      res = res.filter(i => i.categoriaId === estado.filtroCategoria)
    if (estado.filtroEstado !== 'todos')
      res = res.filter(i => i.estado === estado.filtroEstado)
    return res
  }, [estado.lista, estado.busqueda, estado.filtroCategoria, estado.filtroEstado])

  // useMemo: datos para graficas (reaccionan a filtros)
  const itemsParaGraficas = useMemo(() => itemsVisibles, [itemsVisibles])

  // useCallback: handlers para componentes hijos
  const handleAgregar = useCallback(async (nuevoItem) => {
    const itemGuardado = await guardarItem(nuevoItem)
    if (itemGuardado) {
      dispatch({ type: 'AGREGAR', payload: itemGuardado })
    }
    inputRef.current?.focus()
  }, [guardarItem])

  const handleArchivar = useCallback(async (id) => {
    dispatch({ type: 'ELIMINAR', payload: id })
    await eliminarItem(id)
  }, [eliminarItem])

  const handleEditar = useCallback(async (itemActualizado) => {
    dispatch({
      type: 'CAMBIAR_ESTADO', payload: {
        id: itemActualizado.id,
        estado: itemActualizado.estado,
        fechaActividad: itemActualizado.fechaActividad,
      }
    })
    await guardarItem(itemActualizado)
    obtenerItems().then(data => dispatch({ type: 'HIDRATAR', payload: data }))
  }, [guardarItem, obtenerItems])

  const handleCambiarEstado = useCallback(async (id, nuevoEstado) => {
    const fechaActividad = new Date().toISOString()
    dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: nuevoEstado, fechaActividad } })
    const item = estado.lista.find(i => i.id === id)
    if (item) await guardarItem({ ...item, estado: nuevoEstado, fechaActividad })
  }, [estado.lista, guardarItem])

  const handleFiltrar = useCallback((campo, valor) => {
    dispatch({ type: 'FILTRAR', payload: { campo, valor } })
  }, [])

  const handleLimpiarFiltros = useCallback(() => {
    dispatch({ type: 'LIMPIAR_FILTROS' })
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mi Entrenamiento</h1>
        <p>{nombre ? `Hola, ${nombre}` : 'Bitacora personal de sesiones de gym'}</p>
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

      <div className="filtros-bar">
        <input
          type="text"
          placeholder="Buscar sesion..."
          value={estado.busqueda}
          onChange={e => handleFiltrar('busqueda', e.target.value)}
        />
        <select
          value={estado.filtroCategoria}
          onChange={e => handleFiltrar('filtroCategoria', e.target.value)}
        >
          <option value="todas">Todas las categorias</option>
          {CATEGORIAS.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select
          value={estado.filtroEstado}
          onChange={e => handleFiltrar('filtroEstado', e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
        <button className="btn-control" onClick={handleLimpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      <ListaItems
        items={itemsVisibles}
        onArchivar={handleArchivar}
        onEditar={handleEditar}
        onCambiarEstado={handleCambiarEstado}
      />

      <Graficas items={itemsParaGraficas} />
    </div>
  )
}