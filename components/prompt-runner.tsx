"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Download, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PromptRunnerProps {
  initialPrompt?: string
  onImageGenerated?: (imageUrl: string) => void
}

export function PromptRunner({ initialPrompt = "", onImageGenerated }: PromptRunnerProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [size, setSize] = useState("1024x1024")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, size }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
      onImageGenerated?.(data.imageUrl)

      toast({
        title: "Success",
        description: "Image generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    toast({
      description: "Prompt copied to clipboard",
    })
  }

  const handleDownloadImage = () => {
    if (generatedImage) {
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = "generated-image.png"
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="prompt">Prompt</Label>
            <Button variant="ghost" size="sm" onClick={handleCopyPrompt}>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
          <Textarea
            id="prompt"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="size">Image Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="gap-2">
              <Play className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Generated Image</Label>
              {generatedImage && (
                <Button variant="outline" size="sm" onClick={handleDownloadImage}>
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              )}
            </div>

            <div className="aspect-square max-w-md mx-auto bg-muted rounded-lg overflow-hidden">
              {isGenerating ? (
                <Skeleton className="w-full h-full" />
              ) : generatedImage ? (
                <Image
                  src={generatedImage || "/placeholder.svg"}
                  alt="Generated image"
                  width={512}
                  height={512}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Generated image will appear here
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
