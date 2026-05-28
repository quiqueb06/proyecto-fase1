// src/hooks/useFetch.js
import { useState, useEffect } from 'react'

/**
 * Hook para fetch con manejo de estados y cancelacion con AbortController.
 * @param {string|null} url - URL a fetchear. Si es null no hace nada.
 * @returns {{ data: *, cargando: boolean, error: string|null }}
 */
export function useFetch(url) {
  const [data,     setData]     = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!url) {
      setCargando(false)
      return
    }

    const controller = new AbortController()

    ;(async () => {
      try {
        setCargando(true)
        setError(null)
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setData(await res.json())
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setCargando(false)
      }
    })()

    return () => controller.abort()
  }, [url])

  return { data, cargando, error }
}
