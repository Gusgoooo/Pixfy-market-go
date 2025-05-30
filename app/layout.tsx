import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navigation } from "@/components/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Marketplace",
  description: "Discover, share, and generate amazing AI prompts",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider initialSession={session}>
            <SidebarProvider>
              <div className="min-h-screen bg-background flex flex-col">
                <Navigation />
                <main className="flex-1 flex flex-col items-center">
                  <div className="w-full max-w-7xl px-4 py-8">{children}</div>
                </main>
              </div>
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
