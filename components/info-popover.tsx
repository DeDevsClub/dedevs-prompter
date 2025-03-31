"use client"

import type React from "react"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InfoPopoverProps {
  /**
   * The content to display in the popover
   */
  content: React.ReactNode
  /**
   * Optional title for the popover
   */
  title?: string
  /**
   * Optional description text below the title
   */
  description?: string
  /**
   * Optional CSS class for the trigger button
   */
  triggerClassName?: string
  /**
   * Optional CSS class for the popover content
   */
  contentClassName?: string
  /**
   * Optional icon to use instead of the default HelpCircle
   */
  icon?: React.ReactNode
  /**
   * Optional position for the popover
   */
  position?: "top" | "right" | "bottom" | "left"
  /**
   * Optional size for the icon
   */
  iconSize?: "sm" | "md" | "lg"
  /**
   * Optional width for the popover content
   */
  width?: "auto" | "sm" | "md" | "lg" | "xl"
  /**
   * Whether to show the popover on hover (in addition to click)
   */
  showOnHover?: boolean
  /**
   * Optional ID for accessibility
   */
  id?: string
  /**
   * Optional aria-label for the trigger button
   */
  ariaLabel?: string
}

export function InfoPopover({
  content,
  title,
  description,
  triggerClassName,
  contentClassName,
  icon,
  position = "right",
  iconSize = "md",
  width = "md",
  showOnHover = true,
  id,
  ariaLabel = "More information",
}: InfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Map iconSize to actual size classes
  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  // Map width to actual width classes
  const widthClasses = {
    auto: "w-auto",
    sm: "w-60",
    md: "w-80",
    lg: "w-96",
    xl: "w-[30rem]",
  }

  // Map position to align and side values
  const positionProps = {
    top: { align: "center" as const, side: "top" as const },
    right: { align: "start" as const, side: "right" as const },
    bottom: { align: "center" as const, side: "bottom" as const },
    left: { align: "start" as const, side: "left" as const },
  }

  // Handle mouse enter/leave for hover functionality
  const handleMouseEnter = () => {
    if (showOnHover) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (showOnHover) {
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full p-0 hover:bg-muted/80 focus-visible:ring-1 focus-visible:ring-ring",
              isOpen && "bg-muted text-primary",
              triggerClassName,
            )}
            id={id}
            aria-label={ariaLabel}
          >
            {icon || <HelpCircle className={iconSizeClasses[iconSize]} />}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className={cn("p-0 shadow-md", widthClasses[width], contentClassName)}
        align={positionProps[position].align}
        side={positionProps[position].side}
        sideOffset={8}
      >
        <div className="space-y-2 p-4">
          {title && <h4 className="font-medium">{title}</h4>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <div className={cn(!title && !description && "mt-0", "mt-2")}>{content}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

