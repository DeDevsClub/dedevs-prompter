"use client"

import { useState, useEffect } from "react"
import { Sparkles, ArrowRight, RefreshCw, Lightbulb, History, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApiKeyManager } from "@/components/api-key-manager"
import { PromptHistoryItem } from "@/components/prompt-history-item"
import { PromptTips } from "@/components/prompt-tips"
import { DiffView } from "@/components/diff-view"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoPopover } from "@/components/info-popover"

export default function HomePage() {
  const [originalPrompt, setOriginalPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [enhancementNotes, setEnhancementNotes] = useState<string[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<{ original: string; enhanced: string; timestamp: Date }>>([])
  const [selectedTab, setSelectedTab] = useState("enhance")
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(true)
  const { toast } = useToast()

  // Load history from localStorage on component mount
  useEffect(() => {
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
  }, [])

  const handleApiKeyChange = (key: string | null) => {
    setApiKey(key)
    // Don't auto-close the API key section when a key is provided
    // This allows users to see the confirmation and make additional changes if needed
  }

  const [enhancementMethod, setEnhancementMethod] = useState("balanced")

  // Enhancement methods with descriptions and examples
  const enhancementMethods = {
    balanced: {
      name: "Balanced Enhancement",
      description: "A well-rounded approach that improves clarity, specificity, and structure.",
      example: {
        before: "Create a login page.",
        after:
          "Create a responsive login page with email and password fields, validation, error handling, and a 'forgot password' option. Use modern design principles and ensure it's accessible.",
      },
    },
    clarity: {
      name: "Clarity Enhancement",
      description: "Focuses on making the prompt more clear and understandable.",
      example: {
        before: "Write a story.",
        after:
          "Craft a short story about a time-traveling detective solving a mystery in Victorian London. Include vivid descriptions of the setting and characters.",
      },
    },
    specificity: {
      name: "Specificity Improvement",
      description: "Adds detailed requirements and constraints to the prompt.",
      example: {
        before: "Make a website.",
        after:
          "Develop a responsive e-commerce website for selling handmade jewelry, including product listings, a shopping cart, and secure checkout using Stripe integration.",
      },
    },
    context: {
      name: "Contextual Enrichment",
      description: "Adds relevant background information and context.",
      example: {
        before: "Fix the bug.",
        after:
          "Identify and resolve the bug in the user authentication module that causes session timeouts after 5 minutes, ensuring secure login functionality and providing informative error messages.",
      },
    },
    iterative: {
      name: "Iterative Refinement",
      description: "Structures the prompt for ongoing improvement and feedback.",
      example: {
        before: "Create a logo.",
        after:
          "Design a minimalist logo for a tech startup called 'Quantum', incorporating the company name and a visual representation of its AI services. This is the first iteration, and I'll provide feedback on color schemes and typography.",
      },
    },
  }

  function getEnhancementInstructions(method: string) {
    switch (method) {
      case "clarity":
        return "Focus on making the prompt more clear and understandable. Eliminate ambiguity, use precise language, and ensure the intent is obvious."
      case "specificity":
        return "Focus on adding detailed requirements, constraints, and parameters. Be explicit about what's needed, including formats, styles, and technical specifications."
      case "context":
        return "Focus on adding relevant background information and context. Include details about the purpose, audience, and environment where the result will be used."
      case "iterative":
        return "Structure the prompt for ongoing improvement. Frame it as part of an iterative process, indicating areas for future refinement and feedback."
      default: // balanced
        return "Balance improvements across clarity, specificity, structure, and context. Create a well-rounded enhancement that addresses multiple aspects of prompt quality."
    }
  }

  const enhancePrompt = async () => {
    if (!originalPrompt.trim() || !apiKey) {
      if (!apiKey) {
        setIsApiKeyOpen(true)
        toast({
          title: "API Key Required",
          description: "Please enter your OpenAI API key to enhance prompts.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Input Required",
          description: "Please enter a prompt to enhance.",
          variant: "destructive",
        })
      }
      return
    }

    setIsEnhancing(true)
    setEnhancedPrompt("")
    setEnhancementNotes([])

    try {
      const systemPrompt = `You are a prompt engineering expert. Analyze the user's prompt and provide an enhanced version that will produce better results.

I want you to focus on ${enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].name.toLowerCase()}.
${getEnhancementInstructions(enhancementMethod)}

Return your response in the following JSON format without any markdown formatting, backticks, or additional text:
{
 "enhancedPrompt": "The improved prompt text",
 "notes": ["Note 1 about what was improved", "Note 2 about what was improved", ...]
}

IMPORTANT: Return ONLY the JSON object. Do not include any explanation text, markdown formatting, or code block syntax like \`\`\`json or \`\`\`.`

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
              content: systemPrompt,
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
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || `Error: ${response.status}`

        // Handle API errors without specific validation
        toast({
          title: "API Error",
          description: errorMessage || "An error occurred while communicating with the OpenAI API.",
          variant: "destructive",
        })

        throw new Error(errorMessage)
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      // Parse the JSON response
      try {
        // First, try to clean the response if it contains markdown code blocks
        let cleanedContent = content

        // Remove markdown code block syntax if present
        if (cleanedContent.includes("```json")) {
          cleanedContent = cleanedContent.replace(/```json\s*/, "").replace(/\s*```\s*$/, "")
        } else if (cleanedContent.includes("```")) {
          cleanedContent = cleanedContent.replace(/```\s*/, "").replace(/\s*```\s*$/, "")
        }

        // Try to parse the cleaned content
        const parsedResponse = JSON.parse(cleanedContent)

        // Validate that the response has the expected structure
        if (!parsedResponse.enhancedPrompt || !Array.isArray(parsedResponse.notes)) {
          throw new Error("Response is missing required fields")
        }

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
        console.error("Raw content:", content)
        toast({
          title: "Processing Error",
          description:
            "Failed to parse the enhancement response. The API returned an invalid format. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error)
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

  const handleApiKeyClick = () => {
    setIsApiKeyOpen(true)
  }

  // Handle collapsible state change
  const handleCollapsibleChange = () => {
    setIsApiKeyOpen(!isApiKeyOpen)
  }

  // Update the ApiKeyManager component usage to include the onSaveSuccess prop
  const handleApiKeySaved = () => {
    // Automatically collapse the API key section after successful save
    setIsApiKeyOpen(false)
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Prompt Enhancement Studio</h1>
        <p className="text-muted-foreground">Analyze and improve your prompts for better results</p>
      </header>

      <Collapsible open={isApiKeyOpen} onOpenChange={handleCollapsibleChange} className="w-full">
        <div className="flex justify-between items-center">
          <h2
            className="text-xl font-semibold cursor-pointer hover:text-dedevs-pink transition-colors"
            onClick={handleApiKeyClick}
          >
            OpenAI API Key
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isApiKeyOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  {apiKey ? "Show API Key Settings" : "Set API Key"}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-4">
          <ApiKeyManager onApiKeyChange={handleApiKeyChange} onSaveSuccess={handleApiKeySaved} />
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-6" />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enhance">
            <Sparkles className="mr-2 h-4 w-4" />
            Enhance
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhance" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Prompt</CardTitle>
                <CardDescription>Enter your prompt to enhance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor="enhancement-method" className="text-sm font-medium">
                        Enhancement Method
                      </label>
                      <InfoPopover
                        content={
                          <div className="space-y-3">
                            <p className="text-sm">
                              Choose how you want your prompt to be enhanced. Each method focuses on different aspects
                              of prompt quality.
                            </p>
                            <ul className="text-sm list-disc pl-5 space-y-1">
                              <li>
                                <strong>Balanced:</strong> Improves multiple aspects
                              </li>
                              <li>
                                <strong>Clarity:</strong> Makes intent clearer
                              </li>
                              <li>
                                <strong>Specificity:</strong> Adds detailed requirements
                              </li>
                              <li>
                                <strong>Context:</strong> Adds background information
                              </li>
                              <li>
                                <strong>Iterative:</strong> Structures for ongoing refinement
                              </li>
                            </ul>
                          </div>
                        }
                        title="Enhancement Methods"
                        description="Select the approach that best fits your needs"
                        iconSize="sm"
                        width="md"
                      />
                    </div>
                    <Select value={enhancementMethod} onValueChange={setEnhancementMethod}>
                      <SelectTrigger id="enhancement-method" className="w-full">
                        <SelectValue placeholder="Select enhancement method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced Enhancement</SelectItem>
                        <SelectItem value="clarity">Clarity Enhancement</SelectItem>
                        <SelectItem value="specificity">Specificity Improvement</SelectItem>
                        <SelectItem value="context">Contextual Enrichment</SelectItem>
                        <SelectItem value="iterative">Iterative Refinement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label htmlFor="prompt-input" className="text-sm font-medium">
                        Your Prompt
                      </label>
                      <InfoPopover
                        content={
                          <div className="space-y-3">
                            <p className="text-sm">
                              Enter the prompt you want to enhance. The system will analyze it and suggest improvements
                              based on your selected enhancement method.
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Example:</p>
                              <div className="bg-muted p-2 rounded text-xs">
                                <p className="opacity-70">Original:</p>
                                <p>
                                  {
                                    enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].example
                                      .before
                                  }
                                </p>
                                <p className="opacity-70 mt-2">Enhanced:</p>
                                <p>
                                  {
                                    enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].example
                                      .after
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        }
                        title="Prompt Input"
                        description="What you want the AI to help you with"
                        iconSize="sm"
                        position="top"
                      />
                    </div>
                    <InfoPopover
                      content={
                        <div className="space-y-2">
                          <h4 className="font-medium">
                            {enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].description}
                          </p>
                          <div className="mt-4 space-y-2">
                            <div className="space-y-1">
                              <h5 className="text-xs font-medium">Example Before:</h5>
                              <p className="text-xs bg-muted p-2 rounded">
                                {
                                  enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].example
                                    .before
                                }
                              </p>
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-xs font-medium">Example After:</h5>
                              <p className="text-xs bg-muted p-2 rounded">
                                {enhancementMethods[enhancementMethod as keyof typeof enhancementMethods].example.after}
                              </p>
                            </div>
                          </div>
                        </div>
                      }
                      title="Selected Method"
                      width="md"
                    />
                  </div>
                  <Textarea
                    id="prompt-input"
                    placeholder="Enter your prompt here..."
                    className="min-h-[200px]"
                    value={originalPrompt}
                    onChange={(e) => setOriginalPrompt(e.target.value)}
                  />
                </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Enhanced Prompt</CardTitle>
                    <CardDescription>Improved version of your prompt</CardDescription>
                  </div>
                  <InfoPopover
                    content={
                      <div className="space-y-3">
                        <p className="text-sm">
                          This is your enhanced prompt after applying the selected enhancement method. You can:
                        </p>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>Copy it to use elsewhere</li>
                          <li>Edit it manually if needed</li>
                          <li>Refine it further with another enhancement pass</li>
                        </ul>
                      </div>
                    }
                    title="Enhanced Prompt"
                    position="left"
                  />
                </div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Comparison View</CardTitle>
                      <CardDescription>See what changed in your prompt</CardDescription>
                    </div>
                    <InfoPopover
                      content={
                        <div className="space-y-2">
                          <p className="text-sm">
                            This view highlights the differences between your original prompt and the enhanced version:
                          </p>
                          <ul className="text-sm list-disc pl-5 space-y-1">
                            <li>
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1 rounded">
                                Green
                              </span>{" "}
                              text shows additions
                            </li>
                            <li>
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through px-1 rounded">
                                Red
                              </span>{" "}
                              text shows removals
                            </li>
                          </ul>
                        </div>
                      }
                      title="Diff View"
                      position="left"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <DiffView original={originalPrompt} enhanced={enhancedPrompt} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Enhancement Notes</CardTitle>
                      <CardDescription>What was improved in your prompt</CardDescription>
                    </div>
                    <InfoPopover
                      content={
                        <p className="text-sm">
                          These notes explain the specific improvements made to your prompt, helping you understand the
                          enhancement process and learn prompt engineering techniques.
                        </p>
                      }
                      title="Enhancement Notes"
                      position="left"
                    />
                  </div>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prompt History</CardTitle>
                  <CardDescription>Your previously enhanced prompts</CardDescription>
                </div>
                <InfoPopover
                  content={
                    <div className="space-y-2">
                      <p className="text-sm">This section shows your previously enhanced prompts. You can:</p>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Click on any item to load it back into the editor</li>
                        <li>Copy individual prompts to your clipboard</li>
                        <li>See when each prompt was enhanced</li>
                      </ul>
                      <p className="text-sm mt-2">
                        Your history is stored locally in your browser and is not sent to any server.
                      </p>
                    </div>
                  }
                  title="Prompt History"
                />
              </div>
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
      </Tabs>

      <div className="mt-10 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Tips & Examples</h2>
        </div>
        <p className="text-muted-foreground">
          Learn how to craft more effective prompts with these guidelines and examples
        </p>
        <PromptTips />
      </div>
    </div>
  )
}

