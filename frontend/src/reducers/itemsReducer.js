export const estadoInicial = {
  lista:           [],
  filtroCategoria: 'todas',
  filtroEstado:    'todos',
  busqueda:        '',
}
export function itemsReducer(estado, accion) {
  switch (accion.type) {
    case 'HIDRATAR':
      return { ...estado, lista: accion.payload }
    case 'AGREGAR':
      return { ...estado, lista: [accion.payload, ...estado.lista] }
    case 'ELIMINAR':
      return {
        ...estado,
        lista: estado.lista.map(i =>
          i.id === accion.payload ? { ...i, activo: false } : i
        ),
      }
    case 'CAMBIAR_ESTADO':
      return {
        ...estado,
        lista: estado.lista.map(i =>
          i.id === accion.payload.id
            ? { ...i, estado: accion.payload.estado, fechaActividad: accion.payload.fechaActividad }
            : i
        ),
      }
    case 'FILTRAR':
      return { ...estado, [accion.payload.campo]: accion.payload.valor }
    case 'LIMPIAR_FILTROS':
      return { ...estado, filtroCategoria: 'todas', filtroEstado: 'todos', busqueda: '' }
    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...estado,
        lista: estado.lista.map(i =>
          i.id === accion.payload.itemId
            ? { ...i, fechaActividad: accion.payload.fechaActividad }
            : i
        ),
      }
    default:
      throw new Error(`Accion desconocida: ${accion.type}`)
  }
}
