// src/hooks/useAtajoTeclado.js
import { useEffect } from 'react'

/**
 * Hook para registrar atajos de teclado con cleanup automatico.
 * @param {string} tecla - Tecla a escuchar (ej: 't', 'b')
 * @param {Function} onPress - Callback al presionar la tecla
 * @param {{ ctrl?: boolean }} opciones - Si ctrl=true requiere Ctrl+tecla
 */
export function useAtajoTeclado(tecla, onPress, { ctrl = false } = {}) {
  useEffect(() => {
    const handler = (e) => {
      const enInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
      if (enInput) return
      if (ctrl && !e.ctrlKey) return
      if (e.key.toLowerCase() !== tecla.toLowerCase()) return
      e.preventDefault()
      onPress(e)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [tecla, onPress, ctrl])
}
