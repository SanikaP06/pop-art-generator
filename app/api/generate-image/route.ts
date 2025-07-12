import { type NextRequest, NextResponse } from "next/server"

// Replace with the actual URL of your deployed Cloudflare Worker
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || "YOUR_CLOUDFLARE_WORKER_URL_HERE"

export async function POST(request: NextRequest) {
  console.log("API route /api/generate-image hit!")

  try {
    const { prompt } = await request.json()

    if (!CLOUDFLARE_WORKER_URL || CLOUDFLARE_WORKER_URL === "YOUR_CLOUDFLARE_WORKER_URL_HERE") {
      console.error("CLOUDFLARE_WORKER_URL is not set or is default.")
      return NextResponse.json(
        { error: "CLOUDFLARE_WORKER_URL is not set. Please configure it in your environment variables." },
        { status: 500 },
      )
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Forward the request to your Cloudflare Worker
    const workerResponse = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text()
      console.error(`Cloudflare Worker Error: ${workerResponse.status} - ${errorText}`)
      throw new Error(`Failed to generate image from Cloudflare Worker: ${workerResponse.status} ${errorText}`)
    }

    // The worker returns the image blob directly
    const imageBuffer = await workerResponse.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png", // Assuming PNG from Cloudflare Worker
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in generate-image API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
