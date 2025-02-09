"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePaste = () => {
    const audio = new Audio("/sounds/paste.mp3")
    audio.play()
  }

  if (!mounted) return null

  return (
    <motion.div
      className="space-y-2 sm:space-y-4 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-primary-foreground">Input</h2>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder="Type your markdown here..."
        className="h-[calc(100%-32px)] sm:h-[calc(100%-40px)] w-full resize-none font-mono text-sm sm:text-base p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all backdrop-blur-sm bg-card/50 text-primary-foreground placeholder-primary-foreground/50 custom-scrollbar"
      />
    </motion.div>
  )
}

