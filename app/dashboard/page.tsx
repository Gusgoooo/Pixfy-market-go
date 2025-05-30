"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Heart, Bookmark, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserPrompt {
  id: string
  title: string
  prompt: string
  tags: string[]
  platform: string
  likes_count: number
  collections_count: number
  views_count: number
  created_at: string
  is_published: boolean
}

interface UserCollection {
  id: string
  created_at: string
  prompts: {
    id: string
    title: string
    platform: string
    tags: string[]
    likes_count: number
    profiles: {
      username: string | null
      full_name: string | null
    }
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState("uploads")
  const [myUploads, setMyUploads] = useState<UserPrompt[]>([])
  const [myCollections, setMyCollections] = useState<UserCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    if (!user) return

    try {
      setIsLoading(true)

      // 获取用户上传的 prompts
      const { data: uploads, error: uploadsError } = await supabase
        .from("prompts")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })

      if (uploadsError) throw uploadsError

      // 获取用户收藏的 prompts - 使用简单查询
      const { data: collectionsData, error: collectionsError } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (collectionsError) throw collectionsError

      // 为每个收藏获取 prompt 详情
      const collectionsWithPrompts = await Promise.all(
        (collectionsData || []).map(async (collection) => {
          const { data: promptData } = await supabase
            .from("prompts")
            .select("id, title, platform, tags, likes_count, author_id")
            .eq("id", collection.prompt_id)
            .single()

          if (promptData) {
            // 获取作者信息
            const { data: profileData } = await supabase
              .from("profiles")
              .select("username, full_name")
              .eq("id", promptData.author_id)
              .single()

            return {
              ...collection,
              prompts: {
                ...promptData,
                profiles: profileData,
              },
            }
          }
          return null
        }),
      )

      setMyUploads(uploads || [])
      setMyCollections(collectionsWithPrompts.filter(Boolean) || [])
    } catch (error: any) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    // TODO: 实现编辑功能
    toast({
      description: "Edit functionality coming soon",
    })
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id).eq("author_id", user.id) // 确保只能删除自己的 prompt

      if (error) throw error

      toast({
        description: "Prompt deleted successfully",
      })

      // 重新获取数据
      fetchUserData()
    } catch (error: any) {
      console.error("Error deleting prompt:", error)
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveFromCollection = async (id: string) => {
    try {
      const { error } = await supabase.from("collections").delete().eq("id", id).eq("user_id", user.id) // 确保只能删除自己的收藏

      if (error) throw error

      toast({
        description: "Removed from collection",
      })

      // 重新获取数据
      fetchUserData()
    } catch (error: any) {
      console.error("Error removing from collection:", error)
      toast({
        title: "Error",
        description: "Failed to remove from collection. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/dashboard")
      return
    }
    fetchUserData()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Manage your prompts and collections</p>
        </div>
        <Button asChild>
          <a href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Prompt
          </a>
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="uploads">My Uploads ({myUploads.length})</TabsTrigger>
            <TabsTrigger value="collections">My Collections ({myCollections.length})</TabsTrigger>
            <TabsTrigger value="api">API Keys (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Uploaded Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                {myUploads.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't uploaded any prompts yet.</p>
                    <Button asChild>
                      <a href="/upload">Upload Your First Prompt</a>
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Stats</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myUploads.map((upload) => (
                          <TableRow key={upload.id}>
                            <TableCell className="font-medium">{upload.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{upload.platform}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {upload.tags?.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {upload.tags && upload.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{upload.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {upload.likes_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bookmark className="h-3 w-3" />
                                  {upload.collections_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {upload.views_count}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(upload.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={upload.is_published ? "default" : "secondary"}>
                                {upload.is_published ? "published" : "draft"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(upload.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(upload.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Collected Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                {myCollections.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't collected any prompts yet.</p>
                    <Button asChild>
                      <a href="/">Browse Prompts</a>
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Likes</TableHead>
                          <TableHead>Collected</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myCollections.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.prompts.title}</TableCell>
                            <TableCell>
                              {item.prompts.profiles?.username || item.prompts.profiles?.full_name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.prompts.platform}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {item.prompts.tags?.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {item.prompts.tags && item.prompts.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{item.prompts.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {item.prompts.likes_count}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleRemoveFromCollection(item.id)}
                                    className="text-destructive"
                                  >
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    Remove from Collection
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No API keys yet. Purchase prompt access to get started.</p>
                  <Button asChild>
                    <a href="/">Browse Prompts</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
