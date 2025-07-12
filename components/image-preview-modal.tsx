"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2, X } from "lucide-react"
import Image from "next/image"

interface ImagePreviewModalProps {
  image: {
    imageUrl: string
    prompt: string
  }
  onClose: () => void
  onDownload: (imageUrl: string, prompt: string) => void
}

export function ImagePreviewModal({ image, onClose, onDownload }: ImagePreviewModalProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // This fetch should now work as image.imageUrl is a public Firebase URL
        const response = await fetch(image.imageUrl)
        const blob = await response.blob()
        const file = new File([blob], `pop-art-${image.prompt.slice(0, 20).replace(/\s+/g, "-")}.jpg`, {
          type: blob.type,
        })

        await navigator.share({
          files: [file],
          title: "My Pop Art Creation!",
          text: `Check out my new Pop Art generated with the Pop Art Generator: "${image.prompt}"`,
        })
        console.log("Image shared successfully")
      } catch (error) {
        console.error("Error sharing image:", error)
        alert("Failed to share image. Please try again or download it!")
      }
    } else {
      alert("Web Share API is not supported in your browser. Please download the image instead.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-bangers">
      <Card className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-pink-400/20 w-full max-w-3xl mx-auto">
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-400 text-white p-2 rounded-full z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative w-full h-[400px] md:h-[500px] bg-gray-800 rounded-xl overflow-hidden mb-6">
            <Image
              src={image.imageUrl || "/placeholder.svg"}
              alt={image.prompt}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-xl"
              priority
            />
          </div>
          <p className="text-yellow-300 text-lg text-center font-semibold mb-6">"{image.prompt}"</p>
          <div className="flex gap-4">
            <Button
              onClick={() => onDownload(image.imageUrl, image.prompt)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl text-lg shadow-md shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105"
            >
              <Download className="mr-2 h-5 w-5" />
              DOWNLOAD
            </Button>
            <Button
              onClick={handleShare}
              className="bg-pink-500 hover:bg-pink-400 text-white font-bold px-6 py-3 rounded-xl text-lg shadow-md shadow-pink-500/30 transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="mr-2 h-5 w-5" />
              SHARE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
