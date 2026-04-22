"use client"

import { useEffect, useState } from "react"

interface Ripple {
  id: number
  x: number
  y: number
}

const RIPPLE_DURATION_MS = 600

export function ClickIndicator() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    let nextId = 0
    function handleClick(e: MouseEvent) {
      const id = nextId++
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, RIPPLE_DURATION_MS)
    }
    window.addEventListener("click", handleClick, true)
    return () => window.removeEventListener("click", handleClick, true)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="click-ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  )
}
