import ItemCard from './ItemCard'
export default function ListaItems({ items, onArchivar, onEditar, onCambiarEstado }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ marginBottom: 16, fontSize: '1.1rem' }}>Mis sesiones ({items.length})</h2>
      {items.length === 0 ? (
        <div className="lista-vacia">
          <p>No hay sesiones que mostrar.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map(item => (
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
