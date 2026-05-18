// src/components/ListaItems.jsx
import ItemCard from './ItemCard'

export default function ListaItems({ items, onArchivar, onEditar, onCambiarEstado }) {
  // Solo items activos (no archivados)
  const visibles = items.filter(i => i.activo)

  return (
    <section>
      <h2 style={{ marginBottom: '16px' }}>Mis sesiones ({visibles.length})</h2>

      {visibles.length === 0 ? (
        <div className="lista-vacia">
          <p style={{ fontSize: '1rem' }}>
            Aún no hay sesiones. ¡Registra tu primer entrenamiento!
          </p>
        </div>
      ) : (
        <div className="items-grid">
          {visibles.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onArchivar={onArchivar}
              onEditar={onEditar}
              onCambiarEstado={onCambiarEstado}
            />
          ))}
        </div>
      )}
    </section>
  )
}
