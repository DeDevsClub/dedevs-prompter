"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export function EnhancementSettings() {
  const [settings, setSettings] = useState({
    specificityLevel: 75,
    includeExamples: true,
    addStructure: true,
    clarifyRequirements: true,
    optimizeForModel: "gpt-4o",
    focusOnPerformance: false,
    suggestTesting: true,
  })

  const { toast } = useToast()

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to localStorage or a backend
    toast({
      title: "Settings saved",
      description: "Your enhancement preferences have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhancement Settings</CardTitle>
        <CardDescription>Customize how your prompts are enhanced</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="specificity">Specificity Level</Label>
            <span className="text-sm text-muted-foreground">{settings.specificityLevel}%</span>
          </div>
          <Slider
            id="specificity"
            min={0}
            max={100}
            step={5}
            value={[settings.specificityLevel]}
            onValueChange={(value) => setSettings({ ...settings, specificityLevel: value[0] })}
          />
          <p className="text-xs text-muted-foreground">Higher values will produce more detailed and specific prompts</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="examples">Include Code Examples</Label>
              <p className="text-xs text-muted-foreground">Add example snippets to clarify intent</p>
            </div>
            <Switch
              id="examples"
              checked={settings.includeExamples}
              onCheckedChange={(checked) => setSettings({ ...settings, includeExamples: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="structure">Add Structure</Label>
              <p className="text-xs text-muted-foreground">Organize prompts into clear sections</p>
            </div>
            <Switch
              id="structure"
              checked={settings.addStructure}
              onCheckedChange={(checked) => setSettings({ ...settings, addStructure: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requirements">Clarify Requirements</Label>
              <p className="text-xs text-muted-foreground">Identify and expand on ambiguous requirements</p>
            </div>
            <Switch
              id="requirements"
              checked={settings.clarifyRequirements}
              onCheckedChange={(checked) => setSettings({ ...settings, clarifyRequirements: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="performance">Focus on Performance</Label>
              <p className="text-xs text-muted-foreground">Emphasize performance considerations in prompts</p>
            </div>
            <Switch
              id="performance"
              checked={settings.focusOnPerformance}
              onCheckedChange={(checked) => setSettings({ ...settings, focusOnPerformance: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="testing">Suggest Testing Approaches</Label>
              <p className="text-xs text-muted-foreground">Include testing considerations in enhanced prompts</p>
            </div>
            <Switch
              id="testing"
              checked={settings.suggestTesting}
              onCheckedChange={(checked) => setSettings({ ...settings, suggestTesting: checked })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Optimize For Model</Label>
          <Select
            value={settings.optimizeForModel}
            onValueChange={(value) => setSettings({ ...settings, optimizeForModel: value })}
          >
            <SelectTrigger id="model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
              <SelectItem value="llama-3">Llama 3</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Tailor prompts for specific AI model capabilities</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} className="w-full">
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

