import { useState } from 'react'
import { CATEGORIAS, ESTADOS } from '../utils/categorias'
const FORM_INICIAL = {
  nombre:          '',
  categoriaId:     'fuerza',
  estado:          'activo',
  puntuacion:      '',
  notas:           '',
  duracionMinutos: '',
  ejercicios:      '',
  volumenTotal:    '',
}
export default function FormularioItem({ onAgregar, inputRef }) {
  const [form, setForm] = useState(FORM_INICIAL)
  const [error, setError] = useState('')
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim() || form.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }
    const nuevo = {
      nombre:         form.nombre.trim(),
      categoriaId:    form.categoriaId,
      estado:         form.estado,
      puntuacion:     form.puntuacion !== '' ? parseFloat(form.puntuacion) : null,
      fechaRegistro:  new Date().toISOString(),
      fechaActividad: new Date().toISOString(),
      notas:          form.notas.trim(),
      atributos: {
        duracionMinutos: form.duracionMinutos ? parseInt(form.duracionMinutos) : null,
        ejercicios:      form.ejercicios.trim() || '',
        volumenTotal:    form.volumenTotal ? parseFloat(form.volumenTotal) : null,
      },
      activo: true,
    }
    onAgregar(nuevo)
    setForm(FORM_INICIAL)
  }
  return (
    <div className="formulario-card">
      <h2>Registrar sesion</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group full-width">
            <label htmlFor="nombre">Nombre de la sesion *</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej: Dia de pecho y triceps"
              value={form.nombre}
              onChange={handleChange}
              ref={inputRef}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoriaId">Tipo de entrenamiento</label>
            <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange}>
              {CATEGORIAS.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
              {ESTADOS.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="duracionMinutos">Duracion (minutos)</label>
            <input
              id="duracionMinutos"
              name="duracionMinutos"
              type="number"
              min="1"
              max="300"
              placeholder="Ej: 60"
              value={form.duracionMinutos}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="puntuacion">Intensidad (0-10)</label>
            <input
              id="puntuacion"
              name="puntuacion"
              type="number"
              min="0"
              max="10"
              step="0.5"
              placeholder="Ej: 8"
              value={form.puntuacion}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="ejercicios">Ejercicios (separados por coma)</label>
            <input
              id="ejercicios"
              name="ejercicios"
              type="text"
              placeholder="Ej: Press banca, Fondos, Triceps polea"
              value={form.ejercicios}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="volumenTotal">Volumen total (kg)</label>
            <input
              id="volumenTotal"
              name="volumenTotal"
              type="number"
              min="0"
              step="0.5"
              placeholder="Ej: 4500"
              value={form.volumenTotal}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notas">Notas</label>
            <textarea
              id="notas"
              name="notas"
              placeholder="Observaciones..."
              value={form.notas}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-submit">
            Guardar sesion
          </button>
        </div>
      </form>
    </div>
  )
}
