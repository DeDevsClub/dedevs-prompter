"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code, Menu, Github, Twitter, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-gray-950/90 backdrop-blur-md border-b shadow-xs" : "bg-gray-950 border-b border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with outline effect */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-[#000000] p-1.5 text-white ring-2 ring-dedevs-pink/30 ring-offset-1 ring-offset-background transition-all hover:ring-dedevs-cyan/50">
              <Code className="h-5 w-5" />
            </div>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Link href="https://x.com/DeDevsClub" target="_blank" rel="noopener noreferrer" className="hidden sm:flex">
            <div className="rounded-lg bg-[#000000] p-1.5 text-white ring-2 ring-dedevs-pink/30 ring-offset-1 ring-offset-background transition-all hover:ring-dedevs-cyan/50">
              <Twitter className="h-5 w-5" />
            </div>
          </Link>

          <Link
            href="https://github.com/DeDevsClub/dedevs-prompter"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex"
          >
            <div className="rounded-lg bg-[#000000] p-1.5 text-white ring-2 ring-dedevs-pink/30 ring-offset-1 ring-offset-background transition-all hover:ring-dedevs-cyan/50">
              <Github className="h-5 w-5" />
            </div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <div className="sm:hidden rounded-lg bg-[#000000] p-1.5 text-white ring-2 ring-dedevs-pink/30 ring-offset-1 ring-offset-background transition-all hover:ring-dedevs-cyan/50">
                <Menu className="h-5 w-5" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] h-[224px] rounded-lg sm:w-[300px] justify-between">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-center py-4">DeDevs | Prompter</div>

                <div className="mt-auto pb-8">
                  <Link
                    href="https://dedevs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    DeDevs Club
                  </Link>
                  <Link
                    href="https://x.com/DeDevsClub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    <Twitter className="h-4 w-4 mr-2" />X (fka Twitter)
                  </Link>
                  <Link
                    href="https://github.com/DeDevsClub/dedevs-prompter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

