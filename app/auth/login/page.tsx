import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthForm } from "@/components/auth/auth-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  const supabase = createClient()

  // 检查用户是否已登录
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 如果已登录，重定向到指定页面或首页
  if (session) {
    const redirectTo = searchParams.redirect || "/"
    redirect(redirectTo)
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <AuthForm />
    </div>
  )
}
