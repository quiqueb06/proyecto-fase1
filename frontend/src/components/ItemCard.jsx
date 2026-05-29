import { useState, memo } from 'react'
import { getCategoriaById, ESTADOS } from '../utils/categorias'
function claseEstado(estado) {
  if (estado === 'activo')     return 'estado-activo'
  if (estado === 'completado') return 'estado-completado'
  return 'estado-pausa'
}
function ItemCard({ item, onArchivar, onEditar, onCambiarEstado }) {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nombre:          item.nombre,
    notas:           item.notas || '',
    estado:          item.estado,
    duracionMinutos: item.atributos?.duracionMinutos ?? '',
    ejercicios:      item.atributos?.ejercicios || '',
    volumenTotal:    item.atributos?.volumenTotal ?? '',
    puntuacion:      item.puntuacion ?? '',
  })
  const cat = getCategoriaById(item.categoriaId)
  const fecha = new Date(item.fechaRegistro).toLocaleDateString('es', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
  const ejerciciosArr = item.atributos?.ejercicios
    ? item.atributos.ejercicios.split(',').map(e => e.trim()).filter(Boolean)
    : []
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  function handleGuardar() {
    onEditar({
      ...item,
      nombre:         form.nombre.trim(),
      notas:          form.notas.trim(),
      estado:         form.estado,
      puntuacion:     form.puntuacion !== '' ? parseFloat(form.puntuacion) : null,
      fechaActividad: new Date().toISOString(),
      atributos: {
        duracionMinutos: form.duracionMinutos ? parseInt(form.duracionMinutos) : null,
        ejercicios:      form.ejercicios.trim(),
        volumenTotal:    form.volumenTotal ? parseFloat(form.volumenTotal) : null,
      },
    })
    setEditando(false)
  }
  if (editando) {
    return (
      <div className="item-card">
        <div className="form-group">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange}>
            {ESTADOS.map(e => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Duracion (min)</label>
          <input name="duracionMinutos" type="number" min="1" value={form.duracionMinutos} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Intensidad (0-10)</label>
          <input name="puntuacion" type="number" min="0" max="10" step="0.5" value={form.puntuacion} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Ejercicios</label>
          <input name="ejercicios" type="text" value={form.ejercicios} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Volumen (kg)</label>
          <input name="volumenTotal" type="number" min="0" step="0.5" value={form.volumenTotal} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Notas</label>
          <textarea name="notas" value={form.notas} onChange={handleChange} />
        </div>
        <div className="item-card-acciones">
          <button className="btn-accion success" onClick={handleGuardar}>Guardar</button>
          <button className="btn-accion" onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      </div>
    )
  }
  return (
    <div className="item-card">
      <div className="item-card-header">
        <div className="item-card-nombre">{item.nombre}</div>
        <span
          className="badge-categoria"
          style={{ background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}
        >
          {cat.nombre}
        </span>
      </div>
      <div>
        <span className={`badge-estado ${claseEstado(item.estado)}`}>
          {item.estado === 'activo' ? 'Activo'
            : item.estado === 'completado' ? 'Completado'
            : 'En pausa'}
        </span>
      </div>
      <div className="item-card-meta">
        {item.atributos?.duracionMinutos && (
          <span className="meta-item">{item.atributos.duracionMinutos} min</span>
        )}
        {item.puntuacion !== null && item.puntuacion !== undefined && (
          <span className="meta-item">Intensidad: {item.puntuacion}/10</span>
        )}
        {item.atributos?.volumenTotal && (
          <span className="meta-item">{item.atributos.volumenTotal} kg</span>
        )}
        <span className="meta-item">{fecha}</span>
      </div>
      {ejerciciosArr.length > 0 && (
        <div className="item-card-atributos">
          {ejerciciosArr.map((ej, i) => (
            <span key={i} className="atributo-chip">{ej}</span>
          ))}
        </div>
      )}
      {item.notas && (
        <p className="item-card-notas">"{item.notas}"</p>
      )}
      <div className="item-card-acciones">
        <button
          className="btn-accion success"
          onClick={() => onCambiarEstado(item.id, item.estado === 'activo' ? 'completado' : 'activo')}
        >
          {item.estado === 'activo' ? 'Completar' : 'Reactivar'}
        </button>
        <button className="btn-accion" onClick={() => setEditando(true)}>
          Editar
        </button>
        <button className="btn-accion danger" onClick={() => onArchivar(item.id)}>
          Archivar
        </button>
      </div>
    </div>
  )
}
export default memo(ItemCard)
