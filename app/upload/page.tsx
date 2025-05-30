"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PromptRunner } from "@/components/prompt-runner"
import { Upload, X, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    description: "",
    platform: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 如果用户未登录，重定向到登录页
  if (!user) {
    router.push("/auth/login?redirect=/upload")
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageGenerated = (imageUrl: string) => {
    setPreviewImage(imageUrl)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload prompts",
        variant: "destructive",
      })
      return
    }

    if (!formData.title || !formData.prompt || !formData.platform) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 首先确保用户在 profiles 表中存在
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code === "PGRST116") {
        // 用户不存在，创建 profile
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          username: user.email?.split("@")[0], // 使用邮箱前缀作为默认用户名
        })

        if (insertError) {
          console.error("Error creating profile:", insertError)
          throw new Error("Failed to create user profile")
        }
      }

      // 插入 prompt 数据
      const { data, error } = await supabase
        .from("prompts")
        .insert({
          title: formData.title,
          prompt: formData.prompt,
          description: formData.description,
          platform: formData.platform,
          tags: formData.tags,
          author_id: user.id,
          image_url: previewImage,
          is_published: true,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your prompt has been uploaded successfully.",
      })

      // 重置表单
      setFormData({
        title: "",
        prompt: "",
        description: "",
        platform: "",
        tags: [],
      })
      setPreviewImage(null)

      // 跳转到首页或详情页
      router.push("/")
    } catch (error: any) {
      console.error("Error uploading prompt:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Upload Your Prompt</h1>
        <p className="text-muted-foreground">Share your amazing prompts with the community</p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Give your prompt a catchy title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt *</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your full prompt here..."
                  value={formData.prompt}
                  onChange={(e) => handleInputChange("prompt", e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this prompt creates..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={(value) => handleInputChange("platform", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midjourney">Midjourney</SelectItem>
                    <SelectItem value="dalle">DALL-E</SelectItem>
                    <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                    <SelectItem value="leonardo">Leonardo AI</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Prompt
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview & Test</CardTitle>
          </CardHeader>
          <CardContent>
            <PromptRunner initialPrompt={formData.prompt} onImageGenerated={handleImageGenerated} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
