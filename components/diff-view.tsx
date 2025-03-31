"use client"

import { useState, useEffect } from "react"
import { diffWords } from "diff"
import { Card } from "@/components/ui/card"

interface DiffViewProps {
  original: string
  enhanced: string
}

export function DiffView({ original, enhanced }: DiffViewProps) {
  const [diff, setDiff] = useState<any[]>([])

  useEffect(() => {
    if (original && enhanced) {
      const differences = diffWords(original, enhanced)
      setDiff(differences)
    }
  }, [original, enhanced])

  return (
    <div className="space-y-4">
      <Card className="p-4 text-sm font-mono whitespace-pre-wrap">
        {diff.map((part, index) => {
          // Added text (in enhanced but not in original)
          if (part.added) {
            return (
              <span key={index} className="bg-green-100 dark:bg-green-900/30 text-black">
                {part.value}
              </span>
            )
          }
          // Removed text (in original but not in enhanced)
          if (part.removed) {
            return (
              <span key={index} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through">
                {part.value}
              </span>
            )
          }
          // Unchanged text
          return <span key={index}>{part.value}</span>
        })}
      </Card>

      <div className="flex text-xs text-muted-foreground">
        <div className="flex items-center mr-4">
          <span className="inline-block w-3 h-3 bg-green-100 dark:bg-green-900/30 mr-1"></span>
          <span>Added</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-100 dark:bg-red-900/30 mr-1"></span>
          <span>Removed</span>
        </div>
      </div>
    </div>
  )
}

