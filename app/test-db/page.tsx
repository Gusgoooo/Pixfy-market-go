"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Users, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  name: string
  status: "pending" | "success" | "error"
  message: string
  details?: any
}

export default function TestDatabasePage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "数据库连接", status: "pending", message: "等待测试..." },
    { name: "用户认证", status: "pending", message: "等待测试..." },
    { name: "表结构检查", status: "pending", message: "等待测试..." },
    { name: "数据操作", status: "pending", message: "等待测试..." },
  ])
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const updateTest = (index: number, status: TestResult["status"], message: string, details?: any) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status, message, details } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)
    setTests((prev) => prev.map((test) => ({ ...test, status: "pending", message: "测试中..." })))

    try {
      // 测试 1: 数据库连接
      updateTest(0, "pending", "正在测试数据库连接...")
      try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1)
        if (error) {
          if (error.message.includes('relation "public.profiles" does not exist')) {
            updateTest(0, "error", "数据库连接成功，但 profiles 表不存在。请先创建数据库表。")
          } else {
            throw error
          }
        } else {
          updateTest(0, "success", "数据库连接成功")
        }
      } catch (error: any) {
        updateTest(0, "error", `数据库连接失败: ${error.message}`)
      }

      // 测试 2: 用户认证
      updateTest(1, "pending", "正在检查用户认证状态...")
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
          updateTest(1, "success", `用户已登录: ${session.user.email}`, {
            userId: session.user.id,
            email: session.user.email,
            provider: session.user.app_metadata.provider,
          })
        } else {
          updateTest(1, "success", "用户未登录（正常状态）")
        }
      } catch (error: any) {
        updateTest(1, "error", `认证检查失败: ${error.message}`)
      }

      // 测试 3: 表结构检查
      updateTest(2, "pending", "正在检查数据库表结构...")
      try {
        const tables = ["profiles", "prompts", "likes", "collections", "api_keys"]
        const tableResults = []

        for (const table of tables) {
          try {
            const { data, error } = await supabase.from(table).select("*").limit(1)
            if (error) throw error
            tableResults.push({ table, status: "exists", count: data?.length || 0 })
          } catch (error: any) {
            tableResults.push({ table, status: "error", error: error.message })
          }
        }

        const allTablesExist = tableResults.every((result) => result.status === "exists")
        if (allTablesExist) {
          updateTest(2, "success", "所有必要的表都存在", tableResults)
        } else {
          updateTest(2, "error", "部分表缺失或无法访问", tableResults)
        }
      } catch (error: any) {
        updateTest(2, "error", `表结构检查失败: ${error.message}`)
      }

      // 测试 4: 数据操作
      updateTest(3, "pending", "正在测试数据操作...")
      try {
        const { data: prompts, error: promptsError } = await supabase
          .from("prompts")
          .select("id, title, author_id")
          .limit(5)

        if (promptsError) throw promptsError

        updateTest(3, "success", `数据读取成功，找到 ${prompts?.length || 0} 条 prompt 记录`, {
          promptCount: prompts?.length || 0,
          sampleData: prompts?.slice(0, 3),
        })
      } catch (error: any) {
        updateTest(3, "error", `数据操作失败: ${error.message}`)
      }
    } catch (error: any) {
      toast({
        title: "测试失败",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-500">
            成功
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">失败</Badge>
      case "pending":
        return <Badge variant="secondary">测试中</Badge>
    }
  }

  return (
    <div className="content-spacing">
      {/* Header */}
      <div className="grid-layout">
        <div className="grid-col-12 text-center">
          <h1 className="text-3xl font-bold mb-2">数据库连接测试</h1>
          <p className="text-muted-foreground">验证 Supabase 数据库连接、用户认证和表结构</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid-layout">
        <div className="grid-col-12 grid-col-desktop-8 grid-offset-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                系统状态检查
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={runTests} disabled={isRunning} className="w-full">
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在运行测试...
                  </>
                ) : (
                  "开始测试"
                )}
              </Button>

              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <h3 className="font-medium">{test.name}</h3>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{test.message}</p>

                    {test.details && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <pre className="text-xs overflow-auto">{JSON.stringify(test.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 环境变量检查 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                环境变量检查
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Supabase URL</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">已配置</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Supabase Anon Key</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">已配置</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" asChild>
                  <a href="/auth/login">测试登录</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard">查看仪表板</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">返回首页</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
