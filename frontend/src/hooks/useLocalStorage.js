// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

/**
 * Hook para sincronizar estado con localStorage.
 * @param {string} clave - Clave en localStorage
 * @param {*} valorInicial - Valor inicial si no existe la clave
 * @returns {[*, Function]} Par [valor, setValor]
 */
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave)
      return guardado !== null ? JSON.parse(guardado) : valorInicial
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch (e) {
      console.warn(`useLocalStorage: no guardado "${clave}"`, e)
    }
  }, [clave, valor])

  return [valor, setValor]
}
