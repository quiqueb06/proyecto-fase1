// src/utils/categorias.js
export const CATEGORIAS = [
  { id: 'fuerza',        nombre: 'Fuerza',        color: '#e63946' },
  { id: 'cardio',        nombre: 'Cardio',        color: '#3498db' },
  { id: 'flexibilidad',  nombre: 'Flexibilidad',  color: '#2ecc71' },
  { id: 'deportes',      nombre: 'Deportes',      color: '#f39c12' },
  { id: 'hiit',          nombre: 'HIIT',          color: '#9b59b6' },
]

export const ESTADOS = [
  { id: 'activo',     nombre: 'Activo',     color: '#2ecc71' },
  { id: 'completado', nombre: 'Completado', color: '#3498db' },
  { id: 'pausa',      nombre: 'En pausa',   color: '#f39c12' },
]

export function getCategoriaById(id) {
  return CATEGORIAS.find(c => c.id === id) || { nombre: id, color: '#888' }
}

export function getEstadoById(id) {
  return ESTADOS.find(e => e.id === id) || { nombre: id, color: '#888' }
}
