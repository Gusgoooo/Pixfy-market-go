"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Bookmark, Copy, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    prompt: string
    description: string
    imageUrl: string
    tags: string[]
    author: string
    likes: number
    collections: number
    isLiked: boolean
    isCollected: boolean
    createdAt: string
    platform: string
  }
  onClick: () => void
}

export function PromptCard({ prompt, onClick }: PromptCardProps) {
  const [isLiked, setIsLiked] = useState(prompt.isLiked)
  const [isCollected, setIsCollected] = useState(prompt.isCollected)
  const [likes, setLikes] = useState(prompt.likes)
  const [collections, setCollections] = useState(prompt.collections)
  const { toast } = useToast()

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
    toast({
      description: isLiked ? "Removed from likes" : "Added to likes",
    })
  }

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCollected(!isCollected)
    setCollections((prev) => (isCollected ? prev - 1 : prev + 1))
    toast({
      description: isCollected ? "Removed from collection" : "Added to collection",
    })
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt.prompt)
    toast({
      description: "Prompt copied to clipboard",
    })
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] w-full max-w-[280px]"
      onClick={onClick}
    >
      <CardContent className="p-0 h-[360px] flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={prompt.imageUrl || "/placeholder.svg"}
            alt={prompt.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

          {/* Platform Badge */}
          <Badge className="absolute top-2 left-2 text-xs">{prompt.platform}</Badge>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={handleCopy}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={onClick}>
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm line-clamp-1">{prompt.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{prompt.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{prompt.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className={cn("h-8 px-2 gap-1", isLiked && "text-red-500")}
                onClick={handleLike}
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-current")} />
                <span className="text-xs">{likes}</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={cn("h-8 px-2 gap-1", isCollected && "text-blue-500")}
                onClick={handleCollect}
              >
                <Bookmark className={cn("h-3 w-3", isCollected && "fill-current")} />
                <span className="text-xs">{collections}</span>
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">by {prompt.author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
