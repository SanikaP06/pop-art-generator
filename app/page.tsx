"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Download, Trash2 } from "lucide-react"
import Image from "next/image"
import { ImagePreviewModal } from "@/components/image-preview-modal"

interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string
  timestamp: number
}

export default function PopArtGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [hasClickedGenerateOnce, setHasClickedGenerateOnce] = useState(false)
  const [selectedImageForModal, setSelectedImageForModal] = useState<GeneratedImage | null>(null)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("popArtHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save to localStorage whenever history changes
  const saveToHistory = (newImage: GeneratedImage) => {
    const updatedHistory = [newImage, ...history].slice(0, 20)
    setHistory(updatedHistory)
    localStorage.setItem("popArtHistory", JSON.stringify(updatedHistory))
  }

  // Generate Pop Art image
  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setHasClickedGenerateOnce(true)
    try {
      // Step 1: Generate image from Cloudflare Worker
      const generateResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt, // The full prompt with style is handled by the Worker
        }),
      })

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text()
        console.error(`API Error: ${generateResponse.status} - ${errorText}`)
        throw new Error(`Failed to generate image: ${generateResponse.status} ${errorText}`)
      }

      const imageBlob = await generateResponse.blob()

      // Step 2: Convert blob to base64 for upload
      const reader = new FileReader()
      reader.readAsDataURL(imageBlob)

      await new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          const base64data = reader.result?.toString().split(",")[1] // Get base64 string without data:image/jpeg;base64, prefix

          if (!base64data) {
            reject(new Error("Failed to convert image to base64."))
            return
          }

          // Step 3: Upload image to Firebase Storage
          const uploadResponse = await fetch("/api/upload-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageData: base64data,
              prompt: prompt,
            }),
          })

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            console.error(`Upload API Error: ${uploadResponse.status} - ${errorText}`)
            reject(new Error(`Failed to upload image: ${uploadResponse.status} ${errorText}`))
            return
          }

          const { imageUrl } = await uploadResponse.json()

          const newImage: GeneratedImage = {
            id: Date.now().toString(),
            prompt,
            imageUrl, // This is now the Firebase Storage URL
            timestamp: Date.now(),
          }

          setCurrentImage(newImage)
          saveToHistory(newImage)
          setPrompt("")
          resolve()
        }
        reader.onerror = reject
      })
    } catch (error) {
      console.error("Error generating or uploading image:", error)
      alert("Failed to generate or upload image. Please try again!")
    } finally {
      setIsGenerating(false)
    }
  }

  // Download image
  const downloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `pop-art-${prompt.slice(0, 20).replace(/\s+/g, "-")}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("popArtHistory")
  }

  // Open modal with selected image
  const openImageModal = (image: GeneratedImage) => {
    setSelectedImageForModal(image)
  }

  // Close modal
  const closeImageModal = () => {
    setSelectedImageForModal(null)
  }

  const examplePrompts = [
    "a funky pop art of a cat wearing sunglasses",
    "vibrant comic book scene with a superhero toast",
    "pop art banana with comic book halftone style",
    "retro pop art robot dancing disco",
    "comic book style pizza slice with superpowers",
  ]

  return (
    <div className="min-h-screen bg-black text-white font-bangers">
      <main className="flex flex-col items-center justify-start min-h-screen px-4 py-12">
        {/* Main Card with "pop out" effect and increased width */}
        <Card className="bg-gray-900 rounded-3xl shadow-2xl shadow-pink-500/20 p-0 md:p-0 w-full max-w-7xl mx-auto mb-12 relative overflow-hidden flex flex-col items-center justify-center flex-grow border-none">
          {/* Subtle gradient background for the "pop out" effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 via-transparent to-gray-800/50 rounded-3xl z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/10 via-transparent to-cyan-500/10 rounded-3xl z-0"></div>{" "}
          {/* Adjusted radial gradient for a softer glow, less like a border */}
          <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent rounded-3xl z-0"></div>{" "}
          <CardContent className="flex flex-col items-center justify-center p-8 md:p-12 relative z-10 w-full">
            {/* Original text-based logo */}
            <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 bg-clip-text mb-2">
              popART
            </h1>
            <p className="text-3xl md:text-4xl text-pink-400 mb-8">POP ART GENERATOR</p>
            {!hasClickedGenerateOnce ? (
              // Initial view: Prominent Generate button
              <Button
                onClick={() => setHasClickedGenerateOnce(true)}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-12 py-6 rounded-3xl text-3xl shadow-lg shadow-yellow-400/50 transition-all duration-300 transform hover:scale-105"
              >
                GENERATE!
              </Button>
            ) : (
              // View after clicking Generate: Input field and suggestions
              <div className="w-full flex flex-col items-center">
                <div className="flex flex-col sm:flex-row gap-4 w-full mb-4">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="TYPE YOUR PROMPT HERE..."
                    className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-lg p-4 rounded-xl focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-colors"
                    onKeyPress={(e) => e.key === "Enter" && !isGenerating && generateImage()}
                  />
                  <Button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-xl text-lg shadow-md shadow-yellow-400/30 transition-all duration-300 transform hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        CREATING...
                      </>
                    ) : (
                      <>GENERATE!</>
                    )}
                  </Button>
                </div>

                {/* Example Prompts */}
                <div className="text-center w-full">
                  <p className="text-cyan-300 mb-3 text-lg">💡 TRY THESE AWESOME PROMPTS:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(example)}
                        className="bg-gray-700 hover:bg-gray-600 text-pink-400 px-3 py-1 rounded-full text-sm transition-colors border border-gray-600"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Generated Image (if any) */}
        {currentImage && (
          <div className="max-w-2xl mx-auto my-8 w-full">
            <Card className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl shadow-pink-400/10">
              <CardContent className="p-6">
                <div className="relative group">
                  <Image
                    src={currentImage.imageUrl || "/placeholder.svg"}
                    alt={currentImage.prompt}
                    width={600}
                    height={600}
                    className="w-full h-auto rounded-xl shadow-lg cursor-pointer"
                    onClick={() => openImageModal(currentImage)}
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => downloadImage(currentImage.imageUrl, currentImage.prompt)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black p-2 rounded-full shadow-lg"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-yellow-300 mt-4 text-center font-semibold">"{currentImage.prompt}"</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pop Art Collection History - Always visible, no separate heading */}
        {history.length > 0 && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-end items-center mb-6">
              <Button onClick={clearHistory} className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl">
                <Trash2 className="mr-2 h-4 w-4" />
                CLEAR ALL
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((image) => (
                <Card
                  key={image.id}
                  className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl shadow-cyan-400/10 hover:shadow-cyan-400/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => openImageModal(image)}
                >
                  <CardContent className="p-4">
                    <div className="relative group">
                      <Image
                        src={image.imageUrl || "/placeholder.svg"}
                        alt={image.prompt}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadImage(image.imageUrl, image.prompt)
                          }}
                          className="bg-yellow-400 hover:bg-yellow-300 text-black p-2 rounded-full shadow-lg"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-pink-400 mt-3 text-sm font-medium line-clamp-2">"{image.prompt}"</p>
                    <p className="text-gray-500 text-xs mt-2">{new Date(image.timestamp).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Image Preview Modal */}
      {selectedImageForModal && (
        <ImagePreviewModal image={selectedImageForModal} onClose={closeImageModal} onDownload={downloadImage} />
      )}
    </div>
  )
}
