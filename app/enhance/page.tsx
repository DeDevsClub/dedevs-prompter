"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, RefreshCw, Lightbulb, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { decryptData } from "@/lib/encryption"
import { PromptHistoryItem } from "@/components/prompt-history-item"
import { PromptTips } from "@/components/prompt-tips"
import { DiffView } from "@/components/diff-view"

export default function EnhancePage() {
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [enhancementNotes, setEnhancementNotes] = useState<string[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<{ original: string; enhanced: string; timestamp: Date }>>([])
  const [selectedTab, setSelectedTab] = useState("enhance")
  const router = useRouter()
  const { toast } = useToast()

  // Check for API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const encryptedKey = localStorage.getItem("openai_api_key")
        if (!encryptedKey) {
          // Redirect to home if no API key is found
          router.push("/")
          return
        }

        // Decrypt and validate the API key
        const key = await decryptData(encryptedKey)

        // Test the API key
        const response = await fetch("/api/test-openai-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ apiKey: key }),
        })

        if (!response.ok) {
          throw new Error("Invalid API key")
        }

        setApiKey(key)
      } catch (error) {
        console.error("API key validation error:", error)
        toast({
          title: "Authentication Required",
          description: "Please provide a valid OpenAI API key to access this page.",
          variant: "destructive",
        })
        router.push("/")
      }
    }

    checkApiKey()

    // Load history from localStorage
    const savedHistory = localStorage.getItem("prompt_history")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        setHistory(
          parsedHistory.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          })),
        )
      } catch (e) {
        console.error("Error loading history:", e)
      }
    }
  }, [router, toast])

  const enhancePrompt = async () => {
    if (!originalPrompt.trim() || !apiKey) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to enhance.",
        variant: "destructive",
      })
      return
    }

    setIsEnhancing(true)
    setEnhancedPrompt("")
    setEnhancementNotes([])

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a prompt engineering expert. Analyze the user's prompt and provide an enhanced version that will produce better results.
              
              Return your response in the following JSON format:
              {
                "enhancedPrompt": "The improved prompt text",
                "notes": ["Note 1 about what was improved", "Note 2 about what was improved", ...]
              }
              
              Focus on making these improvements:
              1. Add more specificity and detail
              2. Clarify ambiguous instructions
              3. Improve structure and organization
              4. Add constraints and requirements
              5. Specify the desired format and style
              6. Remove unnecessary words or redundancies
              
              Your response must be valid JSON.`,
            },
            {
              role: "user",
              content: originalPrompt,
            },
          ],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      // Parse the JSON response
      try {
        const parsedResponse = JSON.parse(content)
        setEnhancedPrompt(parsedResponse.enhancedPrompt)
        setEnhancementNotes(parsedResponse.notes)

        // Add to history
        const newHistoryItem = {
          original: originalPrompt,
          enhanced: parsedResponse.enhancedPrompt,
          timestamp: new Date(),
        }

        const updatedHistory = [newHistoryItem, ...history]
        setHistory(updatedHistory)

        // Save to localStorage
        localStorage.setItem("prompt_history", JSON.stringify(updatedHistory.slice(0, 20)))
      } catch (e) {
        console.error("Error parsing response:", e)
        toast({
          title: "Processing Error",
          description: "Failed to parse the enhancement response. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance your prompt. Please check your API key and try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  const iterativeEnhance = async () => {
    if (!enhancedPrompt) {
      toast({
        title: "No Enhanced Prompt",
        description: "Please enhance a prompt first before refining it further.",
        variant: "destructive",
      })
      return
    }

    // Use the enhanced prompt as the new original prompt
    setOriginalPrompt(enhancedPrompt)
    setEnhancedPrompt("")
    setEnhancementNotes([])

    // Automatically trigger enhancement after a short delay
    setTimeout(() => {
      enhancePrompt()
    }, 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The prompt has been copied to your clipboard.",
    })
  }

  const loadFromHistory = (item: { original: string; enhanced: string }) => {
    setOriginalPrompt(item.original)
    setEnhancedPrompt(item.enhanced)
    setSelectedTab("enhance")
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please provide a valid OpenAI API key to access this page.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to API Key Setup
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Prompt Enhancement Studio</h1>
        <p className="text-muted-foreground">Analyze and improve your prompts for better results</p>
      </header>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enhance">
            <Sparkles className="mr-2 h-4 w-4" />
            Enhance
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="tips">
            <Lightbulb className="mr-2 h-4 w-4" />
            Tips & Examples
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Prompt</CardTitle>
                <CardDescription>Enter your prompt to enhance</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your prompt here..."
                  className="min-h-[200px]"
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setOriginalPrompt("")} disabled={!originalPrompt.trim()}>
                  Clear
                </Button>
                <Button onClick={enhancePrompt} disabled={isEnhancing || !originalPrompt.trim()}>
                  {isEnhancing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Enhance Prompt
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enhanced Prompt</CardTitle>
                <CardDescription>Improved version of your prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Your enhanced prompt will appear here..."
                  className="min-h-[200px]"
                  value={enhancedPrompt}
                  onChange={(e) => setEnhancedPrompt(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => copyToClipboard(enhancedPrompt)} disabled={!enhancedPrompt}>
                  Copy
                </Button>
                <Button onClick={iterativeEnhance} disabled={!enhancedPrompt}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Refine Further
                </Button>
              </CardFooter>
            </Card>
          </div>

          {enhancedPrompt && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Comparison View</CardTitle>
                  <CardDescription>See what changed in your prompt</CardDescription>
                </CardHeader>
                <CardContent>
                  <DiffView original={originalPrompt} enhanced={enhancedPrompt} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enhancement Notes</CardTitle>
                  <CardDescription>What was improved in your prompt</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {enhancementNotes.map((note, index) => (
                      <li key={index} className="flex items-start">
                        <Badge variant="outline" className="mr-2 mt-0.5">
                          {index + 1}
                        </Badge>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Prompt History</CardTitle>
              <CardDescription>Your previously enhanced prompts</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>No prompt history yet</p>
                  <p className="text-sm">Enhanced prompts will appear here</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <PromptHistoryItem key={index} item={item} onSelect={loadFromHistory} />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <PromptTips />
        </TabsContent>
      </Tabs>
    </div>
  )
}

