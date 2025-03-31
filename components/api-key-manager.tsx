"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Key, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { encryptData, decryptData } from "@/lib/encryption"
import { InfoPopover } from "@/components/info-popover"

interface ApiKeyManagerProps {
  onApiKeyChange?: (apiKey: string | null) => void
  onSaveSuccess?: () => void
}

export function ApiKeyManager({ onApiKeyChange, onSaveSuccess }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [rememberKey, setRememberKey] = useState(true)
  const { toast } = useToast()

  // Load saved API key on component mount
  useEffect(() => {
    const loadSavedApiKey = async () => {
      try {
        const encryptedKey = localStorage.getItem("openai_api_key")
        if (encryptedKey) {
          const decryptedKey = await decryptData(encryptedKey)
          setApiKey(decryptedKey)
          setIsSaved(true)
          if (onApiKeyChange) onApiKeyChange(decryptedKey)
        }
      } catch (error) {
        console.error("Error loading API key:", error)
        localStorage.removeItem("openai_api_key")
      }
    }

    loadSavedApiKey()
  }, [onApiKeyChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value
    setApiKey(newKey)
  }

  const saveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an OpenAI API key to save.",
        variant: "destructive",
      })
      return
    }

    try {
      if (rememberKey) {
        // Encrypt the API key before storing
        const encryptedKey = await encryptData(apiKey)
        localStorage.setItem("openai_api_key", encryptedKey)
      } else {
        // If user doesn't want to remember, remove from storage
        localStorage.removeItem("openai_api_key")
      }

      setIsSaved(true)
      if (onApiKeyChange) onApiKeyChange(apiKey)

      toast({
        title: "API Key Saved",
        description: rememberKey
          ? "Your API key has been securely saved in this browser."
          : "Your API key will be used for this session only.",
      })

      // Call the onSaveSuccess callback after successful save
      if (onSaveSuccess) {
        onSaveSuccess()
      }
    } catch (error) {
      toast({
        title: "Error Saving API Key",
        description: "Failed to save your API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearApiKey = () => {
    setApiKey("")
    setIsSaved(false)
    localStorage.removeItem("openai_api_key")
    if (onApiKeyChange) onApiKeyChange(null)

    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed from this browser.",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">
              <Key className="h-5 w-5 inline mr-2" />
              OpenAI API Key
            </CardTitle>
          </div>
          <InfoPopover
            content={
              <div className="space-y-3">
                <p className="text-sm">
                  An OpenAI API key is required to use the prompt enhancement features. You can get one from your OpenAI
                  account dashboard.
                </p>
                <p className="text-sm">
                  Your API key is stored securely in your browser using encryption. It's never sent to our servers.
                </p>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline block mt-2"
                >
                  Get an API key from OpenAI →
                </a>
              </div>
            }
            title="About API Keys"
            description="Required for using OpenAI's services"
          />
        </div>
        <CardDescription>Required to use the prompt enhancement features</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="apiKey">Your OpenAI API Key</Label>
            <InfoPopover
              content={
                <div className="space-y-2">
                  <p className="text-sm">
                    Enter your OpenAI API key here. You can find your API key in your OpenAI account dashboard.
                  </p>
                </div>
              }
              title="API Key"
              iconSize="sm"
            />
          </div>
          <div className="relative">
            <Input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={handleInputChange}
              className="pr-10"
              aria-describedby="api-key-description"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p id="api-key-description" className="text-xs text-muted-foreground">
            Enter your API key from the OpenAI platform
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="remember-key" checked={rememberKey} onCheckedChange={setRememberKey} />
          <div className="flex items-center gap-2">
            <Label htmlFor="remember-key" className="text-sm cursor-pointer">
              Remember API key in this browser
            </Label>
            <InfoPopover
              content={
                <p className="text-sm">
                  When enabled, your API key will be encrypted and stored in your browser's local storage. This means
                  you won't need to enter it again when you return to this page.
                </p>
              }
              title="Remember API Key"
              iconSize="sm"
            />
          </div>
        </div>

        <Alert className="py-2">
          <Shield className="h-4 w-4" />
          <AlertTitle className="text-sm">Security Note</AlertTitle>
          <AlertDescription className="text-xs">
            Your API key will be encrypted before storing in your browser. Never share your API key or expose it in
            client-side code.
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" onClick={clearApiKey} disabled={!apiKey} size="sm">
          Clear
        </Button>
        <Button onClick={saveApiKey} disabled={!apiKey || isSaved} size="sm">
          {isSaved ? "Update" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  )
}

