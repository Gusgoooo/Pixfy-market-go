"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Heart, Bookmark, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const myUploads = [
  {
    id: "1",
    title: "Cyberpunk City",
    prompt: "A futuristic cyberpunk cityscape at night...",
    tags: ["cyberpunk", "city", "neon"],
    platform: "Midjourney",
    likes: 234,
    collections: 89,
    views: 1250,
    createdAt: "2024-01-15",
    status: "published",
  },
  {
    id: "2",
    title: "Fantasy Dragon",
    prompt: "A majestic dragon perched on a mountain...",
    tags: ["fantasy", "dragon", "epic"],
    platform: "DALL-E",
    likes: 456,
    collections: 123,
    views: 2100,
    createdAt: "2024-01-14",
    status: "published",
  },
]

const myCollections = [
  {
    id: "3",
    title: "Ocean Waves",
    author: "NatureLover",
    prompt: "Powerful ocean waves crashing against rocky cliffs...",
    tags: ["ocean", "waves", "storm"],
    platform: "Midjourney",
    likes: 312,
    collectedAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Space Explorer",
    author: "SpaceArt",
    prompt: "An astronaut floating in deep space...",
    tags: ["space", "astronaut", "earth"],
    platform: "DALL-E",
    likes: 567,
    collectedAt: "2024-01-11",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("uploads")
  const { toast } = useToast()

  const handleEdit = (id: string) => {
    toast({
      description: "Edit functionality coming soon",
    })
  }

  const handleDelete = (id: string) => {
    toast({
      description: "Prompt deleted successfully",
    })
  }

  const handleRemoveFromCollection = (id: string) => {
    toast({
      description: "Removed from collection",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your prompts and collections</p>
        </div>
        <Button asChild>
          <a href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Prompt
          </a>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="uploads">My Uploads ({myUploads.length})</TabsTrigger>
          <TabsTrigger value="collections">My Collections ({myCollections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Uploaded Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
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
                            {upload.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {upload.tags.length > 2 && (
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
                              {upload.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bookmark className="h-3 w-3" />
                              {upload.collections}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {upload.views}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{upload.createdAt}</TableCell>
                        <TableCell>
                          <Badge variant={upload.status === "published" ? "default" : "secondary"}>
                            {upload.status}
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
                              <DropdownMenuItem onClick={() => handleDelete(upload.id)} className="text-destructive">
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

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {myUploads.map((upload) => (
                  <Card key={upload.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium">{upload.title}</h3>
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
                              <DropdownMenuItem onClick={() => handleDelete(upload.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{upload.platform}</Badge>
                          <Badge variant={upload.status === "published" ? "default" : "secondary"}>
                            {upload.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {upload.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {upload.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bookmark className="h-3 w-3" />
                              {upload.collections}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {upload.views}
                            </span>
                          </div>
                          <span>{upload.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Collected Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
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
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.platform}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes}
                          </span>
                        </TableCell>
                        <TableCell>{item.collectedAt}</TableCell>
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

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {myCollections.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">by {item.author}</p>
                          </div>
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
                        </div>

                        <Badge variant="outline">{item.platform}</Badge>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {item.likes} likes
                          </span>
                          <span>Collected {item.collectedAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
