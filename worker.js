// worker.js

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 })
    }

    try {
      const { prompt } = await request.json()

      if (!prompt) {
        return new Response("Prompt is required", { status: 400 })
      }

      // Initialize the AI client
      const ai = env.AI // 'AI' is the binding name for the AI service

      // Generate image using stability-ai/stable-diffusion-xl-lightning
      const inputs = {
        prompt: `${prompt}, pop art style, vibrant colors, comic book style, halftone dots, bold outlines`,
        negative_prompt: "blurry, low quality, distorted, ugly, text, watermark",
        // You can add more parameters like width, height, steps, seed if needed
      }

      const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-lightning", inputs)

      // Cloudflare AI returns an ArrayBuffer for images
      return new Response(response, {
        headers: {
          "Content-Type": "image/png", // Stable Diffusion often outputs PNG
          "Cache-Control": "no-cache",
        },
      })
    } catch (error) {
      console.error("Error in Cloudflare Worker:", error)
      return new Response(`Internal Server Error: ${error.message}`, { status: 500 })
    }
  },
}
