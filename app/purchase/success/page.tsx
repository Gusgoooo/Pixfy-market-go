"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Copy, ExternalLink, Download, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const plan = searchParams.get("plan") || "pro"
  const promptId = searchParams.get("promptId") || "1"

  // Mock API key - in real app, this would be generated server-side
  const apiKey = "pm_sk_1234567890abcdef1234567890abcdef"

  const sampleCode = `// Example: Using the Prompt Marketplace API
import fetch from 'node-fetch';

const response = await fetch('https://api.promptmarketplace.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt_id: '${promptId}',
    parameters: {
      width: 1024,
      height: 1024,
      style: 'photorealistic'
    }
  })
});

const result = await response.json();
console.log('Generated image URL:', result.image_url);`

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast({
      description: "API key copied to clipboard",
    })
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleCode)
    toast({
      description: "Sample code copied to clipboard",
    })
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-4 w-full max-w-2xl">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Purchase Successful!</h1>
        <p className="text-muted-foreground">
          Your API access has been activated. You can now integrate this prompt into your applications.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Key & Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Key</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Key</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyApiKey}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm break-all">{apiKey}</div>
                <p className="text-xs text-muted-foreground">
                  Keep this key secure and never share it publicly. It has been sent to your email as well.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Plan Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <Badge variant="outline">{plan.charAt(0).toUpperCase() + plan.slice(1)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>API Calls:</span>
                    <span>{plan === "starter" ? "1,000" : plan === "pro" ? "5,000" : "20,000"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <span>{plan === "starter" ? "10/min" : plan === "pro" ? "50/min" : "200/min"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/docs/api" target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View API Documentation
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/dashboard")}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Code */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Integration Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Node.js Example</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea value={sampleCode} readOnly className="font-mono text-xs h-64 resize-none" />
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Available Endpoints</h4>
                <div className="space-y-1 text-sm">
                  <div className="bg-muted p-2 rounded text-xs font-mono">POST /v1/generate</div>
                  <div className="bg-muted p-2 rounded text-xs font-mono">GET /v1/prompts/{promptId}</div>
                  <div className="bg-muted p-2 rounded text-xs font-mono">GET /v1/usage</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  Check out our comprehensive documentation and examples to get started quickly.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/docs/getting-started" target="_blank" rel="noreferrer">
                    <Download className="h-3 w-3 mr-1" />
                    Download SDK
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
