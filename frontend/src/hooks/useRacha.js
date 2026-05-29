// src/hooks/useRacha.js
import { useMemo } from 'react'

/**
 * Hook de dominio: calcula la racha actual de dias consecutivos entrenados.
 * @param {Array} items - Lista de items activos del reducer
 * @returns {{ rachaActual: number, rachaMasLarga: number }}
 */
export function useRacha(items) {
  const { rachaActual, rachaMasLarga } = useMemo(() => {
    if (!items || items.length === 0) {
      return { rachaActual: 0, rachaMasLarga: 0 }
    }

    // Obtener fechas unicas de actividad (solo la parte de fecha, sin hora)
    const fechas = [...new Set(
      items
        .filter(i => i.activo && i.fechaActividad)
        .map(i => i.fechaActividad.split('T')[0])
    )].sort((a, b) => new Date(b) - new Date(a)) // mas reciente primero

    if (fechas.length === 0) return { rachaActual: 0, rachaMasLarga: 0 }

    const hoy    = new Date().toISOString().split('T')[0]
    const ayer   = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const inicio = fechas[0] === hoy || fechas[0] === ayer ? fechas[0] : null

    // Racha actual: dias consecutivos desde hoy o ayer hacia atras
    let rachaActual = 0
    if (inicio) {
      let diaAnterior = new Date(inicio)
      for (const fecha of fechas) {
        const diff = Math.round((diaAnterior - new Date(fecha)) / 86400000)
        if (diff === 0 || diff === 1) {
          rachaActual++
          diaAnterior = new Date(fecha)
        } else {
          break
        }
      }
    }

    // Racha mas larga: recorre todas las fechas ordenadas
    const fechasAsc = [...fechas].sort((a, b) => new Date(a) - new Date(b))
    let rachaMasLarga = 1
    let rachaTemp     = 1
    for (let i = 1; i < fechasAsc.length; i++) {
      const diff = Math.round(
        (new Date(fechasAsc[i]) - new Date(fechasAsc[i - 1])) / 86400000
      )
      if (diff === 1) {
        rachaTemp++
        if (rachaTemp > rachaMasLarga) rachaMasLarga = rachaTemp
      } else {
        rachaTemp = 1
      }
    }

    return { rachaActual, rachaMasLarga }
  }, [items])

  return { rachaActual, rachaMasLarga }
}
