export async function updateQuantity(id: string, quantity: number): Promise<number> {
  const response = await fetch("/api/cart/quantity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, quantity }),
  })

  if (!response.ok) {
    throw new Error("Failed to update quantity")
  }

  const data = (await response.json()) as { quantity: number }
  return data.quantity
}
