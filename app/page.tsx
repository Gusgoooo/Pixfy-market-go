"use client"

import { useState } from "react"
import { PromptCard } from "@/components/prompt-card"
import { PromptDrawer } from "@/components/prompt-drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp } from "lucide-react"

// Mock data
const mockPrompts = [
  {
    id: "1",
    title: "Cyberpunk City",
    prompt:
      "A futuristic cyberpunk cityscape at night with neon lights, flying cars, and towering skyscrapers. Rain-soaked streets reflect the colorful neon signs. Ultra-detailed, 8K resolution, cinematic lighting.",
    description: "Perfect for creating atmospheric cyberpunk scenes",
    imageUrl: "/placeholder.svg?height=400&width=300",
    tags: ["cyberpunk", "city", "neon", "futuristic"],
    author: "PromptMaster",
    likes: 234,
    collections: 89,
    isLiked: false,
    isCollected: false,
    createdAt: "2024-01-15",
    platform: "Midjourney",
  },
  {
    id: "2",
    title: "Fantasy Dragon",
    prompt:
      "A majestic dragon perched on a mountain peak, breathing fire into the sunset sky. Ancient castle ruins in the background. Epic fantasy art style, detailed scales, dramatic lighting.",
    description: "Epic fantasy dragon illustration",
    imageUrl: "/placeholder.svg?height=400&width=300",
    tags: ["fantasy", "dragon", "epic", "mountain"],
    author: "DragonArtist",
    likes: 456,
    collections: 123,
    isLiked: true,
    isCollected: false,
    createdAt: "2024-01-14",
    platform: "DALL-E",
  },
  {
    id: "3",
    title: "Minimalist Portrait",
    prompt:
      "Clean minimalist portrait of a person in profile, soft natural lighting, neutral background, modern photography style, high contrast, black and white.",
    description: "Clean and modern portrait style",
    imageUrl: "/placeholder.svg?height=400&width=300",
    tags: ["portrait", "minimalist", "photography", "black-white"],
    author: "PhotoPro",
    likes: 189,
    collections: 67,
    isLiked: false,
    isCollected: true,
    createdAt: "2024-01-13",
    platform: "Stable Diffusion",
  },
  {
    id: "4",
    title: "Ocean Waves",
    prompt:
      "Powerful ocean waves crashing against rocky cliffs during a storm, dramatic sky with lightning, spray and foam, photorealistic, dynamic composition.",
    description: "Dramatic seascape with stormy weather",
    imageUrl: "/placeholder.svg?height=400&width=300",
    tags: ["ocean", "waves", "storm", "nature"],
    author: "NatureLover",
    likes: 312,
    collections: 98,
    isLiked: false,
    isCollected: false,
    createdAt: "2024-01-12",
    platform: "Midjourney",
  },
  {
    id: "5",
    title: "Space Explorer",
    prompt:
      "An astronaut floating in deep space with Earth visible in the background, nebula clouds, stars, cosmic dust, cinematic space scene, ultra-realistic.",
    description: "Stunning space exploration scene",
    imageUrl: "/placeholder.svg?height=400&width=300",
    tags: ["space", "astronaut", "earth", "cosmic"],
    author: "SpaceArt",
    likes: 567,
    collections: 234,
    isLiked: true,
    isCollected: true,
    createdAt: "2024-01-11",
    platform: "DALL-E",
  },
  {
    id: "6",
    title: "Vintage Car",
    prompt:
      "Classic 1960s muscle car on an empty desert highway at golden hour, vintage film photography style, warm tones, nostalgic atmosphere.",
    description: "Nostalgic vintage automobile photography",
    imageUrl: "/placeholder.svg?height=400&width=300",
    tags: ["vintage", "car", "desert", "golden-hour"],
    author: "VintageVibes",
    likes: 278,
    collections: 145,
    isLiked: false,
    isCollected: false,
    createdAt: "2024-01-10",
    platform: "Stable Diffusion",
  },
]

const popularTags = ["cyberpunk", "fantasy", "portrait", "nature", "space", "vintage", "minimalist", "abstract"]

export default function HomePage() {
  const [selectedPrompt, setSelectedPrompt] = useState<(typeof mockPrompts)[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => prompt.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Discover Amazing AI Prompts</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse, collect, and share the best prompts for AI image generation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Popular Tags */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Popular Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">Showing {filteredPrompts.length} prompts</div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} onClick={() => setSelectedPrompt(prompt)} />
        ))}
      </div>

      {/* Prompt Detail Drawer */}
      <PromptDrawer
        prompt={selectedPrompt}
        open={!!selectedPrompt}
        onOpenChange={(open) => !open && setSelectedPrompt(null)}
      />
    </div>
  )
}
