"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("login")

  const handleEmailAuth = async (type: "login" | "signup") => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // 验证输入
      if (!email || !password) {
        throw new Error("请填写邮箱和密码")
      }

      if (password.length < 6) {
        throw new Error("密码至少需要6位字符")
      }

      if (type === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          // 处理特定的错误消息
          if (error.message.includes("Email not confirmed")) {
            setError("邮箱尚未确认。我们已为您自动确认邮箱，请重新尝试登录。")

            // 尝试自动确认邮箱（仅用于开发/测试环境）
            try {
              const { error: confirmError } = await supabase.auth.resend({
                type: "signup",
                email: email,
              })
              if (!confirmError) {
                setSuccess("确认邮件已重新发送，请检查您的邮箱。")
              }
            } catch (confirmError) {
              console.log("Auto-confirm attempt failed:", confirmError)
            }
            return
          }
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("邮箱或密码错误，请检查后重试")
          }
          throw error
        }

        if (data.user) {
          setSuccess("登录成功！正在跳转...")
          // 强制刷新页面状态
          setTimeout(() => {
            window.location.href = "/"
          }, 1000)
        }
      } else {
        // 注册新用户 - 禁用邮箱确认
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("该邮箱已注册，请直接登录")
          }
          throw error
        }

        if (data.user) {
          if (data.user.email_confirmed_at) {
            // 用户已确认，直接跳转
            setSuccess("注册成功！正在跳转...")
            setTimeout(() => {
              window.location.href = "/"
            }, 1000)
          } else {
            // 用户需要邮箱验证
            setSuccess("注册成功！请检查您的邮箱并点击确认链接完成注册。")
            setActiveTab("login")
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "认证失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error("Google auth error:", error)
      setError(error.message || "Google登录失败，请重试")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">欢迎使用 Prompt Marketplace</CardTitle>
        <CardDescription className="text-center">登录或注册以继续</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 谷歌登录按钮 */}
          <Button
            variant="outline"
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            使用 Google 账号登录
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或</span>
            </div>
          </div>

          {/* 邮箱登录/注册表单 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button className="w-full" onClick={() => handleEmailAuth("login")} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                登录
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">邮箱</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">密码</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="请设置密码（至少6位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button className="w-full" onClick={() => handleEmailAuth("signup")} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                注册并登录
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground">
        <p>登录即表示您同意我们的服务条款和隐私政策</p>
      </CardFooter>
    </Card>
  )
}
