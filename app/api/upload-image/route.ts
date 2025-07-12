import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob" // Import Vercel Blob SDK
import { v4 as uuidv4 } from "uuid" // For unique filenames

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API: Request received for Vercel Blob.")
    const { imageData, prompt } = await request.json()
    console.log("Upload API: Image data and prompt parsed.")

    if (!imageData) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 })
    }

    // Decode base64 image data
    console.log("Upload API: Decoding base64 image data.")
    const imageBuffer = Buffer.from(imageData, "base64")
    console.log("Upload API: Image buffer created.")

    // Determine content type (assuming JPEG from previous steps, but could be dynamic)
    const contentType = "image/jpeg" // Or infer from imageData prefix if needed

    // Create a unique filename
    const filename = `pop-art-images/${uuidv4()}-${Date.now()}.jpeg`

    // Upload the image buffer to Vercel Blob
    console.log("Upload API: Attempting to upload file to Vercel Blob.")
    const blob = await put(filename, imageBuffer, {
      access: "public", // Make the file publicly accessible
      contentType: contentType,
      addRandomSuffix: false, // We're already adding a unique ID
    })
    console.log("Upload API: File uploaded to Vercel Blob.", blob.url)

    return NextResponse.json({ imageUrl: blob.url }, { status: 200 })
  } catch (error) {
    console.error("Error in upload-image API route (Vercel Blob):", error)
    return NextResponse.json({ error: "Failed to upload image to Vercel Blob" }, { status: 500 })
  }
}
