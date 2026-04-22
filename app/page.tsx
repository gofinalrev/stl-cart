"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CartItem, CartItemData } from "@/components/cart-item"
import { Upload, ShoppingCart } from "lucide-react"

const funMessages = [
  "Firing up the printers... just kidding, this is a demo!",
  "Calculating plastic... beep boop... ERROR: Too much fun detected!",
  "Your STLs have been sent to the 3D printing dimension!",
  "Plot twist: The checkout button was inside you all along.",
  "Achievement unlocked: Cart Clicker!",
]

export default function Home() {
  const [items, setItems] = useState<CartItemData[]>([])
  const [easterEgg, setEasterEgg] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  function processFiles(files: FileList | null) {
    if (!files) return

    const newItems: CartItemData[] = Array.from(files)
      .filter((file) => file.name.toLowerCase().endsWith(".stl"))
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        color: "#6b7280",
        quantity: 1,
      }))

    setItems((prev) => [...prev, ...newItems])
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    processFiles(e.target.files)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleUpdate(id: string, updates: Partial<CartItemData>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    const message = funMessages[Math.floor(Math.random() * funMessages.length)]
    setEasterEgg(message)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setEasterEgg(null), 3000)
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">STL Print Cart</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingCart className="h-5 w-5" />
            <span>{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
          </div>
        </div>

        <Card
          className={`border-2 border-dashed transition-colors ${isDragging ? "bg-muted border-muted-foreground" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label className="flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <span className="font-medium">Upload STL Files</span>
            <span className="text-sm text-muted-foreground">
              Click or drag files here
            </span>
            <input
              type="file"
              accept=".stl"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </Card>

        {items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Checkout ({totalItems} item{totalItems !== 1 ? "s" : ""})
            </Button>

            {easterEgg && (
              <div className="text-center p-4 bg-primary/10 rounded-lg animate-pulse">
                <p className="font-medium text-primary">{easterEgg}</p>
              </div>
            )}
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center text-muted-foreground py-8 space-y-2">
            <p>Your cart is empty. Upload some STL files to get started.</p>
            <p className="text-sm">
              Don&apos;t have a file?{" "}
              <a
                href="/benchy.stl"
                download="benchy.stl"
                className="text-primary underline hover:no-underline"
              >
                Download a sample Benchy
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
