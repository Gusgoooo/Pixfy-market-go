import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"

// 需要登录才能访问的路由
const protectedRoutes = ["/upload", "/dashboard", "/settings"]

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient<Database>(
    "https://oshdfqlzzbfobhpytuun.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaGRmcWx6emJmb2JocHl0dXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1ODgxMDUsImV4cCI6MjA2NDE2NDEwNX0.55e-CKkdqZ3oIWc2Z5S3Aq9Kzjvj0aq8BCu0c2-OlQ4",
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  try {
    // 刷新会话
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // 获取当前路径
    const { pathname } = req.nextUrl

    // 检查是否是受保护的路由
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

    // 如果是受保护的路由且用户未登录，重定向到登录页
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL("/auth/login", req.url)
      redirectUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // 如果用户已登录且访问登录页，重定向到首页
    if (session && pathname === "/auth/login") {
      const redirectTo = req.nextUrl.searchParams.get("redirect") || "/"
      return NextResponse.redirect(new URL(redirectTo, req.url))
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由
     * - 静态文件 (如 images, favicon, assets 等)
     * - _next/static (Next.js 静态文件)
     * - _next/image (Next.js 图片优化 API)
     * - favicon.ico, robots.txt 等
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
}
