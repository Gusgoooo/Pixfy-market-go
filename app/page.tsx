"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { PromptCard } from "@/components/prompt-card"
import { PromptDrawer } from "@/components/prompt-drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Prompt {
  id: string
  title: string
  prompt: string
  description: string | null
  image_url: string | null
  tags: string[]
  platform: string
  author_id: string
  likes_count: number
  collections_count: number
  views_count: number
  is_published: boolean
  created_at: string
  updated_at: string
  profiles?: {
    username: string | null
    full_name: string | null
  } | null
}

const popularTags = ["cyberpunk", "fantasy", "portrait", "nature", "space", "vintage", "minimalist", "abstract"]

export default function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  // 获取 prompts 数据
  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      setIsLoading(true)

      // First, get all prompts
      const { data: promptsData, error: promptsError } = await supabase
        .from("prompts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })

      if (promptsError) throw promptsError

      // Then, get author information for each prompt
      const promptsWithAuthors = await Promise.all(
        (promptsData || []).map(async (prompt) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, full_name")
            .eq("id", prompt.author_id)
            .single()

          return {
            ...prompt,
            profiles: profileData,
          }
        }),
      )

      setPrompts(promptsWithAuthors)
    } catch (error: any) {
      console.error("Error fetching prompts:", error)
      toast({
        title: "Error",
        description: "Failed to load prompts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 过滤 prompts
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => prompt.tags?.includes(tag))

    return matchesSearch && matchesTags
  })

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // 转换数据格式以适配 PromptCard 组件
  const formatPromptForCard = (prompt: Prompt) => ({
    id: prompt.id,
    title: prompt.title,
    prompt: prompt.prompt,
    description: prompt.description || "",
    imageUrl: prompt.image_url || "/placeholder.svg?height=400&width=300",
    tags: prompt.tags || [],
    author: prompt.profiles?.username || prompt.profiles?.full_name || "Unknown",
    likes: prompt.likes_count,
    collections: prompt.collections_count,
    isLiked: false, // TODO: 从用户数据中获取
    isCollected: false, // TODO: 从用户数据中获取
    createdAt: new Date(prompt.created_at).toLocaleDateString(),
    platform: prompt.platform,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Discover Amazing AI Prompts
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse, collect, and share the best prompts for AI image generation
          </p>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Discover Amazing AI Prompts</h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse, collect, and share the best prompts for AI image generation
        </p>
      </div>

      {/* Search and Filters */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 sm:w-auto">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Popular Tags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Popular Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="text-sm text-muted-foreground">Showing {filteredPrompts.length} prompts</div>
      </div>

      {/* Prompt Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No prompts found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPrompts.map((prompt) => (
              <div key={prompt.id} className="flex justify-center">
                <PromptCard prompt={formatPromptForCard(prompt)} onClick={() => setSelectedPrompt(prompt)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Detail Drawer */}
      <PromptDrawer
        prompt={selectedPrompt ? formatPromptForCard(selectedPrompt) : null}
        open={!!selectedPrompt}
        onOpenChange={(open) => !open && setSelectedPrompt(null)}
      />
    </div>
  )
}
