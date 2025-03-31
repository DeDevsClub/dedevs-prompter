"use client"

import type React from "react"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PromptHistoryItemProps {
  item: {
    original: string
    enhanced: string
    timestamp: Date
  }
  onSelect: (item: { original: string; enhanced: string }) => void
}

export function PromptHistoryItem({ item, onSelect }: PromptHistoryItemProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "The prompt has been copied to your clipboard.",
    })
  }

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelect(item)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(item.timestamp, { addSuffix: true })}
          </span>
          <Button variant="ghost" size="sm" onClick={() => onSelect(item)}>
            <ArrowUpRight className="h-4 w-4" />
            <span className="sr-only">Load</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Original</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => copyToClipboard(item.original, e)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy original</span>
              </Button>
            </div>
            <div className="text-sm line-clamp-2 text-muted-foreground">{item.original}</div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Enhanced</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => copyToClipboard(item.enhanced, e)}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy enhanced</span>
              </Button>
            </div>
            <div className="text-sm line-clamp-2">{item.enhanced}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

