import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = "1024x1024" } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // For demo purposes, we'll simulate image generation
    // In a real app, you would use DALL-E API or another image generation service

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Return a placeholder image URL
    // In production, this would be the actual generated image URL
    const imageUrl = `/placeholder.svg?height=${size.split("x")[1]}&width=${size.split("x")[0]}&text=Generated+Image`

    return NextResponse.json({
      imageUrl,
      prompt,
      size,
    })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
