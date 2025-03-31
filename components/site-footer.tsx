"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background py-4 md:py-6">
      <div className="container flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center">
          <span className="text-muted-foreground">© {new Date().getFullYear()} DeDevs Prompter</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Created with</span>
          <Heart className="h-4 w-4 text-dedevs-pink" fill="#f300a8" />
          <span className="text-muted-foreground">by</span>
          <Link
            href="https://dedevs.club"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-medium transition-colors",
              "bg-clip-text text-transparent bg-linear-to-r from-dedevs-pink to-dedevs-cyan",
              "hover:from-dedevs-pink-light hover:to-dedevs-cyan-light",
            )}
          >
            DeDevs Club
          </Link>
        </div>
      </div>
    </footer>
  )
}

