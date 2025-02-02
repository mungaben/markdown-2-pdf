"use client"

import { Button } from "@/components/ui/button"
import { Check, FileText, FileCode } from "lucide-react"
import { useState } from "react"

import { copyToClipboard, getFormattedContent } from "@/lib/copyutils"
import { useToast } from "@/hooks/use-toast"

interface CopyButtonProps {
  format: "text" | "formatted"
}

export function CopyButton({ format }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      const element = document.getElementById("markdown-preview")
      if (!element) return

      let content: string
      if (format === "formatted") {
        content = getFormattedContent(element)
      } else {
        content = element.innerText
      }

      await copyToClipboard(content)
      setIsCopied(true)

      toast({
        title: "Copied!",
        description:
          format === "formatted" ? "Formatted content copied to clipboard" : "Plain text copied to clipboard",
      })

      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
      {isCopied ? (
        <Check className="h-4 w-4" />
      ) : format === "formatted" ? (
        <FileCode className="h-4 w-4" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      Copy {format === "formatted" ? "Formatted" : "Text"}
    </Button>
  )
}

