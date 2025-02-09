"use client"

import { toast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import { marked } from "marked"
import pptxgen from "pptxgenjs"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from "docx"

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
    h1: "font-size: 24pt; font-weight: bold; margin-bottom: 12pt;",
    h2: "font-size: 18pt; font-weight: bold; margin-top: 14pt; margin-bottom: 10pt;",
    h3: "font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 8pt;",
    p: "font-size: 11pt; margin-bottom: 8pt; line-height: 1.5;",
    ul: "margin-left: 20pt; margin-bottom: 8pt;",
    ol: "margin-left: 20pt; margin-bottom: 8pt;",
    li: "margin-bottom: 4pt;",
  } as const

  // Define type for keys of styleMap
  type StyleMapKey = keyof typeof styleMap

  // Replace HTML tags with styled versions
  return clone.innerHTML.replace(/<(h[1-3]|p|ul|ol|li)([^>]*)>/g, (_, tag, attrs) => {
    const validTag = tag as StyleMapKey
    return `<${validTag} style="${styleMap[validTag]}"${attrs}>`
  })
}

export const generatePDF = async (element: HTMLElement, content: string): Promise<void> => {
  let fileName = prompt("Enter a name for your PDF file:", getDefaultFileName(content, "pdf"))

  if (!fileName) {
    fileName = getDefaultFileName(content, "pdf")
  }

  fileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const margins = 15 // margins in mm

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL("image/jpeg", 1.0)
  const imgWidth = pdfWidth - margins * 2
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, "JPEG", margins, margins, imgWidth, imgHeight)
  heightLeft -= pdfHeight - margins * 2

  while (heightLeft > 0) {
    position += pdfHeight - margins * 2
    pdf.addPage()
    pdf.addImage(imgData, "JPEG", margins, -(position - margins), imgWidth, imgHeight)
    heightLeft -= pdfHeight - margins * 2
  }

  pdf.save(fileName)

  toast({ title: "Success", description: `PDF "${fileName}" generated successfully!` })
  playSound("/sounds/success.mp3")
}

export const generatePPTX = async (content: string): Promise<void> => {
  const pptx = new pptxgen()
  const parsedContent = marked.lexer(content)

  let slide = pptx.addSlide()
  let yPos = 0.5

  parsedContent.forEach((item: any) => {
    switch (item.type) {
      case "heading":
        if (yPos > 4.5) {
          slide = pptx.addSlide()
          yPos = 0.5
        }
        slide.addText(item.text, {
          x: 0.5,
          y: yPos,
          w: "90%",
          fontSize: 24 - item.depth * 2,
          bold: true,
          color: "363636",
        })
        yPos += 0.5
        break
      case "paragraph":
        if (yPos > 5) {
          slide = pptx.addSlide()
          yPos = 0.5
        }
        slide.addText(item.text, {
          x: 0.5,
          y: yPos,
          w: "90%",
          fontSize: 14,
          color: "363636",
        })
        yPos += 0.4
        break
      case "list":
        item.items.forEach((listItem: string) => {
          if (yPos > 5) {
            slide = pptx.addSlide()
            yPos = 0.5
          }
          slide.addText(listItem, {
            x: 0.7,
            y: yPos,
            w: "85%",
            fontSize: 14,
            color: "363636",
            bullet: { type: "bullet" },
          })
          yPos += 0.3
        })
        break
    }
  })

  const fileName = getDefaultFileName(content, "pptx")
  await pptx.writeFile({ fileName })

  toast({ title: "Success", description: `PowerPoint "${fileName}" generated successfully!` })
  playSound("/sounds/success.mp3")
}

export const generateWord = async (content: string): Promise<void> => {
  const parsedContent = marked.lexer(content)

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24,
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              line: 276,
              before: 0,
              after: 200,
            },
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 36,
            bold: true,
            color: "000000",
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 32,
            bold: true,
            color: "000000",
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28,
            bold: true,
            color: "000000",
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: parsedContent.map((item: any) => {
          switch (item.type) {
            case "heading":
              const headingLevel = `HEADING_${item.depth}` as keyof typeof HeadingLevel
              return new Paragraph({
                text: item.text,
                heading: HeadingLevel[headingLevel],
                style: `Heading${item.depth}`,
              })
            case "paragraph":
              return new Paragraph({
                children: [new TextRun(item.text)],
                style: "Normal",
              })
            case "list":
              return new Table({
                width: {
                  size: 100,
                  type: "pct",
                },
                rows: item.items.map(
                  (listItem: string) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph("•")],
                          width: {
                            size: 3,
                            type: "pct",
                          },
                          borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                          },
                        }),
                        new TableCell({
                          children: [new Paragraph(listItem)],
                          width: {
                            size: 97,
                            type: "pct",
                          },
                          borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                          },
                        }),
                      ],
                    }),
                ),
              })
            default:
              return new Paragraph("")
          }
        }),
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const fileName = getDefaultFileName(content, "docx")
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast({ title: "Success", description: `Word document "${fileName}" generated successfully!` })
  playSound("/sounds/success.mp3")
}

export const generatePlainText = (content: string): string => {
  return marked
    .lexer(content)
    .reduce((acc: string, item: any) => {
      switch (item.type) {
        case "heading":
          return `${acc}${"\n".repeat(2)}${"#".repeat(item.depth)} ${item.text}\n`
        case "paragraph":
          return `${acc}${"\n".repeat(2)}${item.text}\n`
        case "list":
          return `${acc}${"\n".repeat(2)}${item.items.map((listItem: string) => `• ${listItem}\n`).join("")}`
        default:
          return acc
      }
    }, "")
    .trim()
}

export const downloadPlainText = (content: string): void => {
  const plainText = generatePlainText(content)
  const fileName = getDefaultFileName(content, "txt")
  const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  toast({ title: "Success", description: `Plain text file "${fileName}" downloaded successfully!` })
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

function getDefaultFileName(content: string, extension: string): string {
  const words = content.trim().split(/\s+/)
  const firstFewWords = words.slice(0, 3).join(" ")
  return `${firstFewWords.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.${extension}`
}

