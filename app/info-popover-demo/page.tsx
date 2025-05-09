"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoPopover } from "@/components/info-popover"
import { AlertCircle, Info, HelpCircle, BookOpen } from "lucide-react"
import Image from "next/image"

export default function InfoPopoverDemo() {
  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Info Popover Component</h1>
        <p className="text-muted-foreground">A reusable component for displaying helpful information in popovers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
            <CardDescription>Simple text popover with default settings</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <span>Need help with this feature?</span>
            <InfoPopover
              content={
                <p className="text-sm">
                  This is a basic info popover that provides additional context when users need help.
                </p>
              }
              title="Help Information"
              description="Here's some helpful information about this feature."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Icons</CardTitle>
            <CardDescription>Using different icons for different contexts</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Info</span>
              <InfoPopover
                icon={<Info className="h-5 w-5" />}
                content={<p className="text-sm">Informational message about a feature.</p>}
                title="Information"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Warning</span>
              <InfoPopover
                icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                content={<p className="text-sm">Warning about potential issues.</p>}
                title="Warning"
                triggerClassName="text-amber-500 hover:text-amber-600"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Help</span>
              <InfoPopover
                icon={<HelpCircle className="h-5 w-5 text-blue-500" />}
                content={<p className="text-sm">Help and guidance for users.</p>}
                title="Help"
                triggerClassName="text-blue-500 hover:text-blue-600"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Docs</span>
              <InfoPopover
                icon={<BookOpen className="h-5 w-5 text-green-500" />}
                content={<p className="text-sm">Documentation and reference materials.</p>}
                title="Documentation"
                triggerClassName="text-green-500 hover:text-green-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Different Positions</CardTitle>
            <CardDescription>Popovers can appear in different positions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap justify-center items-center gap-8 py-8">
            <InfoPopover
              content={<p className="text-sm">Popover appears above the icon</p>}
              title="Top Position"
              position="top"
            />
            <InfoPopover
              content={<p className="text-sm">Popover appears to the right of the icon</p>}
              title="Right Position"
              position="right"
            />
            <InfoPopover
              content={<p className="text-sm">Popover appears below the icon</p>}
              title="Bottom Position"
              position="bottom"
            />
            <InfoPopover
              content={<p className="text-sm">Popover appears to the left of the icon</p>}
              title="Left Position"
              position="left"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Different Sizes</CardTitle>
            <CardDescription>Icons and popovers in various sizes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1">
              <span>Small</span>
              <InfoPopover
                content={<p className="text-sm">Small icon and narrow popover</p>}
                iconSize="sm"
                width="sm"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Medium</span>
              <InfoPopover
                content={<p className="text-sm">Medium icon and standard popover</p>}
                iconSize="md"
                width="md"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Large</span>
              <InfoPopover content={<p className="text-sm">Large icon and wide popover</p>} iconSize="lg" width="lg" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rich Content</CardTitle>
            <CardDescription>Popovers can contain various types of content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span>With image and links</span>
              <InfoPopover
                content={
                  <div className="space-y-3">
                    <div className="aspect-video relative overflow-hidden rounded-md">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="Example image"
                        width={400}
                        height={200}
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm">This popover contains an image and links.</p>
                    <div className="text-sm text-blue-500 hover:underline">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Learn more
                      </a>
                    </div>
                  </div>
                }
                title="Rich Content Example"
                width="lg"
              />
            </div>

            <div className="flex items-center gap-2">
              <span>With list and code</span>
              <InfoPopover
                content={
                  <div className="space-y-3">
                    <p className="text-sm">Key features:</p>
                    <ul className="text-sm list-disc pl-5 space-y-1">
                      <li>Customizable appearance</li>
                      <li>Multiple positioning options</li>
                      <li>Support for rich content</li>
                    </ul>
                    <div className="bg-muted p-2 rounded text-xs font-mono">
                      {"<InfoPopover content={<p>Hello world</p>} />"}
                    </div>
                  </div>
                }
                title="Advanced Usage"
                width="lg"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Integration</CardTitle>
            <CardDescription>Using popovers to explain form fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="api-key" className="text-sm font-medium">
                    API Key
                  </label>
                  <InfoPopover
                    content={
                      <p className="text-sm">
                        Your API key is a secret identifier that authenticates your requests. Keep it confidential and
                        never share it publicly.
                      </p>
                    }
                    title="About API Keys"
                    iconSize="sm"
                  />
                </div>
                <input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="model" className="text-sm font-medium">
                    AI Model
                  </label>
                  <InfoPopover
                    content={
                      <div className="space-y-2">
                        <p className="text-sm">Different models have different capabilities and pricing:</p>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>
                            <strong>GPT-4o:</strong> Most capable, best for complex tasks
                          </li>
                          <li>
                            {/* <strong>GPT-3.5:</strong> Faster and more cost-effective */}
                          </li>
                        </ul>
                      </div>
                    }
                    title="Model Selection"
                    iconSize="sm"
                  />
                </div>
                <select id="model" className="w-full px-3 py-2 border rounded-md text-sm">
                  <option value="gpt-4o">GPT-4o</option>
                  {/* <option value="gpt-3.5">GPT-3.5 Turbo</option> */}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

