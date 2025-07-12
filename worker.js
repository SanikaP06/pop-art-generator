// worker.js
// No import needed for CloudflareWorkersAI, it's available via env.AI binding

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

      // Initialize the AI client directly from the env.AI binding
      const ai = env.AI // 'AI' is the binding name for the AI service

      // Generate a random seed for varied outputs
      const randomSeed = Math.floor(Math.random() * 1000000000) // A large random number

      // Generate image using stability-ai/stable-diffusion-xl-base-1.0
      const inputs = {
        prompt: `${prompt}, pop art style, vibrant colors, comic book style, halftone dots, bold outlines`,
        negative_prompt:
          "blurry, low quality, distorted, ugly, text, watermark, extra limbs, missing limbs, deformed, disfigured, bad anatomy, malformed, fused fingers, too many fingers, too many hands, extra fingers, extra hands, mutated, low resolution, bad composition, bad lighting", // Added more negative prompts
        seed: randomSeed, // Add the random seed here
        // You can add more parameters like width, height, steps if needed
      }

      const response = await ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", inputs)

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
