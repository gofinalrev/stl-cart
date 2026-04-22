const MIN_LATENCY_MS = 200
const MAX_LATENCY_MS = 1500

function randomLatency() {
  return MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)
}

export async function updateQuantity(id: string, quantity: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, randomLatency()))
  return quantity
}
