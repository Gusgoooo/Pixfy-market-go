"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, Code, Zap, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApiDocsPage() {
  const { toast } = useToast()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      description: "Code copied to clipboard",
    })
  }

  const endpoints = [
    {
      method: "POST",
      path: "/v1/generate",
      description: "Generate an image using a purchased prompt",
      auth: true,
    },
    {
      method: "GET",
      path: "/v1/prompts/{id}",
      description: "Get prompt details and metadata",
      auth: true,
    },
    {
      method: "GET",
      path: "/v1/usage",
      description: "Check your API usage and remaining calls",
      auth: true,
    },
    {
      method: "GET",
      path: "/v1/models",
      description: "List available AI models and platforms",
      auth: false,
    },
  ]

  const codeExamples = {
    javascript: `// Install the SDK: npm install @promptmarketplace/sdk

import { PromptMarketplace } from '@promptmarketplace/sdk';

const pm = new PromptMarketplace({
  apiKey: 'your_api_key_here'
});

// Generate an image
const result = await pm.generate({
  promptId: 'prompt_123',
  parameters: {
    width: 1024,
    height: 1024,
    style: 'photorealistic',
    seed: 42
  }
});

console.log('Generated image:', result.imageUrl);`,
    python: `# Install the SDK: pip install promptmarketplace

from promptmarketplace import PromptMarketplace

pm = PromptMarketplace(api_key='your_api_key_here')

# Generate an image
result = pm.generate(
    prompt_id='prompt_123',
    parameters={
        'width': 1024,
        'height': 1024,
        'style': 'photorealistic',
        'seed': 42
    }
)

print(f"Generated image: {result['image_url']}")`,
    curl: `# Generate an image
curl -X POST https://api.promptmarketplace.com/v1/generate \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt_id": "prompt_123",
    "parameters": {
      "width": 1024,
      "height": 1024,
      "style": "photorealistic",
      "seed": 42
    }
  }'`,
  }

  return (
    <div className="content-spacing">
      {/* Header */}
      <div className="grid-layout">
        <div className="grid-col-12 text-center">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Integrate AI-powered image generation into your applications with our simple REST API
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid-layout">
        <div className="grid-col-12 space-y-8">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-medium">Purchase API Access</h3>
                  <p className="text-sm text-muted-foreground">Buy API access for any prompt in our marketplace</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-medium">Get Your API Key</h3>
                  <p className="text-sm text-muted-foreground">Receive your unique API key instantly after purchase</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-medium">Start Generating</h3>
                  <p className="text-sm text-muted-foreground">Make API calls to generate images programmatically</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>All API requests require authentication using your API key in the Authorization header:</p>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">Authorization: Bearer your_api_key_here</div>
              <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Keep your API key secure and never expose it in client-side code. All
                  requests should be made from your server.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge variant={endpoint.method === "POST" ? "default" : "secondary"}>{endpoint.method}</Badge>
                      <code className="text-sm font-mono">{endpoint.path}</code>
                      {endpoint.auth && <Badge variant="outline">Auth Required</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Code Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium capitalize">{lang} Example</h3>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(code)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea value={code} readOnly className="font-mono text-xs h-64 resize-none" />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Response Format */}
          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Successful Response</h3>
              <Textarea
                value={`{
  "success": true,
  "data": {
    "image_url": "https://cdn.promptmarketplace.com/generated/abc123.png",
    "prompt_id": "prompt_123",
    "parameters": {
      "width": 1024,
      "height": 1024,
      "style": "photorealistic"
    },
    "generation_time": 3.2,
    "credits_used": 1
  }
}`}
                readOnly
                className="font-mono text-xs h-32 resize-none"
              />

              <Separator />

              <h3 className="font-medium">Error Response</h3>
              <Textarea
                value={`{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "You have insufficient API credits remaining",
    "details": {
      "credits_remaining": 0,
      "credits_required": 1
    }
  }
}`}
                readOnly
                className="font-mono text-xs h-24 resize-none"
              />
            </CardContent>
          </Card>

          {/* Rate Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Starter Plan</h3>
                  <p className="text-2xl font-bold">10/min</p>
                  <p className="text-sm text-muted-foreground">10 requests per minute</p>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Pro Plan</h3>
                  <p className="text-2xl font-bold">50/min</p>
                  <p className="text-sm text-muted-foreground">50 requests per minute</p>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Enterprise Plan</h3>
                  <p className="text-2xl font-bold">200/min</p>
                  <p className="text-sm text-muted-foreground">200 requests per minute</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Get support and additional resources:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/docs/getting-started" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Getting Started Guide
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/docs/examples" target="_blank" rel="noreferrer">
                    <Code className="h-4 w-4 mr-2" />
                    Code Examples
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="mailto:support@promptmarketplace.com">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/discord" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Discord
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
