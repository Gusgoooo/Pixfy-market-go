"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, Shield, Zap, Code, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Mock prompt data - in real app, fetch by ID
const mockPrompt = {
  id: "1",
  title: "Cyberpunk City",
  prompt: "A futuristic cyberpunk cityscape at night with neon lights, flying cars, and towering skyscrapers...",
  description: "Perfect for creating atmospheric cyberpunk scenes",
  imageUrl: "/placeholder.svg?height=400&width=300",
  author: "PromptMaster",
  platform: "Midjourney",
  price: 29.99,
  apiCallsIncluded: 1000,
}

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29.99,
    calls: 1000,
    features: ["1,000 API calls", "Basic support", "Rate limit: 10/min"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 79.99,
    calls: 5000,
    features: ["5,000 API calls", "Priority support", "Rate limit: 50/min", "Custom parameters"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199.99,
    calls: 20000,
    features: ["20,000 API calls", "24/7 support", "Rate limit: 200/min", "Custom parameters", "Webhook support"],
    popular: false,
  },
]

export default function PurchasePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    company: "",
    agreeToTerms: false,
  })

  const selectedPlanData = pricingPlans.find((plan) => plan.id === selectedPlan)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePurchase = async () => {
    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Purchase Successful!",
      description: "Your API key has been generated and sent to your email.",
    })

    // Redirect to success page
    router.push(`/purchase/success?plan=${selectedPlan}&promptId=${params.id}`)
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-4 w-full max-w-6xl">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Purchase API Access</h1>
          <p className="text-muted-foreground">Get API access for "{mockPrompt.title}"</p>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prompt Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={mockPrompt.imageUrl || "/placeholder.svg"}
                    alt={mockPrompt.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{mockPrompt.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{mockPrompt.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{mockPrompt.platform}</Badge>
                    <span className="text-sm text-muted-foreground">by {mockPrompt.author}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Sample Prompt</h4>
                  <Textarea
                    value={mockPrompt.prompt.slice(0, 150) + "..."}
                    readOnly
                    className="text-xs h-20 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing & Purchase */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pricing Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pricingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                      )}
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <div className="text-2xl font-bold">${plan.price}</div>
                        <p className="text-sm text-muted-foreground">{plan.calls.toLocaleString()} API calls</p>
                      </div>
                      <ul className="space-y-1 mt-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>

                  {paymentMethod === "card" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Plan: {selectedPlanData?.name}</span>
                    <span>${selectedPlanData?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>API Calls Included</span>
                    <span>{selectedPlanData?.calls.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${selectedPlanData?.price}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={isProcessing || !formData.agreeToTerms}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : `Purchase for $${selectedPlanData?.price}`}
                  <Shield className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Instant Access
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    API Ready
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
