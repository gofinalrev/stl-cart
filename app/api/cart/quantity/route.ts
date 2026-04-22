import { NextResponse } from "next/server"

const MIN_LATENCY_MS = 200
const MAX_LATENCY_MS = 1500

function randomLatency() {
  return MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    id?: unknown
    quantity?: unknown
  }

  if (typeof body.id !== "string" || typeof body.quantity !== "number") {
    return NextResponse.json({ error: "Invalid cart quantity request" }, { status: 400 })
  }

  await new Promise((resolve) => setTimeout(resolve, randomLatency()))

  return NextResponse.json({
    quantity: Math.max(1, Math.floor(body.quantity)),
  })
}
