"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Lightbulb, Sparkles, MessageSquare, Layers, Target, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DiffView } from "@/components/diff-view"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface Principle {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  examples: {
    before: string
    after: string
  }[]
  enhancementFunction: (prompt: string) => string
}

export function InteractivePrinciplesGuide() {
  const [selectedCategory, setSelectedCategory] = useState("clarity")
  const [userPrompt, setUserPrompt] = useState<Record<string, string>>({})
  const [enhancedPrompt, setEnhancedPrompt] = useState<Record<string, string>>({})
  const [activeExample, setActiveExample] = useState<Record<string, number>>({})

  // Initialize user prompts with the first example for each principle
  useEffect(() => {
    const initialPrompts: Record<string, string> = {}
    const initialExamples: Record<string, number> = {}

    principles.forEach((category) => {
      category.items.forEach((principle) => {
        initialPrompts[principle.id] = principle.examples[0].before
        initialExamples[principle.id] = 0
      })
    })

    setUserPrompt(initialPrompts)
    setActiveExample(initialExamples)
  }, [])

  const applyPrinciple = (principleId: string, principle: Principle) => {
    if (!userPrompt[principleId]) return

    const enhanced = principle.enhancementFunction(userPrompt[principleId])
    setEnhancedPrompt({
      ...enhancedPrompt,
      [principleId]: enhanced,
    })
  }

  const loadExample = (principleId: string, principle: Principle, index: number) => {
    setUserPrompt({
      ...userPrompt,
      [principleId]: principle.examples[index].before,
    })

    setEnhancedPrompt({
      ...enhancedPrompt,
      [principleId]: principle.examples[index].after,
    })

    setActiveExample({
      ...activeExample,
      [principleId]: index,
    })
  }

  // Find the selected category object
  const selectedCategoryObj = principles.find((category) => category.id === selectedCategory) || principles[0]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Prompt Engineering Principles
        </CardTitle>
        <CardDescription>Interactive guide to help you craft more effective prompts</CardDescription>

        {/* Dropdown menu for principle categories */}
        <div className="mt-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                {selectedCategoryObj.icon}
                <span>{selectedCategoryObj.name}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {principles.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({category.items.length} principle{category.items.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 text-sm font-medium">
              {selectedCategoryObj.icon}
              <span>{selectedCategoryObj.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              - {selectedCategoryObj.items.length} principle{selectedCategoryObj.items.length !== 1 ? "s" : ""}
            </span>
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {selectedCategoryObj.items.map((principle) => (
                <PrincipleCard
                  key={principle.id}
                  principle={principle}
                  userPrompt={userPrompt[principle.id] || ""}
                  enhancedPrompt={enhancedPrompt[principle.id] || ""}
                  activeExampleIndex={activeExample[principle.id] || 0}
                  onPromptChange={(value) => setUserPrompt({ ...userPrompt, [principle.id]: value })}
                  onApplyPrinciple={() => applyPrinciple(principle.id, principle)}
                  onLoadExample={(index) => loadExample(principle.id, principle, index)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

interface PrincipleCardProps {
  principle: Principle
  userPrompt: string
  enhancedPrompt: string
  activeExampleIndex: number
  onPromptChange: (value: string) => void
  onApplyPrinciple: () => void
  onLoadExample: (index: number) => void
}

function PrincipleCard({
  principle,
  userPrompt,
  enhancedPrompt,
  activeExampleIndex,
  onPromptChange,
  onApplyPrinciple,
  onLoadExample,
}: PrincipleCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {principle.icon}
          {principle.title}
        </CardTitle>
        <CardDescription>{principle.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {principle.examples.map((example, index) => (
            <Badge
              key={index}
              variant={activeExampleIndex === index ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onLoadExample(index)}
            >
              Example {index + 1}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Your Prompt</h4>
            <Textarea
              value={userPrompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Enter your prompt here..."
              className="min-h-[120px]"
            />
            <Button onClick={onApplyPrinciple} className="w-full" disabled={!userPrompt.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              Apply {principle.title}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Enhanced Prompt</h4>
            <Textarea
              value={enhancedPrompt}
              readOnly
              placeholder="Enhanced prompt will appear here..."
              className="min-h-[120px] bg-muted/50"
            />
          </div>
        </div>

        {userPrompt && enhancedPrompt && (
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Comparison</h4>
            <DiffView original={userPrompt} enhanced={enhancedPrompt} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Principle categories with their items
const principles = [
  {
    id: "clarity",
    name: "Clarity",
    icon: <MessageSquare className="h-4 w-4" />,
    items: [
      {
        id: "be-specific",
        title: "Be Specific and Clear",
        description: "Clearly state what you want. Vague prompts lead to vague responses.",
        icon: <Target className="h-4 w-4" />,
        examples: [
          {
            before: "Create a login form.",
            after:
              "Create a React login form with email and password fields, validation, error messages, and a submit button that calls an API endpoint.",
          },
          {
            before: "Write code for a website.",
            after:
              "Write HTML, CSS, and JavaScript code for a responsive landing page for a fitness app, including a hero section, features list, and contact form.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Simple enhancement function for demonstration
          if (prompt.length < 30) {
            return (
              prompt +
              " Please include specific details about the technology stack, required features, design preferences, and any constraints that should be considered."
            )
          }

          // If the prompt is already somewhat detailed
          return (
            prompt.replace(/\./g, ",") +
            ". Please ensure the solution is detailed, with clear specifications for implementation, visual design, and functionality."
          )
        },
      },
      {
        id: "use-examples",
        title: "Use Examples",
        description: "Provide examples of the kind of response you're looking for to clarify expectations.",
        icon: <Layers className="h-4 w-4" />,
        examples: [
          {
            before: "Generate a function to validate email addresses.",
            after:
              "Generate a function to validate email addresses. For example, it should accept 'user@example.com' but reject 'user@example' and 'user.example.com'. The function should return a boolean and handle edge cases like empty strings.",
          },
          {
            before: "Create a color palette for my website.",
            after:
              "Create a color palette for my website with 5 colors. For example, I like how Stripe uses a primary blue (#635BFF) with supporting colors. My brand is focused on sustainability and nature.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Add examples to the prompt
          if (!prompt.includes("For example") && !prompt.includes("for example")) {
            return (
              prompt +
              " For example, I'd like to see something similar to [specific example relevant to the request], but adapted to my specific needs with [particular customization]."
            )
          }

          // If already has examples, enhance them
          return (
            prompt +
            " Please provide multiple variations or approaches to solve this problem, with explanations of the trade-offs between them."
          )
        },
      },
    ],
  },
  {
    id: "specificity",
    name: "Specificity",
    icon: <Target className="h-4 w-4" />,
    items: [
      {
        id: "define-format",
        title: "Define the Format",
        description: "Specify the format you want for the response, such as a table, JSON, or markdown.",
        icon: <Layers className="h-4 w-4" />,
        examples: [
          {
            before: "List the top 5 JavaScript frameworks.",
            after:
              "List the top 5 JavaScript frameworks in a markdown table with columns for name, GitHub stars, key features, and learning curve (rated easy/medium/hard).",
          },
          {
            before: "Give me data about popular programming languages.",
            after:
              'Provide information about the top 3 programming languages in JSON format with the following structure: [{"name": "language name", "usagePercentage": number, "popularFrameworks": ["framework1", "framework2"], "learningCurve": "easy/medium/hard"}]',
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Add format specification
          if (
            !prompt.includes("format") &&
            !prompt.includes("table") &&
            !prompt.includes("JSON") &&
            !prompt.includes("markdown")
          ) {
            return (
              prompt +
              " Please provide the response in a structured format, preferably as a markdown table or JSON object with clearly defined properties."
            )
          }

          // If format is already specified, enhance it
          return (
            prompt +
            " Ensure the formatting is consistent and optimized for readability, with clear headings and organized sections."
          )
        },
      },
      {
        id: "set-constraints",
        title: "Set Constraints",
        description: "Establish boundaries for the response, such as word count, technical level, or tone.",
        icon: <Layers className="h-4 w-4" />,
        examples: [
          {
            before: "Explain how databases work.",
            after:
              "Explain how relational databases work in under 300 words, using analogies suitable for a high school student with no prior technical knowledge.",
          },
          {
            before: "Write a blog post about AI.",
            after:
              "Write a 500-word technical blog post about large language models for an audience of senior software engineers. Use a professional tone, include code examples in Python, and focus on recent advancements in the field.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Add constraints
          if (!prompt.includes("words") && !prompt.includes("technical") && !prompt.includes("tone")) {
            return (
              prompt +
              " Please limit the response to approximately 300-500 words, with a technical depth appropriate for [beginner/intermediate/advanced] users, and maintain a [formal/conversational/instructional] tone throughout."
            )
          }

          // If constraints are already specified, refine them
          return (
            prompt +
            " Additionally, ensure the content is well-structured with clear headings, concise paragraphs, and actionable takeaways."
          )
        },
      },
    ],
  },
  {
    id: "context",
    name: "Context",
    icon: <Layers className="h-4 w-4" />,
    items: [
      {
        id: "provide-background",
        title: "Provide Background Information",
        description: "Give relevant background information to help the model understand your specific situation.",
        icon: <Layers className="h-4 w-4" />,
        examples: [
          {
            before: "Help me debug my React component.",
            after:
              "Help me debug my React functional component that uses hooks. I'm getting this error: 'React Hook useEffect has a missing dependency'. I'm using useEffect to fetch data when a user ID changes, but the linter is warning me about missing dependencies.",
          },
          {
            before: "Suggest database improvements.",
            after:
              "Suggest improvements for my PostgreSQL database that's experiencing slow query performance. We have a table with 10 million rows of user transaction data, indexed on user_id and transaction_date. Queries filtering by date range and grouping by user are taking over 30 seconds to complete.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Add background information
          if (prompt.split(" ").length < 15) {
            return (
              prompt +
              " For context, I'm working on [type of project/application], using [technologies/frameworks], and my specific goal is to [objective]. The current situation is [description of current state/problem]."
            )
          }

          // If already has some context, enhance it
          return (
            prompt +
            " Additional context that might be helpful: my technical environment includes [relevant technologies], my experience level is [beginner/intermediate/advanced], and any solution needs to consider [specific constraints or requirements]."
          )
        },
      },
      {
        id: "specify-audience",
        title: "Specify the Audience",
        description: "Clarify who the response is for to get appropriate terminology and explanations.",
        icon: <Layers className="h-4 w-4" />,
        examples: [
          {
            before: "Explain how machine learning works.",
            after:
              "Explain how machine learning works to a team of marketers who have basic technical knowledge but no experience with data science. Use marketing-relevant examples and avoid complex mathematical explanations.",
          },
          {
            before: "Write documentation for my API.",
            after:
              "Write documentation for my REST API that will be used by junior frontend developers who are familiar with JavaScript but have limited experience with API integration. Include basic examples using fetch and explain common HTTP status codes they might encounter.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Add audience specification
          if (!prompt.includes("audience") && !prompt.includes("for a") && !prompt.includes("who are")) {
            return (
              prompt +
              " This is intended for an audience of [description of audience], who have [level of knowledge/experience] and are primarily interested in [their main concerns/interests]."
            )
          }

          // If audience is already specified, refine it
          return (
            prompt +
            " When addressing this audience, please use appropriate terminology, relevant examples, and a tone that will resonate with them specifically."
          )
        },
      },
    ],
  },
  {
    id: "iteration",
    name: "Iteration",
    icon: <RefreshCw className="h-4 w-4" />,
    items: [
      {
        id: "refine-gradually",
        title: "Refine Gradually",
        description: "Start with a basic prompt and iteratively refine it based on the responses.",
        icon: <RefreshCw className="h-4 w-4" />,
        examples: [
          {
            before: "Write a function to sort an array.",
            after:
              "I'm iteratively refining my request: First, I need a JavaScript function to sort an array of objects by a specific property. The previous solution worked, but now I need to handle nested properties like 'user.profile.age' and support both ascending and descending order with a parameter.",
          },
          {
            before: "Create a landing page.",
            after:
              "Based on your previous design for a SaaS landing page, I'd like to refine it further. The hero section looks great, but can we make the call-to-action more prominent? Also, the feature section would work better as a grid layout instead of the current list format, and I'd like to add customer testimonials between the features and pricing sections.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Transform into an iterative refinement
          return (
            "I'm iteratively refining my request: " +
            prompt +
            " Based on this initial request, I'd like to see a first version, which I can then provide feedback on to further refine and improve."
          )
        },
      },
      {
        id: "feedback-loop",
        title: "Create Feedback Loops",
        description: "Provide feedback on what aspects of the response work well and what needs improvement.",
        icon: <RefreshCw className="h-4 w-4" />,
        examples: [
          {
            before: "Rewrite this function to be more efficient.",
            after:
              "I like how you simplified my database query function, especially the use of prepared statements for security. However, it's still not handling connection pooling effectively. Could you revise it to properly release connections back to the pool and add error handling specifically for connection timeout scenarios?",
          },
          {
            before: "Improve this CSS.",
            after:
              "Thanks for the responsive CSS improvements. The mobile layout works great now, and I appreciate the use of CSS variables for the color scheme. However, the animations are too resource-intensive on mobile devices. Could you optimize them to be more performance-friendly while maintaining a similar visual effect? Also, the form elements still don't align properly in Safari.",
          },
        ],
        enhancementFunction: (prompt: string) => {
          // Transform into feedback
          return (
            "Regarding the previous response about " +
            prompt +
            " I appreciate [specific aspect that was good], which effectively addressed my needs. However, I'd like to see improvements in [specific aspect to improve], perhaps by [suggested approach]. Additionally, could you also address [new aspect] which wasn't covered in the initial response?"
          )
        },
      },
    ],
  },
]

