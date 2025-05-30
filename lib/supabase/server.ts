import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// 创建服务端Supabase实例
export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    "https://oshdfqlzzbfobhpytuun.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaGRmcWx6emJmb2JocHl0dXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1ODgxMDUsImV4cCI6MjA2NDE2NDEwNX0.55e-CKkdqZ3oIWc2Z5S3Aq9Kzjvj0aq8BCu0c2-OlQ4",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
