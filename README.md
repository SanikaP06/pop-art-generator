# Pop Art Generator

## 🎨 Transform Your Ideas into Vibrant Pop Art!

The Pop Art Generator is a web application that leverages AI to convert your text prompts into stunning, comic-book-style Pop Art images. Generate unique artworks, preview them in a pop-out modal, download them, and share your creations with ease.

---

## ✨ Features

*   **AI-Powered Image Generation:** Transform text prompts into unique Pop Art images using a Cloudflare Workers AI model.
*   **Vibrant Pop Art Style:** Images are automatically styled with vibrant colors, halftone dots, and bold outlines.
*   **Interactive UI:** A clean, responsive interface with a prominent "Generate" button and example prompts.
*   **Image History:** Automatically saves your generated images to local storage for easy access to past creations.
*   **Image Preview Modal:** Click on any generated image to open a full-screen preview with download and share options.
*   **Direct Download:** Download your high-quality Pop Art images directly to your device.
*   **Web Share Integration:** Share your creations directly from the browser on supported platforms.
*   **Robust Error Handling:** Provides user feedback for generation and upload failures.

---

## 🚀 Technologies Used

This project is built with a modern full-stack JavaScript ecosystem:

*   **Frontend:**
    *   [**Next.js (App Router)**](https://nextjs.org/): React framework for building the web application.
    *   [**React**](https://react.dev/): JavaScript library for building user interfaces.
    *   [**TypeScript**](https://www.typescriptlang.org/): Statically typed superset of JavaScript.
    *   [**Tailwind CSS**](https://tailwindcss.com/): Utility-first CSS framework for styling.
    *   [**shadcn/ui**](https://ui.shadcn.com/): Re-usable UI components built with Radix UI and Tailwind CSS.
    *   [**Lucide React**](https://lucide.dev/): Open-source icon library.
    *   [**Google Fonts (Bangers)**](https://fonts.google.com/specimen/Bangers): Custom font for the Pop Art aesthetic.
*   **Backend / AI Inference:**
    *   [**Cloudflare Workers AI**](https://developers.cloudflare.com/workers-ai/): Serverless platform for running AI models at the edge.
    *   `@cf/stabilityai/stable-diffusion-xl-base-1.0`: The specific AI model used for image generation.
*   **Image Storage:**
    *   [**Vercel Blob**](https://vercel.com/storage/vercel-blob): Fast, scalable, and cost-efficient object storage for images.
    *   [`@vercel/blob` SDK](https://www.npmjs.com/package/@vercel/blob): Node.js SDK for interacting with Vercel Blob.
    *   [`uuid`](https://www.npmjs.com/package/uuid): Library for generating unique identifiers for image filenames.
*   **Deployment:**
    *   [**Vercel**](https://vercel.com/): Platform for deploying Next.js applications.
    *   [**Cloudflare**](https://www.cloudflare.com/): Platform for deploying Cloudflare Workers.

---

## ⚙️ Setup Instructions

Follow these steps to get the Pop Art Generator running on your local machine.

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/pop-art-generator.git
cd pop-art-generator
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`
