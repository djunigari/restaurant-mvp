import { useEffect, useState } from "react"

/**
 * Retorna o valor com atraso (debounce) após determinado tempo.
 * Útil para evitar chamadas excessivas (ex: em buscas).
 *
 * @param value Valor original a ser "atrasado"
 * @param delay Delay em milissegundos
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
