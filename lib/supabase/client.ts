"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"

// 创建客户端Supabase实例
export const createClient = () => {
  return createBrowserClient<Database>(
    "https://oshdfqlzzbfobhpytuun.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zaGRmcWx6emJmb2JocHl0dXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1ODgxMDUsImV4cCI6MjA2NDE2NDEwNX0.55e-CKkdqZ3oIWc2Z5S3Aq9Kzjvj0aq8BCu0c2-OlQ4",
  )
}
