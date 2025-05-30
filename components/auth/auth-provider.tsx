"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({
  children,
  initialSession,
}: { children: React.ReactNode; initialSession: Session | null }) {
  const [user, setUser] = useState<User | null>(initialSession?.user || null)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState(!initialSession)
  const supabase = createClient()

  useEffect(() => {
    // 获取当前会话
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        setSession(session)
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error in getSession:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // 如果没有初始会话，获取当前会话
    if (!initialSession) {
      getSession()
    }

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)

      // 如果用户登录成功，刷新页面以更新服务端状态
      if (event === "SIGNED_IN" && session) {
        window.location.reload()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialSession])

  return <AuthContext.Provider value={{ user, session, isLoading }}>{children}</AuthContext.Provider>
}
