export const CATEGORIAS = [
  { id: 'fuerza',       nombre: 'Fuerza',       emoji: '💪', color: '#e63946' },
  { id: 'cardio',       nombre: 'Cardio',        emoji: '🏃', color: '#3498db' },
  { id: 'flexibilidad', nombre: 'Flexibilidad',  emoji: '🧘', color: '#2ecc71' },
  { id: 'deportes',     nombre: 'Deportes',      emoji: '⚽', color: '#f39c12' },
  { id: 'hiit',         nombre: 'HIIT',          emoji: '🔥', color: '#9b59b6' },
]
export const ESTADOS = [
  { id: 'activo',     nombre: 'Activo' },
  { id: 'completado', nombre: 'Completado' },
  { id: 'pausa',      nombre: 'En pausa' },
]
export function getCategoriaById(id) {
  return CATEGORIAS.find(c => c.id === id) || { emoji: '', nombre: id, color: '#888' }
}
