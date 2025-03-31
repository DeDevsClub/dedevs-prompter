"use client"

import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface HistoryItem {
  original: string
  enhanced: string
  timestamp: Date
}

interface PromptHistoryProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
}

export function PromptHistory({ history, onSelect }: PromptHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
          <CardDescription>Your enhanced prompts will be saved here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground">No history yet</p>
            <p className="text-sm text-muted-foreground">
              Enhanced prompts will appear here after you use the enhancer
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt History</CardTitle>
        <CardDescription>Your previous enhanced prompts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card key={index} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelect(item)}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-base line-clamp-1">
                        {item.original.substring(0, 60)}
                        {item.original.length > 60 ? "..." : ""}
                      </CardTitle>
                      <CardDescription>{formatDistanceToNow(item.timestamp, { addSuffix: true })}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(item)
                      }}
                    >
                      Load
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

