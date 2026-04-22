"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { STLViewer } from "./stl-viewer"
import { Trash2, Eye, EyeOff, Minus, Plus } from "lucide-react"
import { updateQuantity } from "@/lib/virtual-server"

export interface CartItemData {
  id: string
  file: File
  color: string
  quantity: number
}

interface CartItemProps {
  item: CartItemData
  onUpdate: (id: string, updates: Partial<CartItemData>) => void
  onRemove: (id: string) => void
}

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#1a1a1a" },
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Yellow", value: "#eab308" },
  { name: "Orange", value: "#f97316" },
  { name: "Gray", value: "#6b7280" },
]

export function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  const [showViewer, setShowViewer] = useState(true)

  async function handleIncrementQuantity() {
    const serverQty = await updateQuantity(item.id, item.quantity + 1)
    onUpdate(item.id, { quantity: serverQty })
  }

  async function handleDecrementQuantity() {
    const serverQty = await updateQuantity(item.id, Math.max(1, item.quantity - 1))
    onUpdate(item.id, { quantity: serverQty })
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(item.file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowViewer(!showViewer)}
            >
              {showViewer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showViewer && (
          <div className="w-full h-64 rounded-lg overflow-hidden border">
            <STLViewer file={item.file} color={item.color} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Color:</span>
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${item.color === c.value
                    ? "border-foreground scale-110"
                    : "border-muted hover:border-muted-foreground"
                    }`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => onUpdate(item.id, { color: c.value })}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrementQuantity}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium tabular-nums">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrementQuantity}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
