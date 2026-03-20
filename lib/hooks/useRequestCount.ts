'use client'

import { useState, useEffect, useCallback } from 'react'

export function useRequestCount(tool: string) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch(`/api/stats?tool=${encodeURIComponent(tool)}`)
      .then(r => r.json())
      .then(d => { if (typeof d.count === 'number') setCount(d.count) })
      .catch(() => {})
  }, [tool])

  const increment = useCallback(async () => {
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool }),
      })
      const data = await res.json()
      if (typeof data.count === 'number') setCount(data.count)
    } catch {
      // silently ignore — stats are non-critical
    }
  }, [tool])

  return { count, increment }
}
