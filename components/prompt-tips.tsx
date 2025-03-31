"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { InteractivePrinciplesGuide } from "@/components/interactive-principles-guide"

export function PromptTips() {
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The example has been copied to your clipboard.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Engineering Best Practices</CardTitle>
        <CardDescription>Learn how to craft effective prompts for better results</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="principles">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="principles">Principles</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="principles">
            <InteractivePrinciplesGuide />
          </TabsContent>

          <TabsContent value="techniques">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-medium">Role Prompting</h3>
                  <p className="text-muted-foreground mt-1">
                    Ask the model to assume a specific role or perspective. This helps frame the response in the context
                    of that role's expertise.
                  </p>
                  <div className="bg-muted p-3 rounded-md mt-2 text-sm">
                    <p>
                      <strong>Example:</strong> "As an experienced software architect, review this system design and
                      suggest improvements..."
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Chain-of-Thought</h3>
                  <p className="text-muted-foreground mt-1">
                    Ask the model to work through a problem step by step. This is particularly useful for complex
                    reasoning tasks.
                  </p>
                  <div className="bg-muted p-3 rounded-md mt-2 text-sm">
                    <p>
                      <strong>Example:</strong> "Think through this problem step by step: How would you design a
                      scalable authentication system for a multi-tenant SaaS application?"
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Few-Shot Learning</h3>
                  <p className="text-muted-foreground mt-1">
                    Provide a few examples of the input-output pairs you expect. This helps the model understand the
                    pattern you want it to follow.
                  </p>
                  <div className="bg-muted p-3 rounded-md mt-2 text-sm">
                    <p>
                      <strong>Example:</strong>
                    </p>
                    <p>Input: "Create a login form"</p>
                    <p>Output: [Detailed component with validation]</p>
                    <p>Input: "Build a navigation menu"</p>
                    <p>Output: [Responsive navigation component]</p>
                    <p>Now, input: "Design a user profile page"</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Persona-Based Prompting</h3>
                  <p className="text-muted-foreground mt-1">
                    Define a specific user persona that the model should target in its response. This helps tailor the
                    content to a specific audience.
                  </p>
                  <div className="bg-muted p-3 rounded-md mt-2 text-sm">
                    <p>
                      <strong>Example:</strong> "Create documentation for a REST API that will be used by junior
                      developers who are familiar with JavaScript but new to API integration."
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Template Prompting</h3>
                  <p className="text-muted-foreground mt-1">
                    Use a consistent template structure for similar tasks. This helps maintain consistency across
                    multiple prompts.
                  </p>
                  <div className="bg-muted p-3 rounded-md mt-2 text-sm">
                    <p>
                      <strong>Example:</strong>
                    </p>
                    <p>Task: [Specific task]</p>
                    <p>Context: [Relevant background]</p>
                    <p>Requirements: [List of requirements]</p>
                    <p>Format: [Desired output format]</p>
                    <p>Constraints: [Any limitations]</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="examples">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6 py-4">
                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">React Component Example</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(reactComponentExample)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                    <CardDescription>Before and after enhancement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium">Original Prompt:</h4>
                        <p className="text-sm text-muted-foreground mt-1 bg-muted p-2 rounded">
                          Create a dropdown menu component.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Enhanced Prompt:</h4>
                        <p className="text-sm mt-1 bg-muted p-2 rounded">{reactComponentExample}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">API Integration Example</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(apiIntegrationExample)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                    <CardDescription>Before and after enhancement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium">Original Prompt:</h4>
                        <p className="text-sm text-muted-foreground mt-1 bg-muted p-2 rounded">
                          Show me how to fetch data from an API.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Enhanced Prompt:</h4>
                        <p className="text-sm mt-1 bg-muted p-2 rounded">{apiIntegrationExample}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">Database Query Example</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => copyToClipboard(databaseQueryExample)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                    <CardDescription>Before and after enhancement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium">Original Prompt:</h4>
                        <p className="text-sm text-muted-foreground mt-1 bg-muted p-2 rounded">
                          Write a query to get user data.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Enhanced Prompt:</h4>
                        <p className="text-sm mt-1 bg-muted p-2 rounded">{databaseQueryExample}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Example prompts for the Examples tab
const reactComponentExample = `Create a responsive dropdown menu component using React and Tailwind CSS with the following specifications:

1. FUNCTIONALITY:
  - The dropdown should toggle open/closed when clicking a trigger button
  - Include support for both hover and click interactions
  - Implement keyboard navigation (arrow keys, escape to close)
  - Add proper focus management for accessibility

2. VISUAL DESIGN:
  - Style using Tailwind CSS classes
  - Include a subtle animation for opening/closing
  - Support both light and dark mode
  - Add a small arrow/chevron indicator that rotates when open

3. COMPONENT STRUCTURE:
  - Create a reusable component that accepts custom menu items as children
  - Include TypeScript types/interfaces for all props
  - Implement proper event handling for clicks outside to close

4. ACCESSIBILITY:
  - Add appropriate ARIA attributes
  - Ensure keyboard navigability
  - Include proper focus management

Please provide the complete component code with comments explaining key implementation details.
`

const apiIntegrationExample = `I want to fetch data from the JSONPlaceholder API's /todos endpoint and display it in a React component. The component should:

1.  Fetch the data on component mount.
2.  Display a loading state while fetching.
3.  Handle potential errors gracefully (e.g., display an error message).
4.  Display the data in a simple list format.
5.  Use async/await for cleaner code.
6.  Include TypeScript types for the API response.

Please provide the complete React component code.
`

const databaseQueryExample = `I need a SQL query to retrieve all users from a "users" table who have a role of "admin" and whose last login was within the last 7 days. The table has the following columns:

-   id (INT, primary key)
-   username (VARCHAR)
-   email (VARCHAR)
-   password (VARCHAR)
-   role (VARCHAR)
-   last\_login (TIMESTAMP)
-   created\_at (TIMESTAMP)
-   updated\_at (TIMESTAMP)

The query should:

1.  Select all columns from the "users" table.
2.  Filter users by "role" = 'admin'.
3.  Filter users whose "last\_login" is within the last 7 days.
4.  Be compatible with PostgreSQL.

Please provide the SQL query.
`

