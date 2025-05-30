"use client"

import { useState } from "react"
import Image from "next/image"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, Bookmark, Copy, Share, Download, MessageCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PromptDrawerProps {
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
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock comments data
const mockComments = [
  {
    id: "1",
    author: "ArtLover123",
    content: "This is absolutely stunning! The lighting is perfect.",
    createdAt: "2 hours ago",
    likes: 12,
  },
  {
    id: "2",
    author: "PromptExpert",
    content: "Great prompt structure. I'll definitely try this with different subjects.",
    createdAt: "5 hours ago",
    likes: 8,
  },
  {
    id: "3",
    author: "CreativeAI",
    content: "The detail level is incredible. What settings did you use?",
    createdAt: "1 day ago",
    likes: 5,
  },
]

export function PromptDrawer({ prompt, open, onOpenChange }: PromptDrawerProps) {
  const [isLiked, setIsLiked] = useState(prompt?.isLiked || false)
  const [isCollected, setIsCollected] = useState(prompt?.isCollected || false)
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  if (!prompt) return null

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      description: isLiked ? "Removed from likes" : "Added to likes",
    })
  }

  const handleCollect = () => {
    setIsCollected(!isCollected)
    toast({
      description: isCollected ? "Removed from collection" : "Added to collection",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt)
    toast({
      description: "Prompt copied to clipboard",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      description: "Link copied to clipboard",
    })
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      toast({
        description: "Comment posted successfully",
      })
      setNewComment("")
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-6xl">
          <DrawerHeader>
            <DrawerTitle className="text-left">{prompt.title}</DrawerTitle>
          </DrawerHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src={prompt.imageUrl || "/placeholder.svg"} alt={prompt.title} fill className="object-cover" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant={isLiked ? "default" : "outline"} size="sm" onClick={handleLike} className="gap-2">
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                    Like ({prompt.likes})
                  </Button>
                  <Button
                    variant={isCollected ? "default" : "outline"}
                    size="sm"
                    onClick={handleCollect}
                    className="gap-2"
                  >
                    <Bookmark className={cn("h-4 w-4", isCollected && "fill-current")} />
                    Collect
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{prompt.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{prompt.author}</p>
                  <p className="text-sm text-muted-foreground">{prompt.createdAt}</p>
                </div>
                <Badge className="ml-auto">{prompt.platform}</Badge>
              </div>

              <Separator />

              {/* Tabs */}
              <Tabs defaultValue="prompt" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="prompt">Prompt</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({mockComments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="prompt" className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p>{prompt.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Full Prompt</p>
                      <Button size="sm" variant="outline" onClick={handleCopy}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea value={prompt.prompt} readOnly className="min-h-[120px] resize-none" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  {/* Comment Input */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleSubmitComment}>
                        <Send className="h-3 w-3 mr-1" />
                        Post Comment
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {mockComments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{comment.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                        </div>
                        <p className="text-sm pl-8">{comment.content}</p>
                        <div className="flex items-center gap-2 pl-8">
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Heart className="h-3 w-3 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
