"use client"


import { toast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { marked } from "marked"

// Helper function to play sound effects
const playSound = (soundFile: string) => {
  const audio = new Audio(soundFile)
  audio.play()
}

// Function to copy content to clipboard
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
    toast({ title: "Success", description: "Copied to clipboard!" })
    playSound("/sounds/copy.mp3")
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    toast({ title: "Success", description: "Copied to clipboard!" })
    playSound("/sounds/copy.mp3")
  }
}

// Function to format content for export
export const getFormattedContent = (element: HTMLElement): string => {
  const clone = element.cloneNode(true) as HTMLElement

  // Define styles for different HTML elements
  const styleMap = {
    h1: "font-size: 24pt; font-weight: bold;",
    h2: "font-size: 18pt; font-weight: bold;",
    h3: "font-size: 14pt; font-weight: bold;",
    p: "font-size: 12pt; margin-bottom: 1em;",
    ul: "margin-left: 2em; margin-bottom: 1em;",
    li: "margin-bottom: 0.5em;",
  } as const

  // Define type for keys of styleMap
  type StyleMapKey = keyof typeof styleMap

  // Replace HTML tags with styled versions
  return clone.innerHTML.replace(/<(h[1-3]|p|ul|li)([^>]*)>/g, (_, tag, attrs) => {
    const validTag = tag as StyleMapKey
    const newTag = validTag === "h1" || validTag === "h2" || validTag === "h3" ? "p" : validTag
    return `<${newTag} style="${styleMap[validTag]}"${attrs}>`
  })
}

// Function to generate PDF
export const generatePDF = async (element: HTMLElement): Promise<void> => {
  const a4Width = 210
  const a4Height = 297
  const pixelsPerMm = 96 / 25.4
  const widthInPx = a4Width * pixelsPerMm
  const heightInPx = a4Height * pixelsPerMm

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Function to split content into pages
  const splitContentIntoPages = async (element: HTMLElement) => {
    let position = 0
    let pageNumber = 1

    while (position < element.scrollHeight) {
      const canvas = await html2canvas(element, {
        scale: 2,
        width: widthInPx,
        height: heightInPx,
        windowWidth: widthInPx,
        windowHeight: heightInPx,
        y: position,
      })

      const imgData = canvas.toDataURL("image/jpeg", 1.0)

      if (pageNumber > 1) {
        pdf.addPage()
      }
      pdf.addImage(imgData, "JPEG", 0, 0, a4Width, a4Height)

      position += heightInPx
      pageNumber++
    }
  }

  await splitContentIntoPages(element)

  // Add clickable links to the PDF
  element.querySelectorAll("a").forEach((link) => {
    const rect = link.getBoundingClientRect()
    pdf.link(rect.left, rect.top, rect.width, rect.height, { url: link.href })
  })

  pdf.save("document.pdf")
  toast({ title: "Success", description: "PDF generated successfully!" })
  playSound("/sounds/success.mp3")
}

// Function to export file (Markdown or HTML)
const exportFile = async (content: string, type: "markdown" | "html") => {
  const fileType = type === "markdown" ? "text/markdown" : "text/html"
  const fileName = type === "markdown" ? "document.md" : "document.html"
  const fileContent = type === "markdown" ? content : await marked(content)

  const blob = new Blob([fileContent], { type: fileType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast({
    title: "Success",
    description: `${type.charAt(0).toUpperCase() + type.slice(1)} file exported successfully!`,
  })
  playSound("/sounds/success.mp3")
}

// Export functions for Markdown and HTML
export const exportToMarkdown = (content: string) => exportFile(content, "markdown")
export const exportToHTML = (content: string) => exportFile(content, "html")

