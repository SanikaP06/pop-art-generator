import type React from "react"
import type { Metadata } from "next"
import { Bangers } from "next/font/google" // Only import Bangers

const bangers = Bangers({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bangers",
})

export const metadata: Metadata = {
  title: "Pop Art Generator - Create Vibrant AI Art",
  description:
    "Transform your ideas into stunning Pop Art masterpieces using AI. Create, save, and download your unique Pop Art images.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head></head>
      {/* Apply Bangers as the primary font throughout the body */}
      <body className={`${bangers.variable} font-bangers`}>{children}</body>
    </html>
  )
}


import './globals.css'