"use client"

import { PromptRunner } from "@/components/prompt-runner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Prompt Playground</h1>
        <p className="text-muted-foreground">Test and experiment with AI prompts in real-time</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>AI Image Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <PromptRunner />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
